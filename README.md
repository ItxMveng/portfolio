# Portfolio premium (React + Node + Vercel)

Site portfolio conçu pour :
- vous présenter professionnellement,
- montrer vos travaux,
- vendre vos prestations avec une logique de conversion.

## Stack
- **React** via Next.js
- **Node** via route API `app/api/contact/route.ts`
- **Vercel-ready** (déploiement direct)

## Lancer en local
```bash
npm install
npm run dev
```

## Déployer sur Vercel
1. Push sur GitHub
2. Importer le repository dans Vercel
3. Déployer (aucune configuration supplémentaire requise)

## Prochaine étape recommandée
Connecter `/api/contact` à :
- Brevo / Resend / SendGrid,
- HubSpot / Notion / Airtable,
- ou un webhook d'automatisation.
