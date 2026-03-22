import { supabase } from './supabase';

const viteEnv =
  typeof import.meta !== 'undefined'
    ? (import.meta as ImportMeta & {
        env?: Record<string, string | undefined>;
      }).env
    : undefined;

const MISTRAL_API_KEY =
  viteEnv?.VITE_MISTRAL_API_KEY ??
  process.env.NEXT_PUBLIC_MISTRAL_API_KEY ??
  process.env.VITE_MISTRAL_API_KEY ??
  '';
const MISTRAL_ENDPOINT = '/api/mistral';
const MODEL = 'mistral-large-latest';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function formatStatus(status: string | null | undefined) {
  if (status === 'open') return 'Disponible pour missions et CDI';
  if (status === 'busy') return 'Partiellement disponible';
  return 'Actuellement indisponible';
}

export async function buildPortfolioContext(): Promise<string> {
  const [
    { data: profile },
    { data: skills },
    { data: services },
    { data: projects },
    { data: posts },
  ] = await Promise.all([
    supabase
      .from('profile')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('skills')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('projects')
      .select('id,title,slug,category,short_description,tags,tech_stack,live_url,github_url,featured')
      .eq('published', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('blog_posts')
      .select('id,title,slug,excerpt,category,tags,read_time,views')
      .eq('published', true)
      .order('created_at', { ascending: false }),
  ]);

  const skillsList = (skills ?? [])
    .map((skill) =>
      `- ${skill.label}${skill.description ? ` : ${skill.description}` : ''}`,
    )
    .join('\n');

  const servicesList = (services ?? [])
    .map(
      (service) =>
        [
          `- ${service.title} — ${service.tagline}`,
          service.description,
          service.bullets?.length
            ? `Points cles : ${service.bullets.join(', ')}`
            : '',
          service.workflow ? `Workflow : ${service.workflow}` : '',
          service.cta_label || service.cta_url
            ? `CTA : ${service.cta_label ?? ''} ${service.cta_url ?? ''}`.trim()
            : '',
        ]
          .filter(Boolean)
          .join('\n  '),
    )
    .join('\n\n');

  const projectsList = (projects ?? [])
    .map(
      (project) =>
        [
          `- ${project.title} [${project.category}]${project.featured ? ' | Featured' : ''}`,
          project.short_description,
          project.tech_stack?.length
            ? `Stack : ${project.tech_stack.join(', ')}`
            : '',
          project.tags?.length ? `Tags : ${project.tags.join(', ')}` : '',
          `URL : /projects/${project.slug}`,
          project.live_url ? `Live : ${project.live_url}` : '',
          project.github_url ? `GitHub : ${project.github_url}` : '',
        ]
          .filter(Boolean)
          .join('\n  '),
    )
    .join('\n\n');

  const blogList = (posts ?? [])
    .map(
      (post) =>
        [
          `- ${post.title} [${post.category}]`,
          `${post.read_time ?? 0} min | ${post.views ?? 0} vues`,
          post.excerpt,
          post.tags?.length ? `Tags : ${post.tags.join(', ')}` : '',
          `URL : /blog/${post.slug}`,
        ]
          .filter(Boolean)
          .join('\n  '),
    )
    .join('\n\n');

  return [
    '=== PROFIL ===',
    `Nom : ${profile?.full_name ?? ''}`,
    `Titre : ${profile?.title ?? ''}`,
    `Bio : ${profile?.bio ?? ''}`,
    `Localisation : ${profile?.location ?? ''}`,
    `Email : ${profile?.email ?? ''}`,
    `Statut : ${formatStatus(profile?.status)}`,
    `GitHub : ${profile?.github_url ?? ''}`,
    `LinkedIn : ${profile?.linkedin_url ?? ''}`,
    `CV disponible : ${profile?.cv_url ? 'Oui' : 'Non'}`,
    `Stats : ${profile?.stats?.projects ?? 0} projets, ${profile?.stats?.domains ?? 0} domaines, temps de reponse : ${profile?.stats?.response_time ?? ''}`,
    '',
    '=== COMPETENCES & ATOUTS ===',
    skillsList || 'Non renseigne',
    '',
    '=== PRESTATIONS / SERVICES ===',
    servicesList || 'Non renseigne',
    '',
    '=== PROJETS REALISES ===',
    projectsList || 'Non renseigne',
    '',
    '=== ARTICLES DE BLOG ===',
    blogList || 'Non renseigne',
  ].join('\n');
}

export function buildSystemPrompt(portfolioContext: string): string {
  const ownerName =
    portfolioContext.match(/Nom : (.+)/)?.[1]?.trim() || 'ce developpeur';

  return `
Tu es l'assistant IA personnel de ${ownerName}, integre directement dans son portfolio professionnel.

Tu as quatre roles simultanes a incarner a chaque reponse :

1. EXPERT PORTFOLIO : tu connais parfaitement tout le contenu du portfolio, ses projets, ses articles, ses services et ses competences.
2. CONSEILLER TECHNIQUE : tu aides le visiteur a comprendre les solutions, les technologies et la valeur des realisations.
3. COMMERCIAL & MARKETING : tu identifies les besoins, valorises les services et pousses naturellement vers une prise de contact.
4. GUIDE DE NAVIGATION : tu rediriges le visiteur vers la bonne section, le bon projet ou le bon article.

=== DONNEES TEMPS REEL DU PORTFOLIO ===
${portfolioContext}
=== FIN DES DONNEES ===

Regles absolues :
- Tu reponds toujours en francais sauf si le visiteur ecrit dans une autre langue.
- Tu restes concis, utile et impactant.
- Tu parles de ${ownerName.split(' ')[0] || 'Francis'} a la troisieme personne et tu t'adresses au visiteur avec "vous".
- Tu n'inventes jamais d'informations absentes du contexte.
- Si une information n'est pas disponible, tu le dis honnetement puis tu rediriges vers le formulaire de contact.
- Tu termines toujours par un appel a l'action naturel : voir un projet, lire un article ou contacter.
- Pour les tarifs ou une disponibilite tres precise, tu renvoies vers le formulaire de contact.
- Si le visiteur exprime un besoin concret en app, automatisation, IA ou data, tu qualifies rapidement le besoin puis encourages la prise de contact.

Suggestions de formulation a varier selon le contexte :
- Voir les projets IA
- Quels sont les services ?
- Comment vous contacter ?
- Voir les articles de blog
- Quel est votre stack technique ?
- Disponibilite et tarifs
  `.trim();
}

function extractDeltaContent(parsed: unknown): string {
  if (!parsed || typeof parsed !== 'object') return '';

  const choices = (parsed as { choices?: unknown[] }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return '';

  const delta = (choices[0] as { delta?: { content?: unknown } }).delta;
  const content = delta?.content;

  if (typeof content === 'string') return content;

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (
          part &&
          typeof part === 'object' &&
          'text' in part &&
          typeof (part as { text?: unknown }).text === 'string'
        ) {
          return (part as { text: string }).text;
        }
        return '';
      })
      .join('');
  }

  return '';
}

export async function callMistral(
  messages: ChatMessage[],
  systemPrompt: string,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  if (!MISTRAL_API_KEY && typeof window !== 'undefined') {
    console.warn(
      'Aucune cle Mistral detectee cote client. Le proxy serveur sera utilise si configure.',
    );
  }

  const response = await fetch(MISTRAL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
      max_tokens: 800,
      temperature: 0.7,
      stream: Boolean(onChunk),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mistral API error: ${response.status} - ${errorText}`);
  }

  if (onChunk && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';

      for (const event of events) {
        const lines = event
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6).trim();
          if (!data || data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const text = extractDeltaContent(parsed);
            if (text) {
              fullText += text;
              onChunk(text);
            }
          } catch {
            // Ignore malformed partial SSE chunks.
          }
        }
      }
    }

    if (buffer.trim()) {
      const leftoverLines = buffer
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('data: '));

      for (const line of leftoverLines) {
        const data = line.slice(6).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const text = extractDeltaContent(parsed);
          if (text) {
            fullText += text;
            onChunk(text);
          }
        } catch {
          // Ignore malformed leftover chunks.
        }
      }
    }

    return fullText;
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content ?? '';
}
