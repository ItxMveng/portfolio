import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Eye,
  Share2,
  Tag as TagIcon,
} from 'lucide-react';
import { SEOHead } from '../components/layout/SEOHead';
import { BlockRenderer } from '../components/blocks/BlockRenderer';
import { supabase } from '../lib/supabase';
import type { BlogPost, Block } from '../types';
import { Spinner, Tag } from '../components/ui';
import { fadeUp, staggerContainer, staggerItem } from '../lib/animations';

const viewedPostIds = new Set<string>();

const PageWrapper = styled.div`
  min-height: 100vh;
  padding-top: 80px;
`;

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.accent},
    ${({ theme }) => theme.colors.teal}
  );
  transform-origin: left;
  z-index: ${({ theme }) => theme.zIndex.sticky + 1};
`;

const ArticleHero = styled.div`
  position: relative;
  padding: 4rem 0 3rem;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 400px;
    background: radial-gradient(ellipse at center, rgba(124, 92, 252, 0.1) 0%, transparent 70%);
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

const HeroInner = styled(motion.div)`
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};
  width: fit-content;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const CategoryBadge = styled.span`
  display: inline-flex;
  padding: 0.2rem 0.65rem;
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid rgba(124, 92, 252, 0.2);
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const MetaSep = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ArticleTitle = styled.h1`
  font-size: clamp(1.875rem, 5vw, 3rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.03em;
  line-height: 1.15;
`;

const ArticleExcerpt = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.75;
  font-style: italic;
  border-left: 3px solid ${({ theme }) => theme.colors.accent};
  padding-left: 1.25rem;
`;

const ArticleTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const CoverImage = styled(motion.div)`
  width: 100%;
  max-height: 480px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  margin: 2rem 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  padding-bottom: 6rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 280px;
    align-items: start;
  }
`;

const ArticleContent = styled(motion.article)``;

const Sidebar = styled(motion.aside)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  order: -1;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 0;
    position: sticky;
    top: 100px;
  }
`;

const SidebarCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SidebarTitle = styled.h4`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const TocList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const TocItem = styled.a<{ $level: number; $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.5rem;
  padding-left: ${({ $level }) => ($level === 3 ? '1.5rem' : '0.5rem')};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ $level }) => ($level === 2 ? '0.8125rem' : '0.75rem')};
  font-weight: ${({ $level, $active }) => ($active ? 600 : $level === 2 ? 500 : 400)};
  color: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.textSecondary)};
  background: ${({ $active, theme }) => ($active ? theme.colors.accentDim : 'transparent')};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  text-decoration: none;
  line-height: 1.4;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surface};
  }

  svg {
    flex-shrink: 0;
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transition: opacity ${({ theme }) => theme.transitions.fast};
  }
`;

const ShareButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const StatChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.full};
  padding: 0.3rem 0.75rem;
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
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 600;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.accentHover};
  }
`;

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

function getHeadingDomId(block: Block) {
  return block.meta?._domId ?? `heading-${block.id}`;
}

function buildToc(blocks: Block[]): TocEntry[] {
  return blocks
    .filter((block) => block.type === 'heading' && block.content)
    .map((block) => ({
      id: getHeadingDomId(block),
      text: block.content ?? '',
      level: block.meta?.level ?? 2,
    }));
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    let isMounted = true;

    if (!slug) {
      setPost(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data, error }) => {
        if (!isMounted) {
          return;
        }

        if (error || !data) {
          setPost(null);
        } else {
          setPost(data);
        }

        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!post?.id || viewedPostIds.has(post.id)) {
      return;
    }

    viewedPostIds.add(post.id);

    supabase.rpc('increment_views', { post_id: post.id }).then(({ error }) => {
      if (error) {
        viewedPostIds.delete(post.id);
        return;
      }

      setPost((prev) =>
        prev && prev.id === post.id
          ? { ...prev, views: (prev.views ?? 0) + 1 }
          : prev
      );
    });
  }, [post?.id]);

  const blocksWithIds = useMemo(
    () =>
      (post?.blocks ?? []).map((block) =>
        block.type === 'heading'
          ? {
              ...block,
              meta: {
                ...block.meta,
                _domId: `heading-${block.id}`,
              },
            }
          : block
      ),
    [post?.blocks]
  );

  const toc = useMemo(() => buildToc(blocksWithIds), [blocksWithIds]);

  useEffect(() => {
    if (toc.length === 0) {
      setActiveHeading('');
      return;
    }

    setActiveHeading(toc[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    toc.forEach((entry) => {
      const element = document.getElementById(entry.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [toc]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Share failed', error);
    }
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    const offset = 100;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <PageWrapper>
        <LoadingCenter>
          <Spinner size={36} />
        </LoadingCenter>
      </PageWrapper>
    );
  }

  if (!post) {
    return (
      <PageWrapper>
        <NotFound>
          <BookOpen size={40} strokeWidth={1} />
          <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Article introuvable</p>
          <NotFoundLink to="/blog">
            <ArrowLeft size={16} /> Retour au blog
          </NotFoundLink>
        </NotFound>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <SEOHead
        title={post.title}
        description={post.excerpt}
        image={post.cover_url || undefined}
        type="article"
        publishedAt={post.published_at ?? undefined}
        tags={post.tags}
      />
      <ProgressBar style={{ scaleX }} />

      <ArticleHero>
        <Container>
          <HeroInner variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={staggerItem}>
              <BackLink to="/blog">
                <ArrowLeft size={15} /> Blog
              </BackLink>
            </motion.div>

            <motion.div variants={staggerItem}>
              <ArticleMeta>
                <CategoryBadge>{post.category}</CategoryBadge>
                <MetaSep>·</MetaSep>
                <MetaItem>
                  <Clock size={12} /> {post.read_time} min de lecture
                </MetaItem>
                <MetaSep>·</MetaSep>
                <MetaItem>
                  <Calendar size={12} />
                  {new Date(post.published_at ?? post.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </MetaItem>
                {post.views > 0 && (
                  <>
                    <MetaSep>·</MetaSep>
                    <MetaItem>
                      <Eye size={12} /> {post.views} vue{post.views !== 1 ? 's' : ''}
                    </MetaItem>
                  </>
                )}
              </ArticleMeta>
            </motion.div>

            <motion.div variants={staggerItem}>
              <ArticleTitle>{post.title}</ArticleTitle>
            </motion.div>

            {post.excerpt && (
              <motion.div variants={staggerItem}>
                <ArticleExcerpt>{post.excerpt}</ArticleExcerpt>
              </motion.div>
            )}

            {post.tags.length > 0 && (
              <motion.div variants={staggerItem}>
                <ArticleTags>
                  {post.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </ArticleTags>
              </motion.div>
            )}
          </HeroInner>
        </Container>
      </ArticleHero>

      {post.cover_url && (
        <Container>
          <CoverImage
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img src={post.cover_url} alt={post.title} />
          </CoverImage>
        </Container>
      )}

      <Container>
        <ContentLayout>
          <ArticleContent variants={fadeUp} initial="hidden" animate="visible">
            <BlockRenderer blocks={blocksWithIds} />
          </ArticleContent>

          <Sidebar variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={staggerItem}>
              <StatsRow>
                <StatChip>
                  <Clock size={12} /> {post.read_time} min
                </StatChip>
                {post.views > 0 && (
                  <StatChip>
                    <Eye size={12} /> {post.views} vues
                  </StatChip>
                )}
              </StatsRow>
            </motion.div>

            {toc.length > 0 && (
              <motion.div variants={staggerItem}>
                <SidebarCard>
                  <SidebarTitle>
                    <BookOpen size={12} /> Table des matières
                  </SidebarTitle>
                  <TocList>
                    {toc.map((entry) => (
                      <TocItem
                        key={entry.id}
                        $level={entry.level}
                        $active={activeHeading === entry.id}
                        href={`#${entry.id}`}
                        onClick={(event) => {
                          event.preventDefault();
                          scrollToHeading(entry.id);
                        }}
                      >
                        <ChevronRight size={11} />
                        {entry.text}
                      </TocItem>
                    ))}
                  </TocList>
                </SidebarCard>
              </motion.div>
            )}

            {post.tags.length > 0 && (
              <motion.div variants={staggerItem}>
                <SidebarCard>
                  <SidebarTitle>
                    <TagIcon size={12} /> Tags
                  </SidebarTitle>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {post.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </SidebarCard>
              </motion.div>
            )}

            <motion.div variants={staggerItem}>
              <ShareButton onClick={handleShare} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {copied ? (
                  <>
                    <Check size={15} /> Lien copié !
                  </>
                ) : (
                  <>
                    <Share2 size={15} /> Partager l&apos;article
                  </>
                )}
              </ShareButton>
            </motion.div>
          </Sidebar>
        </ContentLayout>
      </Container>
    </PageWrapper>
  );
}
