import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Search,
  BarChart2,
} from 'lucide-react';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import { staggerContainer, staggerItem } from '../../lib/animations';

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const PageTitle = styled.h1`
  font-size: 1.625rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
`;

const PageSubtitle = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
  }
`;

const ToolBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 360px;
`;

const SearchIconWrap = styled.div`
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
  font-family: inherit;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
`;

const FilterSelect = styled.select`
  padding: 0.6rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.full};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const ResultCount = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
  margin-left: auto;
`;

const PostsTable = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: grid;
    grid-template-columns: minmax(0, 2.5fr) 1fr 1fr 1fr 120px;
    gap: 1rem;
    padding: 0.75rem 1.25rem;
    background: ${({ theme }) => theme.colors.surface};
    border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  }
`;

const TableHeaderCell = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  transition: background ${({ theme }) => theme.transitions.fast};
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 2.5fr) 1fr 1fr 1fr 120px;
    gap: 1rem;
  }
`;

const PostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
`;

const PostCoverThumb = styled.div<{ $url?: string }>`
  width: 48px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ $url, theme }) =>
    $url
      ? `url(${$url}) center/cover`
      : `linear-gradient(135deg, ${theme.colors.accentDim}, ${theme.colors.tealDim})`};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const PostMeta = styled.div`
  min-width: 0;
`;

const PostTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PostSlug = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  width: fit-content;
`;

const StatusBadge = styled.span<{ $published: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.65rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  width: fit-content;
  background: ${({ $published, theme }) =>
    $published ? 'rgba(0,212,170,0.1)' : theme.colors.surface};
  color: ${({ $published, theme }) =>
    $published ? theme.colors.teal : theme.colors.textMuted};
  border: 1px solid
    ${({ $published }) => ($published ? 'rgba(0,212,170,0.2)' : 'rgba(255,255,255,0.08)')};

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }
`;

const ViewsCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const MobileMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const DesktopOnly = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ActionBtn = styled.button<{ $danger?: boolean; $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  color: ${({ $danger, $active, theme }) =>
    $danger ? theme.colors.danger : $active ? theme.colors.teal : theme.colors.textMuted};

  &:hover {
    background: ${({ $danger, $active }) =>
      $danger
        ? 'rgba(239,68,68,0.12)'
        : $active
          ? 'rgba(0,212,170,0.1)'
          : 'rgba(255,255,255,0.06)'};
    color: ${({ $danger, $active, theme }) =>
      $danger ? theme.colors.danger : $active ? theme.colors.teal : theme.colors.textPrimary};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 5rem 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

type FilterStatus = 'all' | 'published' | 'draft';

export default function BlogManager() {
  const { posts, loading, update, remove } = useBlogPosts(true);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const filtered = useMemo(
    () =>
      posts
        .filter((post) => {
          if (filterStatus === 'published') return post.published;
          if (filterStatus === 'draft') return !post.published;
          return true;
        })
        .filter((post) => {
          if (!search.trim()) return true;
          const query = search.toLowerCase();
          return (
            post.title.toLowerCase().includes(query) ||
            post.category.toLowerCase().includes(query) ||
            post.slug.toLowerCase().includes(query) ||
            post.tags.some((tag) => tag.toLowerCase().includes(query))
          );
        }),
    [filterStatus, posts, search]
  );

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Supprimer "${title}" ? Cette action est irréversible.`)) {
      return;
    }
    await remove(id);
  };

  const handleTogglePublished = async (id: string, current: boolean) => {
    await update(id, {
      published: !current,
      published_at: !current ? new Date().toISOString() : null,
    });
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={staggerItem}>
        <PageHeader>
          <div>
            <PageTitle>Blog</PageTitle>
            <PageSubtitle>Gérez vos articles et leur visibilité</PageSubtitle>
          </div>
          <AddButton
            onClick={() => navigate('/admin/blog/new')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={16} /> Nouvel article
          </AddButton>
        </PageHeader>
      </motion.div>

      <motion.div variants={staggerItem}>
        <ToolBar>
          <SearchWrapper>
            <SearchIconWrap>
              <Search size={15} />
            </SearchIconWrap>
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un article..."
            />
          </SearchWrapper>
          <FilterSelect
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value as FilterStatus)}
          >
            <option value="all">Tous</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
          </FilterSelect>
          <ResultCount>
            {filtered.length} article{filtered.length !== 1 ? 's' : ''}
          </ResultCount>
        </ToolBar>
      </motion.div>

      <motion.div variants={staggerItem}>
        <PostsTable>
          <TableHeader>
            <TableHeaderCell>Article</TableHeaderCell>
            <TableHeaderCell>Catégorie</TableHeaderCell>
            <TableHeaderCell>Statut</TableHeaderCell>
            <TableHeaderCell>Vues</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHeader>

          {loading ? (
            <EmptyState>Chargement...</EmptyState>
          ) : filtered.length === 0 ? (
            <EmptyState>
              <FileText size={36} strokeWidth={1} />
              <p>Aucun article trouvé.</p>
              <AddButton
                onClick={() => navigate('/admin/blog/new')}
                style={{ fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}
              >
                <Plus size={14} /> Créer un article
              </AddButton>
            </EmptyState>
          ) : (
            <AnimatePresence>
              {filtered.map((post, index) => (
                <TableRow
                  key={post.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <PostInfo>
                    <PostCoverThumb $url={post.cover_url || undefined}>
                      {!post.cover_url && '📝'}
                    </PostCoverThumb>
                    <PostMeta>
                      <PostTitle>{post.title}</PostTitle>
                      <PostSlug>/{post.slug}</PostSlug>
                    </PostMeta>
                  </PostInfo>

                  <DesktopOnly>
                    <CategoryBadge>{post.category}</CategoryBadge>
                  </DesktopOnly>

                  <DesktopOnly>
                    <StatusBadge $published={post.published}>
                      {post.published ? 'Publié' : 'Brouillon'}
                    </StatusBadge>
                  </DesktopOnly>

                  <DesktopOnly>
                    <ViewsCell>
                      <BarChart2 size={13} />
                      {post.views.toLocaleString('fr-FR')}
                    </ViewsCell>
                  </DesktopOnly>

                  <MobileMeta>
                    <CategoryBadge>{post.category}</CategoryBadge>
                    <StatusBadge $published={post.published}>
                      {post.published ? 'Publié' : 'Brouillon'}
                    </StatusBadge>
                    <ViewsCell>
                      <BarChart2 size={13} />
                      {post.views.toLocaleString('fr-FR')}
                    </ViewsCell>
                  </MobileMeta>

                  <RowActions>
                    <ActionBtn
                      type="button"
                      onClick={() => handleTogglePublished(post.id, post.published)}
                      $active={post.published}
                      title={post.published ? 'Dépublier' : 'Publier'}
                    >
                      {post.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </ActionBtn>
                    <ActionBtn
                      type="button"
                      onClick={() => navigate(`/admin/blog/${post.id}/edit`)}
                      title="Éditer"
                    >
                      <Pencil size={14} />
                    </ActionBtn>
                    <ActionBtn
                      type="button"
                      $danger
                      onClick={() => handleDelete(post.id, post.title)}
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </ActionBtn>
                  </RowActions>
                </TableRow>
              ))}
            </AnimatePresence>
          )}
        </PostsTable>
      </motion.div>
    </motion.div>
  );
}
