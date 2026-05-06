import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SectionLabel, SectionTitle, Tag } from '../../components/ui';
import { useProjects } from '../../hooks/useProjects';
import { defaultViewport, fadeUp, staggerContainer, staggerItem } from '../../lib/animations';
import { normalizeExternalUrlField } from '../../lib/external-links';

/* Section 3 → gris léger */
const Section = styled.section`
  padding: 6rem 0;
  background: ${({ theme }) => theme.colors.bgTertiary};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, ${({ theme }) => theme.colors.divider} 30%, ${({ theme }) => theme.colors.divider} 70%, transparent);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) { padding: 0 2rem; }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 3rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
`;

const ViewAllLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  white-space: nowrap;
  flex-shrink: 0;
  transition: gap ${({ theme }) => theme.transitions.fast};
  &:hover { gap: 0.65rem; }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) { grid-template-columns: repeat(3, 1fr); }
`;

const ProjectCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.35s cubic-bezier(0.16,1,0.3,1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(to right, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.teal});
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 1;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent}33;
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-6px) scale(1.02);
    &::before { opacity: 1; }
  }
`;

const ProjectCover = styled.div<{ $has: boolean }>`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: ${({ $has, theme }) => $has ? 'transparent' : theme.colors.accentDim};
  position: relative;
  overflow: hidden;

  img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
  }
  ${ProjectCard}:hover & img { transform: scale(1.06); }
`;

const CoverPlaceholder = styled.div`
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 2.25rem; opacity: 0.45;
`;

const CatBadge = styled.div`
  position: absolute; top: 0.75rem; left: 0.75rem;
  padding: 0.2rem 0.6rem;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.68rem; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProjectBody = styled.div`
  padding: 1.375rem;
  display: flex; flex-direction: column; gap: 0.875rem; flex: 1;
`;

const ProjectTitle = styled.h3`
  font-size: 1rem; font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em; line-height: 1.3;
`;

const ProjectDesc = styled.p`
  font-size: 0.875rem; color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.65; flex: 1;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
`;

const TechStack = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.35rem;
`;

const ProjectFooter = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 0.875rem;
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  margin-top: auto;
`;

const IconLink = styled.a`
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 30px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }
`;

const DetailLink = styled(Link)`
  display: inline-flex; align-items: center; gap: 0.3rem;
  font-size: 0.8125rem; font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  transition: gap ${({ theme }) => theme.transitions.fast};
  &:hover { gap: 0.5rem; }
`;

const YearTag = styled.span`
  font-size: 0.72rem; color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

function TiltCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useTransform(y, [-60, 60], [3, -3]);
  const ry = useTransform(x, [-60, 60], [-3, 3]);
  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (r.left + r.width / 2));
        y.set(e.clientY - (r.top + r.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

export function ProjectsPreviewSection() {
  const { projects, loading } = useProjects();
  const latest = [...projects]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  if (loading || latest.length === 0) return null;

  return (
    <Section id="projects-preview">
      <Container>
        <SectionHeader>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <SectionLabel>Réalisations</SectionLabel>
            <SectionTitle>
              Projets récents classés par <span>domaine</span>
            </SectionTitle>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={defaultViewport}>
            <ViewAllLink to="/projects">Tous les projets <ArrowRight size={15} /></ViewAllLink>
          </motion.div>
        </SectionHeader>

        <ProjectsGrid
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {latest.map((project) => (
            <TiltCard key={project.id}>
              <ProjectCard variants={staggerItem}>
                <ProjectCover $has={!!project.cover_url}>
                  {project.cover_url ? (
                    <img src={project.cover_url} alt={project.title} loading="lazy" />
                  ) : (
                    <CoverPlaceholder>
                      {project.category === 'AI' ? '🤖' : project.category === 'Web' ? '🌐' : '⚡'}
                    </CoverPlaceholder>
                  )}
                  <CatBadge>{project.category}</CatBadge>
                </ProjectCover>

                <ProjectBody>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <YearTag>{new Date(project.created_at).getFullYear()}</YearTag>
                  </div>

                  <ProjectDesc>{project.short_description}</ProjectDesc>

                  <TechStack>
                    {project.tech_stack.slice(0, 4).map((tech) => (
                      <Tag key={`${project.id}-${tech}`}>{tech}</Tag>
                    ))}
                    {project.tech_stack.length > 4 && <Tag>+{project.tech_stack.length - 4}</Tag>}
                  </TechStack>

                  <ProjectFooter>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {project.github_url && (
                        <IconLink href={normalizeExternalUrlField(project.github_url)} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                          <Github size={13} />
                        </IconLink>
                      )}
                      {project.live_url && (
                        <IconLink href={normalizeExternalUrlField(project.live_url)} target="_blank" rel="noopener noreferrer" aria-label="Démo">
                          <ExternalLink size={13} />
                        </IconLink>
                      )}
                    </div>
                    <DetailLink to={`/projects/${project.slug}`}>
                      Voir le projet <ArrowUpRight size={12} />
                    </DetailLink>
                  </ProjectFooter>
                </ProjectBody>
              </ProjectCard>
            </TiltCard>
          ))}
        </ProjectsGrid>
      </Container>
    </Section>
  );
}
