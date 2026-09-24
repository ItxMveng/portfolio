import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#FFFAF1" />
        <meta name="robots" content="index, follow" />
        <meta
          name="description"
          content="Ingénieur informatique — IA, automatisation et applications sur mesure."
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500..800;1,9..144,500..700&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
