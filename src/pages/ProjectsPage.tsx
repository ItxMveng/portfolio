import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, FolderOpen, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SEOHead } from '../components/layout/SEOHead';
import { SectionLabel, SectionTitle, Tag } from '../components/ui';
import { useProjects } from '../hooks/useProjects';
import { staggerContainer, staggerItem } from '../lib/animations';
import { normalizeExternalUrlField } from '../lib/external-links';

const PageWrapper = styled.div`
  min-height: 100vh;
  padding-top: 100px;
`;

const PageHeader = styled.section`
  padding: 4rem 0 3rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 300px;
    background: radial-gradient(
      ellipse at center,
      rgba(124, 92, 252, 0.12) 0%,
      transparent 70%
    );
    filter: blur(40px);
    pointer-events: none;
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

const HeaderContent = styled(motion.div)`
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.0625rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;

const FiltersBar = styled.div`
  padding: 1.5rem 0 2.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)<{ $active: boolean }>`
  padding: 0.45rem 1.1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $active, theme }) =>
    $active
      ? `
        background: ${theme.colors.accent};
        color: #fff;
        border-color: ${theme.colors.accent};
        box-shadow: 0 0 16px ${theme.colors.accentGlow};
      `
      : `
        background: ${theme.colors.surface};
        color: ${theme.colors.textSecondary};
        border-color: ${theme.colors.surfaceBorder};
        &:hover {
          border-color: ${theme.colors.accent};
          color: ${theme.colors.accent};
          background: ${theme.colors.accentDim};
        }
      `}
`;

const ResultCount = styled.span`
  margin-left: auto;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding-bottom: 6rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
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

  &:hover {
    border-color: rgba(124, 92, 252, 0.35);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-4px);
  }
`;

const ProjectCover = styled.div<{ $hasCover: boolean }>`
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  position: relative;
  background: ${({ $hasCover, theme }) =>
    $hasCover
      ? 'transparent'
      : `linear-gradient(135deg, ${theme.colors.accentDim}, ${theme.colors.tealDim})`};

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
  opacity: 0.45;
`;

const CoverBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.2rem 0.6rem;
  background: rgba(10, 10, 15, 0.82);
  backdrop-filter: blur(8px);
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.2rem 0.6rem;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(124, 92, 252, 0.3);
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

const CardBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  flex: 1;
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em;
  line-height: 1.3;
`;

const ProjectYear = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
  flex-shrink: 0;
  padding-top: 2px;
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
  gap: 0.35rem;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  margin-top: auto;
`;

const IconLinks = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const IconLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.radii.sm};
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

const SkeletonCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
`;

const SkeletonShimmer = styled.div`
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface} 25%,
    ${({ theme }) => theme.colors.surfaceHover} 50%,
    ${({ theme }) => theme.colors.surface} 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
`;

const EmptyState = styled(motion.div)`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 5rem 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CATEGORY_ICONS: Record<string, string> = {
  Web: '🌐',
  AI: '🤖',
  Mobile: '📱',
  Data: '🗄️',
  Automatisation: '⚡',
  Other: '🔧',
};

function getCoverPlaceholder(category: string) {
  return CATEGORY_ICONS[category] ?? '🔧';
}

export default function ProjectsPage() {
  const { projects, loading } = useProjects();
  const [activeCategory, setActiveCategory] = useState('Tous');

  const categories = useMemo(
    () => ['Tous', ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  );

  const filtered =
    activeCategory === 'Tous'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <PageWrapper>
      <SEOHead
        title="Projets"
        description="Realisations en developpement web, IA, automatisation et integration de donnees."
      />
      <PageHeader>
        <Container>
          <HeaderContent variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={staggerItem}>
              <SectionLabel>Realisations</SectionLabel>
            </motion.div>
            <motion.div variants={staggerItem}>
              <SectionTitle>
                Projets classes par <span>domaine d&apos;expertise</span>
              </SectionTitle>
            </motion.div>
            <motion.div variants={staggerItem}>
              <PageSubtitle>
                Applications web, agents IA, automatisations et integrations de donnees -
                chaque projet resout un probleme reel.
              </PageSubtitle>
            </motion.div>
          </HeaderContent>
        </Container>
      </PageHeader>

      <Container>
        <FiltersBar>
          {categories.map((category) => (
            <FilterButton
              key={category}
              $active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {category}
            </FilterButton>
          ))}
          {!loading && (
            <ResultCount>
              {filtered.length} projet{filtered.length !== 1 ? 's' : ''}
            </ResultCount>
          )}
        </FiltersBar>

        <AnimatePresence mode="wait">
          {loading ? (
            <ProjectsGrid key="skeleton">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <SkeletonCard key={index}>
                  <SkeletonShimmer style={{ height: '180px' }} />
                  <div
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <SkeletonShimmer style={{ height: '20px', width: '70%' }} />
                    <SkeletonShimmer style={{ height: '14px' }} />
                    <SkeletonShimmer style={{ height: '14px', width: '85%' }} />
                    <SkeletonShimmer style={{ height: '14px', width: '60%' }} />
                  </div>
                </SkeletonCard>
              ))}
            </ProjectsGrid>
          ) : (
            <ProjectsGrid
              key={activeCategory}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filtered.length === 0 ? (
                <EmptyState initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <FolderOpen size={40} strokeWidth={1} />
                  <p style={{ fontSize: '1rem' }}>Aucun projet dans cette categorie.</p>
                </EmptyState>
              ) : (
                filtered.map((project) => (
                  <ProjectCard key={project.id} variants={staggerItem}>
                    <ProjectCover $hasCover={!!project.cover_url}>
                      {project.cover_url ? (
                        <img src={project.cover_url} alt={project.title} loading="lazy" />
                      ) : (
                        <CoverPlaceholder>{getCoverPlaceholder(project.category)}</CoverPlaceholder>
                      )}
                      <CoverBadge>{project.category}</CoverBadge>
                      {project.featured && <FeaturedBadge>Featured</FeaturedBadge>}
                    </ProjectCover>

                    <CardBody>
                      <CardTop>
                        <ProjectTitle>{project.title}</ProjectTitle>
                        <ProjectYear>{new Date(project.created_at).getFullYear()}</ProjectYear>
                      </CardTop>

                      <ProjectDesc>{project.short_description}</ProjectDesc>

                      <TechStack>
                        {project.tech_stack.slice(0, 4).map((tech, index) => (
                          <Tag key={`${project.id}-${tech}-${index}`}>{tech}</Tag>
                        ))}
                        {project.tech_stack.length > 4 && (
                          <Tag>+{project.tech_stack.length - 4}</Tag>
                        )}
                      </TechStack>

                      <CardFooter>
                        <IconLinks>
                          {project.github_url && (
                            <IconLink
                              href={normalizeExternalUrlField(project.github_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="GitHub"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github size={13} />
                            </IconLink>
                          )}
                          {project.live_url && (
                            <IconLink
                              href={normalizeExternalUrlField(project.live_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Site en ligne"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={13} />
                            </IconLink>
                          )}
                        </IconLinks>
                        <DetailLink to={`/projects/${project.slug}`}>
                          Voir le projet <ArrowUpRight size={13} />
                        </DetailLink>
                      </CardFooter>
                    </CardBody>
                  </ProjectCard>
                ))
              )}
            </ProjectsGrid>
          )}
        </AnimatePresence>
      </Container>
    </PageWrapper>
  );
}
