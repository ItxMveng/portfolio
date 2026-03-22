import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SectionLabel, SectionTitle, Tag } from '../../components/ui';
import { useProjects } from '../../hooks/useProjects';
import { defaultViewport, fadeUp, staggerContainer, staggerItem } from '../../lib/animations';

const Section = styled.section`
  padding: 6rem 0;
  background: ${({ theme }) => theme.colors.bgSecondary};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      ${({ theme }) => theme.colors.surfaceBorder},
      transparent
    );
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 2rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 3.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ViewAllLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  transition: gap ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    gap: 0.65rem;
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ProjectCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all ${({ theme }) => theme.transitions.base};
  cursor: pointer;

  &:hover {
    border-color: rgba(124, 92, 252, 0.3);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-4px);
  }
`;

const ProjectCover = styled.div<{ $hasCover: boolean }>`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: ${({ $hasCover, theme }) =>
    $hasCover
      ? 'transparent'
      : `linear-gradient(135deg, ${theme.colors.accentDim}, ${theme.colors.tealDim})`};
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.slow};
  }

  ${ProjectCard}:hover & img {
    transform: scale(1.05);
  }
`;

const CoverPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  opacity: 0.5;
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.65rem;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProjectBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`;

const ProjectTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em;
  line-height: 1.3;
`;

const ProjectDesc = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.65;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const ProjectLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  margin-top: auto;
`;

const ProjectLinkGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
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
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  transition: gap ${({ theme }) => theme.transitions.fast};

  &:hover {
    gap: 0.5rem;
  }
`;

const YearBadge = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

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
          <HeaderLeft>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <SectionLabel>Realisations</SectionLabel>
              <SectionTitle>
                Projets recents classes par <span>domaine d&apos;expertise</span>
              </SectionTitle>
            </motion.div>
          </HeaderLeft>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={defaultViewport}>
            <ViewAllLink to="/projects">
              Tous les projets <ArrowRight size={16} />
            </ViewAllLink>
          </motion.div>
        </SectionHeader>

        <ProjectsGrid
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {latest.map((project) => (
            <ProjectCard key={project.id} variants={staggerItem}>
              <ProjectCover $hasCover={!!project.cover_url}>
                {project.cover_url ? (
                  <img src={project.cover_url} alt={project.title} loading="lazy" />
                ) : (
                  <CoverPlaceholder>
                    {project.category === 'AI' ? '🤖' : project.category === 'Web' ? '🌐' : '⚡'}
                  </CoverPlaceholder>
                )}
                <CategoryBadge>{project.category}</CategoryBadge>
              </ProjectCover>

              <ProjectBody>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                  }}
                >
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <YearBadge>{new Date(project.created_at).getFullYear()}</YearBadge>
                </div>

                <ProjectDesc>{project.short_description}</ProjectDesc>

                <TechStack>
                  {project.tech_stack.slice(0, 4).map((tech) => (
                    <Tag key={`${project.id}-${tech}`}>{tech}</Tag>
                  ))}
                  {project.tech_stack.length > 4 && <Tag>+{project.tech_stack.length - 4}</Tag>}
                </TechStack>

                <ProjectLinks>
                  <ProjectLinkGroup>
                    {project.github_url && (
                      <IconLink
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                      >
                        <Github size={14} />
                      </IconLink>
                    )}
                    {project.live_url && (
                      <IconLink
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Site en ligne"
                      >
                        <ExternalLink size={14} />
                      </IconLink>
                    )}
                  </ProjectLinkGroup>
                  <DetailLink to={`/projects/${project.slug}`}>
                    Voir le projet <ArrowUpRight size={13} />
                  </DetailLink>
                </ProjectLinks>
              </ProjectBody>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </Container>
    </Section>
  );
}
