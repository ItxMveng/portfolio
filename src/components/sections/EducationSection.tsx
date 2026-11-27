import { GraduationCap } from 'lucide-react';
import styled from 'styled-components';
import { SectionLabel, SectionTitle } from '../ui';

// Parcours vérifié dans le profil de référence fourni par Francis.
const education = [
  {
    school: 'École Nationale d’Ingénieurs de Brest',
    shortName: 'ENIB',
    degree: 'Formation d’ingénieur généraliste',
    dates: '2026–2027',
    status: '5e année · En cours',
    description: 'Dernière année du cursus ingénieur, en double diplôme avec le Master 2 SIIA de l’Université de Bretagne Occidentale.',
  },
  {
    school: 'Université de Bretagne Occidentale',
    shortName: 'UBO',
    degree: 'Master 2 SIIA',
    dates: '2026–2027',
    status: 'Double diplôme · En cours',
    description: 'Systèmes Interactifs, Intelligents et Autonomes : une spécialisation au croisement de l’intelligence artificielle et des systèmes interactifs.',
  },
  {
    school: 'Institut Africain d’Informatique',
    shortName: 'IAI',
    degree: 'Ingénieur des Travaux Informatiques',
    dates: '2020–2023',
    status: 'Diplôme obtenu',
    description: 'Une première formation en informatique, prolongée par le cursus d’ingénieur et la spécialisation en systèmes intelligents.',
  },
];

const Section = styled.section`
  padding: 5rem 0;
  scroll-margin-top: 6rem;
  background: ${({ theme }) => theme.colors.bg};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
`;
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) { padding: 0 2rem; }
`;
const Intro = styled.p`
  max-width: 650px;
  margin: 1rem 0 2.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;
const Grid = styled.ol`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
const Card = styled.li`
  padding: 1.75rem;
  min-width: 0;
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-top: 3px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.bgCard};
  box-shadow: ${({ theme }) => theme.shadows.card};
  &:last-child { border-top-color: ${({ theme }) => theme.colors.sun}; }
  h3 { margin: 1.25rem 0 0.65rem; font-size: 1.25rem; line-height: 1.3; }
  p { color: ${({ theme }) => theme.colors.textSecondary}; line-height: 1.65; }
  .school { font-weight: 600; min-height: 3.3em; margin-bottom: 1rem; }
  .description { margin-top: 1rem; font-size: 0.925rem; }
`;
const CardTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 700;
  span { display: inline-flex; align-items: center; gap: 0.5rem; }
  time { color: ${({ theme }) => theme.colors.textMuted}; font-size: 0.875rem; }
`;
const Status = styled.span`
  display: inline-block;
  padding: 0.35rem 0.65rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.textAccent};
  font-size: 0.8rem;
  font-weight: 600;
`;

export function EducationSection() {
  return (
    <Section id="education" aria-labelledby="education-title">
      <Container>
        <SectionLabel>Éducation</SectionLabel>
        <SectionTitle id="education-title">Mon parcours de <span>formation</span></SectionTitle>
        <Intro>De l’informatique aux systèmes interactifs intelligents, un parcours qui relie conception logicielle, intelligence artificielle et interaction.</Intro>
        <Grid>
          {education.map((item) => (
            <Card key={item.shortName}>
              <CardTop><span><GraduationCap size={20} aria-hidden="true" />{item.shortName}</span><time>{item.dates}</time></CardTop>
              <h3>{item.degree}</h3>
              <p className="school">{item.school}</p>
              <Status>{item.status}</Status>
              <p className="description">{item.description}</p>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
