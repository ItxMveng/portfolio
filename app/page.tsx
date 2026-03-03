const services = [
  {
    title: "Design d'expérience haut de gamme",
    description:
      "Audit UX, architecture d'information, UI systems et micro-interactions pour fluidifier chaque parcours.",
  },
  {
    title: "Sites vitrines orientés conversion",
    description:
      "Conception de pages et tunnels pensés pour transformer vos visiteurs en rendez-vous qualifiés.",
  },
  {
    title: "Accompagnement croissance",
    description:
      "Optimisation continue, A/B testing, storytelling de marque et support stratégique pour scaler vos résultats.",
  },
];

const projects = [
  {
    name: "Maison Épure",
    result: "+54% de demandes de devis en 8 semaines",
    stack: "UX Research · React · Analytics",
  },
  {
    name: "Nova Conseil",
    result: "Temps moyen sur page x2.1",
    stack: "Branding · Design System · SEO",
  },
  {
    name: "Atelier Atlas",
    result: "Taux de conversion landing +37%",
    stack: "Copywriting · Funnel · Motion UI",
  },
];

export default function HomePage() {
  return (
    <main>
      <header className="hero section">
        <p className="tag">Portfolio premium • React + Node + Vercel</p>
        <h1>
          Je conçois des expériences digitales élégantes, fluides et redoutables pour convertir vos prospects.
        </h1>
        <p className="subtitle">
          Positionnement pro, showcases impactants, argumentaire de services clair: tout est pensé comme un tunnel
          de captivation et de conversion.
        </p>
        <div className="actions">
          <a href="#contact" className="btn btn-primary">
            Réserver un appel stratégique
          </a>
          <a href="#projects" className="btn btn-secondary">
            Voir mes réalisations
          </a>
        </div>
      </header>

      <section className="section" id="services">
        <h2>Prestations de service</h2>
        <div className="grid">
          {services.map((service) => (
            <article className="card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="projects">
        <h2>Travaux sélectionnés</h2>
        <div className="grid">
          {projects.map((project) => (
            <article className="card project" key={project.name}>
              <h3>{project.name}</h3>
              <p className="result">{project.result}</p>
              <p>{project.stack}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section cta" id="contact">
        <h2>Prêt à transformer votre présence digitale ?</h2>
        <p>Décrivez votre objectif en 30 secondes, je vous réponds avec une feuille de route claire.</p>
        <form action="/api/contact" method="post" className="contact-form">
          <input name="name" placeholder="Votre nom" required />
          <input name="email" type="email" placeholder="Votre email pro" required />
          <textarea name="goal" placeholder="Votre enjeu business" required rows={4} />
          <button type="submit" className="btn btn-primary">
            Envoyer ma demande
          </button>
        </form>
      </section>
    </main>
  );
}
