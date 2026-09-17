-- Enrichissement technique du projet MathWave (extraits réels du dépôt ItxMveng/MathWave)
-- Ajoute une section « Plongée technique » à la fin des blocs existants.
-- Idempotent : ne fait rien si la section a déjà été ajoutée.
-- À exécuter dans Supabase > SQL Editor, APRÈS avoir relu le contenu.

update public.projects
set
  blocks = coalesce(blocks, '[]'::jsonb) || $mw$[
  {
    "id": "mw-tech-divider",
    "type": "divider"
  },
  {
    "id": "mw-tech-heading",
    "type": "heading",
    "content": "Plongée technique : la chaîne de traitement du signal",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "mw-tech-intro",
    "type": "paragraph",
    "content": "Les deux modes de MathWave reposent sur la même idée : un son n'est qu'une suite d'échantillons, donc une fonction discrète. Toute la difficulté est ailleurs — <strong>décoder</strong> des formats compressés, <strong>analyser</strong> un spectre sans librairie lourde, et <strong>générer</strong> un son propre à partir d'expressions qui peuvent diverger. Voici les choix structurants, le code qui les implémente et les compromis assumés."
  },
  {
    "id": "mw-dec-fft",
    "type": "tech_decision",
    "content": "Une FFT écrite from scratch plutôt qu'une librairie DSP",
    "meta": {
      "context": "Projet académique ENIB : l'objectif était de maîtriser la chaîne de traitement du signal, pas seulement de l'utiliser. Côté produit, l'analyse ne porte que sur un bloc de 8 192 échantillons pour en extraire une fréquence dominante — un besoin très ciblé.",
      "choice": "Implémentation itérative de l'algorithme de Cooley-Tukey (radix-2, en place) : permutation par inversion de bits puis étages « butterfly ». Environ 50 lignes, zéro dépendance, complexité O(n log n).",
      "alternatives": [
        {
          "name": "JTransforms",
          "reason": "très performante, mais une dépendance entière pour un seul appel de FFT."
        },
        {
          "name": "TarsosDSP",
          "reason": "framework audio complet (pitch, filtres, effets), surdimensionné pour trouver un pic spectral."
        }
      ],
      "tradeoffs": "La taille du bloc doit être une puissance de 2 (complétée par des zéros via nextPowerOf2). La résolution fréquentielle vaut 44 100 / 8 192 ≈ 5,4 Hz par case : suffisant pour identifier une note, pas pour distinguer deux fréquences très proches."
    }
  },
  {
    "id": "mw-code-fft",
    "type": "code",
    "content": "// SimpleFFT.java — Cooley-Tukey in-place radix-2 DIT (n = puissance de 2)\npublic static void fft(double[] re, double[] im) {\n    int n = re.length;\n\n    // Permutation par inversion de bits\n    for (int i = 1, j = 0; i < n; i++) {\n        int bit = n >> 1;\n        for (; (j & bit) != 0; bit >>= 1) j ^= bit;\n        j ^= bit;\n        if (i < j) {\n            double t = re[i]; re[i] = re[j]; re[j] = t;\n            t = im[i]; im[i] = im[j]; im[j] = t;\n        }\n    }\n\n    // Étages « butterfly » : on double la taille du bloc à chaque passe\n    for (int len = 2; len <= n; len <<= 1) {\n        double ang = -2.0 * Math.PI / len;\n        double wRe = Math.cos(ang), wIm = Math.sin(ang);\n        for (int i = 0; i < n; i += len) {\n            double curRe = 1, curIm = 0;\n            for (int j = 0; j < len / 2; j++) {\n                double uRe = re[i + j], uIm = im[i + j];\n                double vRe = re[i + j + len / 2] * curRe - im[i + j + len / 2] * curIm;\n                double vIm = re[i + j + len / 2] * curIm + im[i + j + len / 2] * curRe;\n                re[i + j] = uRe + vRe;              im[i + j] = uIm + vIm;\n                re[i + j + len / 2] = uRe - vRe;    im[i + j + len / 2] = uIm - vIm;\n                double newRe = curRe * wRe - curIm * wIm;\n                curIm = curRe * wIm + curIm * wRe;\n                curRe = newRe;\n            }\n        }\n    }\n}",
    "meta": {
      "language": "java",
      "filename": "domain/SimpleFFT.java",
      "caption": "L'inversion de bits réordonne les échantillons pour que chaque passe combine des paires de blocs déjà transformés. À chaque étage, (curRe, curIm) parcourt les racines de l'unité : c'est la rotation complexe e^(-2iπk/len) calculée incrémentalement, sans appel à Complex ni allocation."
    }
  },
  {
    "id": "mw-dec-decode",
    "type": "tech_decision",
    "content": "Décodage audio avec MediaCodec et MediaExtractor natifs",
    "meta": {
      "context": "L'utilisateur importe du MP3, AAC, OGG ou WAV. Une FFT a besoin d'échantillons PCM bruts, alors que ces formats sont compressés et souvent stéréo. L'APK devait rester léger.",
      "choice": "MediaExtractor isole la piste audio, MediaCodec la décode en PCM 16 bits little-endian, puis les canaux sont moyennés (downmix mono) et normalisés dans [-1, 1]. La lecture est plafonnée à 10 secondes.",
      "alternatives": [
        {
          "name": "FFmpeg (bindings Android)",
          "reason": "couvre tous les formats mais alourdit l'APK de plusieurs dizaines de Mo."
        },
        {
          "name": "MediaPlayer",
          "reason": "joue le fichier mais ne donne jamais accès aux échantillons."
        }
      ],
      "tradeoffs": "Les formats supportés dépendent des codecs présents sur le téléphone. Les échantillons sont stockés dans une List<Short> : simple à écrire, mais coûteux en mémoire (boxing), d'où la limite de 10 s."
    }
  },
  {
    "id": "mw-code-decode",
    "type": "code",
    "content": "// AudioAnalyzer.java — boucle MediaCodec : compressé → PCM 16 bits → mono\nint maxSamples = sampleRate * 10; // 10 s max\n\nwhile (pcmList.size() < maxSamples) {\n    if (!inputDone) {\n        int inIdx = codec.dequeueInputBuffer(100_000);\n        if (inIdx >= 0) {\n            ByteBuffer inBuf = codec.getInputBuffer(inIdx);\n            inBuf.clear();\n            int size = extractor.readSampleData(inBuf, 0);\n            if (size <= 0) {\n                codec.queueInputBuffer(inIdx, 0, 0, 0, MediaCodec.BUFFER_FLAG_END_OF_STREAM);\n                inputDone = true;\n            } else {\n                codec.queueInputBuffer(inIdx, 0, size, extractor.getSampleTime(), 0);\n                extractor.advance();\n            }\n        }\n    }\n\n    int outIdx = codec.dequeueOutputBuffer(info, 100_000);\n    if (outIdx >= 0) {\n        ByteBuffer outBuf = codec.getOutputBuffer(outIdx);\n        outBuf.order(ByteOrder.LITTLE_ENDIAN);\n        while (outBuf.remaining() >= channelCount * 2 && pcmList.size() < maxSamples) {\n            int sum = 0;\n            for (int c = 0; c < channelCount; c++) sum += outBuf.getShort();\n            pcmList.add((short) (sum / channelCount)); // downmix mono\n        }\n        codec.releaseOutputBuffer(outIdx, false);\n    }\n}",
    "meta": {
      "language": "java",
      "filename": "domain/AudioAnalyzer.java",
      "caption": "Le codec fonctionne comme une file : on pousse des paquets compressés en entrée, on récupère des tampons PCM en sortie, avec un timeout de 100 ms de chaque côté. Le drapeau END_OF_STREAM signale la fin du fichier au décodeur."
    }
  },
  {
    "id": "mw-code-analyzer",
    "type": "code",
    "content": "// AudioAnalyzer.java — fenêtrage de Hann puis recherche du pic spectral\nint fftSize = SimpleFFT.nextPowerOf2(Math.min(samples.length, 8192));\ndouble[] re = new double[fftSize];\ndouble[] im = new double[fftSize];\n\nfor (int i = 0; i < fftSize; i++) {\n    double window = 0.5 * (1 - Math.cos(2.0 * Math.PI * i / (fftSize - 1)));\n    re[i] = (i < samples.length ? samples[i] : 0.0) * window;\n}\n\nSimpleFFT.fft(re, im);\ndouble[] mag = SimpleFFT.magnitude(re, im);\n\n// On ignore la composante continue et on cherche dans la bande 20–8000 Hz\nint minBin = (int) (20.0 * fftSize / sampleRate);\nint maxBin = Math.min((int) (8000.0 * fftSize / sampleRate), mag.length - 1);\n\nint domBin = minBin;\ndouble domMag = 0;\nfor (int i = minBin; i <= maxBin; i++) {\n    if (mag[i] > domMag) { domMag = mag[i]; domBin = i; }\n}\ndouble dominantFreq = (double) domBin * sampleRate / fftSize;",
    "meta": {
      "language": "java",
      "filename": "domain/AudioAnalyzer.java",
      "caption": "Sans fenêtre, couper le signal net au 8 192ᵉ échantillon crée de fausses fréquences (fuite spectrale). La fenêtre de Hann ramène les bords à zéro. La recherche du pic est restreinte à 20–8 000 Hz pour ignorer la composante continue et le bruit aigu."
    }
  },
  {
    "id": "mw-limits",
    "type": "callout",
    "content": "L'analyse porte sur le premier bloc de 8 192 échantillons, soit environ 186 ms à 44,1 kHz : c'est l'attaque du morceau qui est résumée. Le modèle A × sin(ω × x) est monophonique — sur un accord, seule la composante la plus forte est retenue. L'amplitude A est une heuristique (RMS × 4, bornée à 1). Pistes d'évolution : moyenner plusieurs fenêtres glissantes (STFT) et conserver les N premiers pics pour produire une somme de sinusoïdes.",
    "meta": {
      "variant": "warning"
    }
  },
  {
    "id": "mw-dec-sonify",
    "type": "tech_decision",
    "content": "Sonification par table d'onde plutôt que par hauteur",
    "meta": {
      "context": "L'utilisateur peut saisir n'importe quelle expression : x², ln(x), tan(x)… Les valeurs sont non bornées, parfois infinies ou indéfinies, et le résultat doit rester audible sans clic ni saturation.",
      "choice": "Un cycle de f(x) est échantillonné sur [-π, π] en 2 048 points, les valeurs non finies sont remplacées par 0, une fenêtre de Hann est appliquée et le tout est normalisé. Ce cycle est ensuite rejoué à 440 Hz (La4) pendant 3 s en PCM 16 bits, avec des fondus de 25 ms, via AudioTrack en MODE_STATIC.",
      "alternatives": [
        {
          "name": "Mapper y vers une hauteur de note",
          "reason": "rend la courbe « mélodique », mais on n'entend plus la forme de la fonction."
        },
        {
          "name": "AudioTrack en MODE_STREAM",
          "reason": "utile pour de la synthèse temps réel, inutile pour 3 s de son pré-calculé."
        }
      ],
      "tradeoffs": "Toutes les fonctions sont jouées à la même hauteur : on entend le timbre (sin(x) est pur, x² est plus riche en harmoniques), pas une variation. La fenêtre de Hann appliquée au cycle adoucit aussi le timbre."
    }
  },
  {
    "id": "mw-code-sonify",
    "type": "code",
    "content": "// MathSonifier.java — un cycle de f(x) devient une table d'onde jouée à 440 Hz\nprivate double[] buildWaveform(String expr) {\n    Expression exp = new ExpressionBuilder(expr).variable(\"x\").build();\n    double[] waveform = new double[WAVEFORM_SIZE]; // 2048\n\n    for (int i = 0; i < WAVEFORM_SIZE; i++) {\n        double x = -Math.PI + (2.0 * Math.PI * i / WAVEFORM_SIZE); // x ∈ [-π, π]\n        exp.setVariable(\"x\", x);\n        double y = exp.evaluate();\n        waveform[i] = Double.isFinite(y) ? y : 0.0; // ln(x), tan(x)… peuvent diverger\n    }\n\n    // Fenêtre de Hann : supprime le « clic » à la jonction des cycles\n    for (int i = 0; i < WAVEFORM_SIZE; i++) {\n        waveform[i] *= 0.5 * (1 - Math.cos(2.0 * Math.PI * i / (WAVEFORM_SIZE - 1)));\n    }\n\n    // Normalisation dans [-1, 1] (une fonction constante = silence)\n    double max = 0;\n    for (double v : waveform) max = Math.max(max, Math.abs(v));\n    if (max <= 1e-10) return null;\n    for (int i = 0; i < WAVEFORM_SIZE; i++) waveform[i] /= max;\n    return waveform;\n}\n\nprivate short[] generatePcm(double[] waveform, int totalSamples) {\n    short[] pcm = new short[totalSamples];\n    int fadeLen = SAMPLE_RATE / 40; // fondus de 25 ms\n\n    for (int i = 0; i < totalSamples; i++) {\n        double phase = (i * PLAY_FREQ) / SAMPLE_RATE;\n        int idx = (int) ((phase % 1.0) * WAVEFORM_SIZE);\n        double amplitude = waveform[idx];\n\n        if (i < fadeLen) amplitude *= (double) i / fadeLen;\n        else if (i > totalSamples - fadeLen) amplitude *= (double) (totalSamples - i) / fadeLen;\n\n        pcm[i] = (short) (amplitude * Short.MAX_VALUE * 0.75); // marge anti-saturation\n    }\n    return pcm;\n}",
    "meta": {
      "language": "java",
      "filename": "domain/MathSonifier.java",
      "caption": "La phase (i × 440 / 44 100) indique où l'on se trouve dans le cycle : sa partie fractionnaire sert d'index dans la table d'onde. Le facteur 0,75 garde une marge avant saturation."
    }
  },
  {
    "id": "mw-dec-parser",
    "type": "tech_decision",
    "content": "exp4j pour évaluer les expressions saisies",
    "meta": {
      "context": "Le graphe évalue la fonction en plusieurs centaines de points à chaque modification, et le clavier scientifique produit des expressions comme ln(x) ou sqrt(abs(x)).",
      "choice": "exp4j compile l'expression une fois, puis seule la variable x change à chaque évaluation. Une fonction ln() personnalisée est déclarée, car la notation attendue par l'utilisateur diffère du log() d'exp4j.",
      "alternatives": [
        {
          "name": "Parser maison (shunting-yard)",
          "reason": "formateur, mais long à fiabiliser (priorités, fonctions, erreurs)."
        },
        {
          "name": "Moteur de script (Rhino / JavaScript)",
          "reason": "lourd, lent au démarrage et difficile à sécuriser face à une saisie libre."
        }
      ],
      "tradeoffs": "Les points non finis sont simplement ignorés : le graphe affiche un trou à l'asymptote au lieu de relier les deux branches, ce qui est le comportement voulu."
    }
  },
  {
    "id": "mw-code-parser",
    "type": "code",
    "content": "// MathFunctionParser.java — exp4j + alias ln() pour le clavier scientifique\nprivate static final Function FN_LN = new Function(\"ln\", 1) {\n    @Override\n    public double apply(double... args) {\n        return Math.log(args[0]);\n    }\n};\n\nExpression exp = new ExpressionBuilder(expression)\n        .variable(\"x\")\n        .functions(FN_LN)\n        .build();\n\nvar validation = exp.validate(false);\nif (!validation.isValid()) {\n    return ParseResult.failure(\"Expression invalide : \" + validation.getErrors().get(0));\n}\n\nfor (int i = 0; i <= numPoints; i++) {\n    double x = xMin + i * step;\n    exp.setVariable(\"x\", x);\n    double y = exp.evaluate();\n    if (Double.isFinite(y)) points.add(new float[]{(float) x, (float) y}); // trous = asymptotes\n}",
    "meta": {
      "language": "java",
      "filename": "domain/MathFunctionParser.java",
      "caption": "validate(false) vérifie la syntaxe sans exiger que x ait déjà une valeur. Les erreurs sont remontées telles quelles à l'interface pour guider la saisie."
    }
  }
]$mw$::jsonb,
  updated_at = now()
where slug = 'mathwave-convertisseur-bidirectionnel-entre-mathematiques-et-musique'
  and not coalesce(blocks, '[]'::jsonb) @> '[{"id": "mw-tech-heading"}]'::jsonb;
