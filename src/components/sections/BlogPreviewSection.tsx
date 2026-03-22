import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SectionLabel, SectionTitle, Tag } from '../../components/ui';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import { defaultViewport, fadeUp, staggerContainer, staggerItem } from '../../lib/animations';

const Section = styled.section`
  padding: 6rem 0;
  position: relative;
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

const BlogGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
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
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accentDim},
    ${({ theme }) => theme.colors.tealDim}
  );
  overflow: hidden;
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
  opacity: 0.4;
`;

const BlogBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  flex: 1;
`;

const BlogMeta = styled.div`
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
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
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
  padding-top: 1rem;
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

export function BlogPreviewSection() {
  const { posts, loading } = useBlogPosts();
  const latest = posts.slice(0, 3);

  if (loading || latest.length === 0) return null;

  return (
    <Section id="blog-preview">
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
              <SectionLabel>Blog</SectionLabel>
              <SectionTitle>
                Tutos, analyses et retours <span>d&apos;experience</span>
              </SectionTitle>
            </motion.div>
          </HeaderLeft>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={defaultViewport}>
            <ViewAllLink to="/blog">
              Tous les articles <ArrowRight size={16} />
            </ViewAllLink>
          </motion.div>
        </SectionHeader>

        <BlogGrid
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {latest.map((post) => (
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
                      <Tag key={`${post.id}-${tag}`}>{tag}</Tag>
                    ))}
                  </BlogTags>
                )}

                <BlogFooter>
                  <DateText>
                    {new Date(post.published_at ?? post.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </DateText>
                  <ReadLink to={`/blog/${post.slug}`}>
                    Lire <ArrowUpRight size={13} />
                  </ReadLink>
                </BlogFooter>
              </BlogBody>
            </BlogCard>
          ))}
        </BlogGrid>
      </Container>
    </Section>
  );
}
