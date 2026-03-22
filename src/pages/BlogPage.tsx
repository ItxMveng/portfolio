import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Clock, Search } from 'lucide-react';
import { SEOHead } from '../components/layout/SEOHead';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { SectionLabel, SectionTitle, Tag } from '../components/ui';
import { staggerContainer, staggerItem } from '../lib/animations';

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
    background: radial-gradient(ellipse at center, rgba(124, 92, 252, 0.12) 0%, transparent 70%);
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

const FiltersArea = styled.div`
  padding: 1.5rem 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
`;

const FilterPill = styled(motion.button)<{ $active: boolean }>`
  padding: 0.4rem 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.8125rem;
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
        box-shadow: 0 0 14px ${theme.colors.accentGlow};
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

const TagPill = styled(motion.button)<{ $active: boolean }>`
  padding: 0.25rem 0.7rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.75rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fonts.mono};
  border: 1px solid;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $active, theme }) =>
    $active
      ? `
        background: ${theme.colors.tealDim};
        color: ${theme.colors.teal};
        border-color: rgba(0,212,170,0.3);
      `
      : `
        background: transparent;
        color: ${theme.colors.textMuted};
        border-color: ${theme.colors.surfaceBorder};
        &:hover {
          border-color: ${theme.colors.teal};
          color: ${theme.colors.teal};
          background: ${theme.colors.tealDim};
        }
      `}
`;

const SearchBar = styled.div`
  position: relative;
  max-width: 400px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
  display: flex;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.875rem 0.6rem 2.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.full};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.surfaceHover};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
`;

const ResultMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  margin-bottom: 2rem;
`;

const ResultCount = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const ClearFilters = styled.button`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.accent};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.accentHover};
  }
`;

const FeaturedCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 2rem;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    border-color: rgba(124, 92, 252, 0.35);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1.4fr 1fr;
  }
`;

const FeaturedCover = styled.div`
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accentDim},
    ${({ theme }) => theme.colors.tealDim}
  );
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.slow};
  }

  ${FeaturedCard}:hover & img {
    transform: scale(1.04);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    aspect-ratio: unset;
  }
`;

const FeaturedCoverPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  opacity: 0.35;
`;

const FeaturedBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const FeaturedBody = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
`;

const FeaturedMeta = styled.div`
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

const ReadTime = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FeaturedTitle = styled.h2`
  font-size: clamp(1.25rem, 2.5vw, 1.625rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  line-height: 1.25;
`;

const FeaturedExcerpt = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FeaturedTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const FeaturedReadLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  transition: gap ${({ theme }) => theme.transitions.fast};
  margin-top: 0.5rem;

  &:hover {
    gap: 0.65rem;
  }
`;

const BlogGrid = styled(motion.div)`
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

const BlogCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    border-color: rgba(124, 92, 252, 0.3);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-4px);
  }
`;

const BlogCover = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accentDim},
    ${({ theme }) => theme.colors.tealDim}
  );
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.slow};
  }

  ${BlogCard}:hover & img {
    transform: scale(1.05);
  }
`;

const CoverPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  opacity: 0.35;
`;

const BlogBody = styled.div`
  padding: 1.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const BlogTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BlogExcerpt = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.65;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BlogTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

const BlogFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.875rem;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  margin-top: auto;
`;

const DateText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const ReadLink = styled(Link)`
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

const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 5rem 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SkeletonCard = styled.div`
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

export default function BlogPage() {
  const { posts, loading } = useBlogPosts();
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const categories = useMemo(
    () => ['Tous', ...Array.from(new Set(posts.map((post) => post.category)))],
    [posts]
  );

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).slice(0, 12),
    [posts]
  );

  const filtered = useMemo(() => {
    let result = posts;

    if (activeCategory !== 'Tous') {
      result = result.filter((post) => post.category === activeCategory);
    }

    if (activeTag) {
      result = result.filter((post) => post.tags.includes(activeTag));
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return result;
  }, [posts, activeCategory, activeTag, search]);

  const hasActiveFilters = activeCategory !== 'Tous' || activeTag !== null || search.trim() !== '';
  const [featured, ...rest] = filtered;

  const clearFilters = () => {
    setActiveCategory('Tous');
    setActiveTag(null);
    setSearch('');
  };

  return (
    <PageWrapper>
      <SEOHead
        title="Blog"
        description="Tutoriels, analyses et retours d'experience autour de l'IA, du web et de l'automatisation."
      />
      <PageHeader>
        <Container>
          <HeaderContent variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={staggerItem}>
              <SectionLabel>Blog</SectionLabel>
            </motion.div>
            <motion.div variants={staggerItem}>
              <SectionTitle>
                Tutos, analyses et retours <span>d&apos;expérience</span>
              </SectionTitle>
            </motion.div>
            <motion.div variants={staggerItem}>
              <PageSubtitle>
                Méthodes concrètes, architectures testées, retours de projets réels autour de
                l&apos;IA, du web et de l&apos;automatisation.
              </PageSubtitle>
            </motion.div>
          </HeaderContent>
        </Container>
      </PageHeader>

      <Container>
        <FiltersArea>
          <SearchBar>
            <SearchIcon>
              <Search size={15} />
            </SearchIcon>
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un article..."
            />
          </SearchBar>

          <FiltersRow>
            {categories.map((category) => (
              <FilterPill
                key={category}
                $active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {category}
              </FilterPill>
            ))}
          </FiltersRow>

          {allTags.length > 0 && (
            <FiltersRow>
              {allTags.map((tag) => (
                <TagPill
                  key={tag}
                  $active={activeTag === tag}
                  onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  #{tag}
                </TagPill>
              ))}
            </FiltersRow>
          )}
        </FiltersArea>

        {!loading && (
          <ResultMeta>
            <ResultCount>
              {filtered.length} article{filtered.length !== 1 ? 's' : ''}
            </ResultCount>
            {hasActiveFilters && (
              <ClearFilters type="button" onClick={clearFilters}>
                Effacer les filtres
              </ClearFilters>
            )}
          </ResultMeta>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <BlogGrid key="skeleton">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <SkeletonCard key={index}>
                  <SkeletonShimmer style={{ height: '180px' }} />
                  <div
                    style={{
                      padding: '1.375rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <SkeletonShimmer style={{ height: '18px', width: '40%' }} />
                    <SkeletonShimmer style={{ height: '20px', width: '80%' }} />
                    <SkeletonShimmer style={{ height: '14px' }} />
                    <SkeletonShimmer style={{ height: '14px', width: '70%' }} />
                  </div>
                </SkeletonCard>
              ))}
            </BlogGrid>
          ) : filtered.length === 0 ? (
            <EmptyState key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <BookOpen size={40} strokeWidth={1} />
              <p style={{ fontSize: '1rem' }}>Aucun article trouvé.</p>
              {hasActiveFilters && (
                <ClearFilters type="button" onClick={clearFilters}>
                  Effacer les filtres
                </ClearFilters>
              )}
            </EmptyState>
          ) : (
            <motion.div
              key={`${activeCategory}-${activeTag ?? 'all'}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {featured && (
                <FeaturedCard
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link to={`/blog/${featured.slug}`} style={{ display: 'contents' }}>
                    <FeaturedCover>
                      {featured.cover_url ? (
                        <img src={featured.cover_url} alt={featured.title} loading="lazy" />
                      ) : (
                        <FeaturedCoverPlaceholder>📝</FeaturedCoverPlaceholder>
                      )}
                      <FeaturedBadge>À la une</FeaturedBadge>
                    </FeaturedCover>
                  </Link>

                  <FeaturedBody>
                    <FeaturedMeta>
                      <CategoryBadge>{featured.category}</CategoryBadge>
                      <ReadTime>
                        <Clock size={12} /> {featured.read_time} min
                      </ReadTime>
                      <DateText>
                        {new Date(featured.published_at ?? featured.created_at).toLocaleDateString(
                          'fr-FR',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }
                        )}
                      </DateText>
                    </FeaturedMeta>

                    <Link to={`/blog/${featured.slug}`} style={{ textDecoration: 'none' }}>
                      <FeaturedTitle>{featured.title}</FeaturedTitle>
                    </Link>

                    <FeaturedExcerpt>{featured.excerpt}</FeaturedExcerpt>

                    {featured.tags.length > 0 && (
                      <FeaturedTags>
                        {featured.tags.slice(0, 4).map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </FeaturedTags>
                    )}

                    <FeaturedReadLink to={`/blog/${featured.slug}`}>
                      Lire l&apos;article <ArrowUpRight size={16} />
                    </FeaturedReadLink>
                  </FeaturedBody>
                </FeaturedCard>
              )}

              {rest.length > 0 && (
                <BlogGrid variants={staggerContainer} initial="hidden" animate="visible">
                  {rest.map((post) => (
                    <BlogCard key={post.id} variants={staggerItem}>
                      <Link to={`/blog/${post.slug}`} style={{ display: 'contents' }}>
                        <BlogCover>
                          {post.cover_url ? (
                            <img src={post.cover_url} alt={post.title} loading="lazy" />
                          ) : (
                            <CoverPlaceholder>📝</CoverPlaceholder>
                          )}
                        </BlogCover>
                      </Link>

                      <BlogBody>
                        <BlogMeta>
                          <CategoryBadge>{post.category}</CategoryBadge>
                          <ReadTime>
                            <Clock size={11} /> {post.read_time} min
                          </ReadTime>
                        </BlogMeta>

                        <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                          <BlogTitle>{post.title}</BlogTitle>
                        </Link>

                        <BlogExcerpt>{post.excerpt}</BlogExcerpt>

                        {post.tags.length > 0 && (
                          <BlogTags>
                            {post.tags.slice(0, 3).map((tag) => (
                              <Tag key={tag}>{tag}</Tag>
                            ))}
                          </BlogTags>
                        )}

                        <BlogFooter>
                          <DateText>
                            {new Date(post.published_at ?? post.created_at).toLocaleDateString(
                              'fr-FR',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </DateText>
                          <ReadLink to={`/blog/${post.slug}`}>
                            Lire <ArrowUpRight size={13} />
                          </ReadLink>
                        </BlogFooter>
                      </BlogBody>
                    </BlogCard>
                  ))}
                </BlogGrid>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </PageWrapper>
  );
}
