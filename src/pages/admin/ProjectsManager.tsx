import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ExternalLink,
  Eye,
  EyeOff,
  FolderOpen,
  Github,
  Pencil,
  Plus,
  Search,
  Star,
  StarOff,
  Trash2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProjects } from '../../hooks/useProjects';
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

const ProjectsTable = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: grid;
    grid-template-columns: minmax(0, 2fr) 1fr 1fr 180px;
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
  gap: 0.75rem;
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
    grid-template-columns: minmax(0, 2fr) 1fr 1fr 180px;
    gap: 1rem;
  }
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

const ProjectInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
`;

const ProjectCoverThumb = styled.div<{ $url?: string }>`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $url, theme }) =>
    $url ? `url(${$url}) center/cover` : theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const ProjectMeta = styled.div`
  min-width: 0;
`;

const ProjectName = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProjectSlug = styled.div`
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
  flex-wrap: wrap;
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

const IconLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(255,255,255,0.06);
    color: ${({ theme }) => theme.colors.textPrimary};
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

const EmptyLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
  }
`;

const CATEGORY_ICONS: Record<string, string> = {
  Web: '🌐',
  AI: '🤖',
  Mobile: '📱',
  Data: '🗄️',
  Automatisation: '⚡',
};

type FilterStatus = 'all' | 'published' | 'draft';

export default function ProjectsManager() {
  const { projects, loading, update, remove } = useProjects(true);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const filtered = useMemo(
    () =>
      projects
        .filter((project) => {
          if (filterStatus === 'published') return project.published;
          if (filterStatus === 'draft') return !project.published;
          return true;
        })
        .filter((project) => {
          if (!search.trim()) return true;
          const query = search.toLowerCase();
          return (
            project.title.toLowerCase().includes(query) ||
            project.category.toLowerCase().includes(query) ||
            project.slug.toLowerCase().includes(query)
          );
        }),
    [filterStatus, projects, search]
  );

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Supprimer "${title}" ? Cette action est irréversible.`)) {
      return;
    }
    await remove(id);
  };

  const handleTogglePublished = async (id: string, current: boolean) => {
    await update(id, { published: !current });
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    await update(id, { featured: !current });
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={staggerItem}>
        <PageHeader>
          <div>
            <PageTitle>Projets</PageTitle>
            <PageSubtitle>Gérez vos réalisations et leur visibilité</PageSubtitle>
          </div>
          <AddButton
            onClick={() => navigate('/admin/projects/new')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={16} /> Nouveau projet
          </AddButton>
        </PageHeader>
      </motion.div>

      <motion.div variants={staggerItem}>
        <ToolBar>
          <SearchWrapper>
            <SearchIcon>
              <Search size={15} />
            </SearchIcon>
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un projet..."
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
            {filtered.length} projet{filtered.length !== 1 ? 's' : ''}
          </ResultCount>
        </ToolBar>
      </motion.div>

      <motion.div variants={staggerItem}>
        <ProjectsTable>
          <TableHeader>
            <TableHeaderCell>Projet</TableHeaderCell>
            <TableHeaderCell>Catégorie</TableHeaderCell>
            <TableHeaderCell>Statut</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHeader>

          {loading ? (
            <EmptyState>Chargement...</EmptyState>
          ) : filtered.length === 0 ? (
            <EmptyState>
              <FolderOpen size={36} strokeWidth={1} />
              <p>Aucun projet trouvé.</p>
              <EmptyLink to="/admin/projects/new">
                <Plus size={14} /> Créer un projet
              </EmptyLink>
            </EmptyState>
          ) : (
            <AnimatePresence>
              {filtered.map((project, index) => (
                <TableRow
                  key={project.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <ProjectInfo>
                    <ProjectCoverThumb $url={project.cover_url || undefined}>
                      {!project.cover_url && (CATEGORY_ICONS[project.category] ?? '🔧')}
                    </ProjectCoverThumb>
                    <ProjectMeta>
                      <ProjectName>{project.title}</ProjectName>
                      <ProjectSlug>/{project.slug}</ProjectSlug>
                    </ProjectMeta>
                  </ProjectInfo>

                  <DesktopOnly>
                    <CategoryBadge>{project.category}</CategoryBadge>
                  </DesktopOnly>

                  <DesktopOnly>
                    <StatusBadge $published={project.published}>
                      {project.published ? 'Publié' : 'Brouillon'}
                    </StatusBadge>
                  </DesktopOnly>

                  <MobileMeta>
                    <CategoryBadge>{project.category}</CategoryBadge>
                    <StatusBadge $published={project.published}>
                      {project.published ? 'Publié' : 'Brouillon'}
                    </StatusBadge>
                  </MobileMeta>

                  <RowActions>
                    <ActionBtn
                      type="button"
                      onClick={() => handleTogglePublished(project.id, project.published)}
                      $active={project.published}
                      title={project.published ? 'Dépublier' : 'Publier'}
                    >
                      {project.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </ActionBtn>
                    <ActionBtn
                      type="button"
                      onClick={() => handleToggleFeatured(project.id, project.featured)}
                      $active={project.featured}
                      title={project.featured ? 'Retirer featured' : 'Mettre en featured'}
                    >
                      {project.featured ? <Star size={14} /> : <StarOff size={14} />}
                    </ActionBtn>
                    {project.live_url && (
                      <IconLink
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Voir en ligne"
                      >
                        <ExternalLink size={14} />
                      </IconLink>
                    )}
                    {project.github_url && (
                      <IconLink
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Voir le code"
                      >
                        <Github size={14} />
                      </IconLink>
                    )}
                    <ActionBtn
                      type="button"
                      onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                      title="Éditer"
                    >
                      <Pencil size={14} />
                    </ActionBtn>
                    <ActionBtn
                      type="button"
                      $danger
                      onClick={() => handleDelete(project.id, project.title)}
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </ActionBtn>
                  </RowActions>
                </TableRow>
              ))}
            </AnimatePresence>
          )}
        </ProjectsTable>
      </motion.div>
    </motion.div>
  );
}
