import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, ExternalLink, Github, Layers, Tag as TagIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { BlockRenderer } from '../components/blocks/BlockRenderer';
import { SEOHead } from '../components/layout/SEOHead';
import { Spinner, Tag } from '../components/ui';
import { supabase } from '../lib/supabase';
import { fadeUp, staggerContainer, staggerItem } from '../lib/animations';
import type { Project } from '../types';

const PageWrapper = styled.div`
  min-height: 100vh;
  padding-top: 80px;
`;

const HeroSection = styled.div`
  position: relative;
  width: 100%;
  height: 420px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgSecondary};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: 520px;
  }
`;

const HeroCover = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
`;

const HeroPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accentDim},
    ${({ theme }) => theme.colors.tealDim}
  );
  opacity: 0.5;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(10, 10, 15, 0.2) 0%, rgba(10, 10, 15, 0.85) 100%);
`;

const HeroContent = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2.5rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 3rem 2rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: #fff;
  }
`;

const HeroCategory = styled.span`
  display: inline-flex;
  padding: 0.2rem 0.75rem;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(124, 92, 252, 0.3);
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 0.75rem;
`;

const HeroTitle = styled.h1`
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  max-width: 700px;
`;

const HeroLinks = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const HeroLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: none;
`;

const PrimaryHeroLink = styled(HeroLink)`
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
  }
`;

const SecondaryHeroLink = styled(HeroLink)`
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
  }
`;

const ContentLayout = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 6rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 300px;
    padding: 4rem 2rem 6rem;
    align-items: start;
  }
`;

const MainContent = styled(motion.article)``;

const Sidebar = styled(motion.aside)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: sticky;
    top: 100px;
  }
`;

const SidebarCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SidebarCardTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetaLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const MetaValue = styled.span`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
`;

const TechGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const SidebarLinkButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: none;
  width: 100%;
`;

const SidebarPrimary = styled(SidebarLinkButton)`
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
  }
`;

const SidebarSecondary = styled(SidebarLinkButton)`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const LoadingCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
`;

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  height: 60vh;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const NotFoundLink = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

const FallbackText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;

const CATEGORY_ICONS: Record<string, string> = {
  Web: '🌐',
  AI: '🤖',
  Mobile: '📱',
  Data: '🗄️',
  Automatisation: '⚡',
};

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setProject(null);
        else setProject(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <PageWrapper>
        <LoadingCenter>
          <Spinner size={36} />
        </LoadingCenter>
      </PageWrapper>
    );
  }

  if (!project) {
    return (
      <PageWrapper>
        <NotFound>
          <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Projet introuvable</p>
          <NotFoundLink to="/projects">
            <ArrowLeft size={16} /> Retour aux projets
          </NotFoundLink>
        </NotFound>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <SEOHead
        title={project.title}
        description={project.short_description}
        image={project.cover_url || undefined}
        tags={[...project.tags, ...project.tech_stack]}
      />
      <HeroSection>
        {project.cover_url ? (
          <HeroCover src={project.cover_url} alt={project.title} />
        ) : (
          <HeroPlaceholder>{CATEGORY_ICONS[project.category] ?? '🔧'}</HeroPlaceholder>
        )}
        <HeroOverlay />
        <HeroContent
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BackLink to="/projects">
            <ArrowLeft size={15} /> Tous les projets
          </BackLink>
          <HeroCategory>{project.category}</HeroCategory>
          <HeroTitle>{project.title}</HeroTitle>
          <HeroLinks>
            {project.live_url && (
              <PrimaryHeroLink href={project.live_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={15} /> Site en ligne
              </PrimaryHeroLink>
            )}
            {project.github_url && (
              <SecondaryHeroLink href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github size={15} /> GitHub
              </SecondaryHeroLink>
            )}
            {project.demo_url && (
              <SecondaryHeroLink href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={15} /> Demo
              </SecondaryHeroLink>
            )}
          </HeroLinks>
        </HeroContent>
      </HeroSection>

      <ContentLayout>
        <MainContent variants={fadeUp} initial="hidden" animate="visible">
          {project.blocks && project.blocks.length > 0 ? (
            <BlockRenderer blocks={project.blocks} />
          ) : (
            <FallbackText>{project.short_description}</FallbackText>
          )}
        </MainContent>

        <Sidebar variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={staggerItem}>
            <SidebarCard>
              <SidebarCardTitle>Details du projet</SidebarCardTitle>

              <MetaItem>
                <MetaLabel>
                  <Calendar size={12} /> Annee
                </MetaLabel>
                <MetaValue>{new Date(project.created_at).getFullYear()}</MetaValue>
              </MetaItem>

              <MetaItem>
                <MetaLabel>
                  <Layers size={12} /> Categorie
                </MetaLabel>
                <MetaValue>{project.category}</MetaValue>
              </MetaItem>

              {project.tags.length > 0 && (
                <MetaItem>
                  <MetaLabel>
                    <TagIcon size={12} /> Tags
                  </MetaLabel>
                  <TagsRow style={{ marginTop: '0.4rem' }}>
                    {project.tags.map((tag, index) => (
                      <Tag key={`${project.id}-${tag}-${index}`}>{tag}</Tag>
                    ))}
                  </TagsRow>
                </MetaItem>
              )}
            </SidebarCard>
          </motion.div>

          {project.tech_stack.length > 0 && (
            <motion.div variants={staggerItem}>
              <SidebarCard>
                <SidebarCardTitle>Stack technique</SidebarCardTitle>
                <TechGrid>
                  {project.tech_stack.map((tech, index) => (
                    <Tag key={`${project.id}-${tech}-${index}`}>{tech}</Tag>
                  ))}
                </TechGrid>
              </SidebarCard>
            </motion.div>
          )}

          {(project.live_url || project.github_url || project.demo_url) && (
            <motion.div variants={staggerItem}>
              <SidebarCard>
                <SidebarCardTitle>Liens</SidebarCardTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {project.live_url && (
                    <SidebarPrimary href={project.live_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={15} /> Voir le site
                    </SidebarPrimary>
                  )}
                  {project.github_url && (
                    <SidebarSecondary href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github size={15} /> Code source
                    </SidebarSecondary>
                  )}
                  {project.demo_url && (
                    <SidebarSecondary href={project.demo_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={15} /> Demo live
                    </SidebarSecondary>
                  )}
                </div>
              </SidebarCard>
            </motion.div>
          )}
        </Sidebar>
      </ContentLayout>
    </PageWrapper>
  );
}
