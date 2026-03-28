import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Github,
  Globe,
  Image as ImageIcon,
  Layers,
  Save,
  Star,
  StarOff,
  Tag as TagIcon,
  Trash2,
  Upload,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { BlockEditor } from '../../components/blocks/BlockEditor';
import { BlockRenderer } from '../../components/blocks/BlockRenderer';
import { useMedia } from '../../hooks/useMedia';
import { normalizeProjectUrls } from '../../lib/external-links';
import { supabase } from '../../lib/supabase';
import { staggerContainer, staggerItem } from '../../lib/animations';
import type { Project } from '../../types';

const PageWrapper = styled(motion.div)``;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.875rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)<{ $variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  ${({ $variant = 'secondary', theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.colors.accent};
          color: #fff;
          border-color: transparent;
          &:hover {
            background: ${theme.colors.accentHover};
            box-shadow: 0 0 20px ${theme.colors.accentGlow};
          }
        `;
      case 'success':
        return `
          background: rgba(0,212,170,0.1);
          color: ${theme.colors.teal};
          border-color: rgba(0,212,170,0.25);
          &:hover { background: rgba(0,212,170,0.18); }
        `;
      case 'danger':
        return `
          background: rgba(239,68,68,0.08);
          color: ${theme.colors.danger};
          border-color: rgba(239,68,68,0.2);
          &:hover { background: rgba(239,68,68,0.15); }
        `;
      default:
        return `
          background: ${theme.colors.surface};
          color: ${theme.colors.textSecondary};
          border-color: ${theme.colors.surfaceBorder};
          &:hover {
            color: ${theme.colors.textPrimary};
            border-color: ${theme.colors.accent};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EditorLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 300px;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: sticky;
    top: 80px;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: ${({ theme }) => theme.colors.surface};
`;

const AccentIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.accent};
`;

const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  flex: 1;
`;

const CardBody = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const FieldLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.65rem 0.875rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
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

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.65rem 0.875rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 90px;
  line-height: 1.6;
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

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.65rem 0.875rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const TagsInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  min-height: 44px;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: text;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
`;

const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(124, 92, 252, 0.2);
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.accent};

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    padding: 0;
    display: flex;
    align-items: center;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }
`;

const TagsInputField = styled.input`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.8125rem;
  font-family: inherit;
  min-width: 80px;
  flex: 1;
  padding: 0.1rem 0.25rem;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
  }
`;

const CoverUpload = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  border: 2px dashed ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;

  input {
    display: none;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }
`;

const CoverPreview = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};

  img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;
  }
`;

const CoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  ${CoverPreview}:hover & {
    opacity: 1;
  }
`;

const OverlayActionLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.8rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  cursor: pointer;

  input {
    display: none;
  }
`;

const OverlayActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.8rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(239, 68, 68, 0.08);
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid rgba(239, 68, 68, 0.2);
  cursor: pointer;
`;

const PreviewPane = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
  max-height: 600px;
  overflow-y: auto;
`;

const Toggle = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid;
  transition: all ${({ theme }) => theme.transitions.fast};
  width: 100%;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.accentDim : theme.colors.surface};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.accent : theme.colors.textSecondary};
  border-color: ${({ $active, theme }) =>
    $active ? 'rgba(124,92,252,0.3)' : theme.colors.surfaceBorder};
`;

const FeedbackBanner = styled(motion.div)<{ $success: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
  background: ${({ $success }) =>
    $success ? 'rgba(0,212,170,0.08)' : 'rgba(239,68,68,0.08)'};
  color: ${({ $success, theme }) => ($success ? theme.colors.teal : theme.colors.danger)};
  border: 1px solid
    ${({ $success }) => ($success ? 'rgba(0,212,170,0.2)' : 'rgba(239,68,68,0.2)')};
`;

const LoadingState = styled.div`
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

function TagsField({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (normalized && !value.includes(normalized)) {
      onChange([...value, normalized]);
    }
    setInput('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag(input);
    }

    if (event.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <TagsInput onClick={() => inputRef.current?.focus()}>
      {value.map((tag) => (
        <TagChip key={tag}>
          {tag}
          <button type="button" onClick={() => onChange(value.filter((item) => item !== tag))}>
            ×
          </button>
        </TagChip>
      ))}
      <TagsInputField
        ref={inputRef}
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (input.trim()) {
            addTag(input);
          }
        }}
        placeholder={value.length === 0 ? placeholder ?? 'Ajouter un tag...' : ''}
      />
    </TagsInput>
  );
}

function defaultProject(): Omit<Project, 'id' | 'created_at' | 'updated_at'> {
  return {
    title: '',
    slug: '',
    category: 'Web',
    short_description: '',
    cover_url: '',
    tags: [],
    tech_stack: [],
    blocks: [],
    demo_url: '',
    github_url: '',
    live_url: '',
    featured: false,
    published: false,
    display_order: 0,
  };
}

function toSlug(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function ProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { upload } = useMedia();
  const isNew = !id;

  const [form, setForm] = useState<Omit<Project, 'id' | 'created_at' | 'updated_at'>>(defaultProject());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    let active = true;

    if (isNew) {
      setLoading(false);
      return undefined;
    }

    supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (!active) {
          return;
        }

        if (!error && data) {
          const project = data as Project;
          setForm({
            title: project.title,
            slug: project.slug,
            category: project.category,
            short_description: project.short_description,
            cover_url: project.cover_url,
            tags: project.tags ?? [],
            tech_stack: project.tech_stack ?? [],
            blocks: project.blocks ?? [],
            demo_url: project.demo_url,
            github_url: project.github_url,
            live_url: project.live_url,
            featured: project.featured,
            published: project.published,
            display_order: project.display_order,
          });
          setSlugManuallyEdited(true);
        }

        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, isNew]);

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title' && !slugManuallyEdited) {
        next.slug = toSlug(value as string);
      }
      return next;
    });
    setSaved(false);
  };

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const url = await upload(file, 'covers');
    if (url) setField('cover_url', url);
    setUploadingCover(false);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      setFeedback({ type: 'error', msg: 'Le titre et le slug sont obligatoires.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const normalizedForm = normalizeProjectUrls(form);

    if (isNew) {
      const { data: orderData } = await supabase
        .from('projects')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)
        .maybeSingle();

      const payload = {
        ...normalizedForm,
        display_order: (orderData?.display_order ?? 0) + 1,
      };

      const { data, error } = await supabase.from('projects').insert(payload).select().single();

      if (error) {
        setFeedback({ type: 'error', msg: error.message });
      } else {
        const project = data as Project;
        setFeedback({ type: 'success', msg: 'Projet créé avec succès !' });
        setSaved(true);
        window.setTimeout(() => navigate(`/admin/projects/${project.id}/edit`), 1000);
      }
    } else {
      const { error } = await supabase
        .from('projects')
        .update({ ...normalizedForm, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        setFeedback({ type: 'error', msg: error.message });
      } else {
        setForm(normalizedForm);
        setFeedback({ type: 'success', msg: 'Projet mis à jour !' });
        setSaved(true);
        window.setTimeout(() => setSaved(false), 3000);
      }
    }

    setSaving(false);
  };

  const previewBlocks = useMemo(() => form.blocks, [form.blocks]);

  if (loading) {
    return <LoadingState>Chargement...</LoadingState>;
  }

  return (
    <PageWrapper variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={staggerItem}>
        <PageHeader>
          <BackButton onClick={() => navigate('/admin/projects')}>
            <ArrowLeft size={15} /> Projets
          </BackButton>
          <PageTitle>{isNew ? 'Nouveau projet' : form.title || 'Éditer le projet'}</PageTitle>
          <HeaderActions>
            <ActionButton
              $variant={form.published ? 'success' : 'secondary'}
              onClick={() => setField('published', !form.published)}
              whileTap={{ scale: 0.97 }}
            >
              {form.published ? (
                <>
                  <Eye size={14} /> Publié
                </>
              ) : (
                <>
                  <EyeOff size={14} /> Brouillon
                </>
              )}
            </ActionButton>
            <ActionButton
              $variant={form.featured ? 'success' : 'secondary'}
              onClick={() => setField('featured', !form.featured)}
              whileTap={{ scale: 0.97 }}
            >
              {form.featured ? (
                <>
                  <Star size={14} /> Featured
                </>
              ) : (
                <>
                  <StarOff size={14} /> Featured
                </>
              )}
            </ActionButton>
            <ActionButton
              $variant={saved ? 'success' : 'primary'}
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {saved ? (
                <>
                  <CheckCircle size={14} /> Sauvegardé
                </>
              ) : (
                <>
                  <Save size={14} /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </>
              )}
            </ActionButton>
          </HeaderActions>
        </PageHeader>
      </motion.div>

      <AnimatePresence>
        {feedback && (
          <FeedbackBanner
            $success={feedback.type === 'success'}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {feedback.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
            {feedback.msg}
          </FeedbackBanner>
        )}
      </AnimatePresence>

      <motion.div variants={staggerItem}>
        <EditorLayout>
          <MainColumn>
            <Card>
              <CardHeader>
                <AccentIcon>
                  <Layers size={14} />
                </AccentIcon>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardBody>
                <TwoCol>
                  <FieldGroup>
                    <FieldLabel>Titre *</FieldLabel>
                    <StyledInput
                      value={form.title}
                      onChange={(event) => setField('title', event.target.value)}
                      placeholder="Nom du projet"
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <FieldLabel>Catégorie</FieldLabel>
                    <StyledSelect
                      value={form.category}
                      onChange={(event) => setField('category', event.target.value)}
                    >
                      {['Web', 'AI', 'Mobile', 'Data', 'Automatisation', 'Other'].map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </StyledSelect>
                  </FieldGroup>
                </TwoCol>

                <FieldGroup>
                  <FieldLabel>Slug * (URL : /projects/{form.slug || '...'})</FieldLabel>
                  <StyledInput
                    value={form.slug}
                    onChange={(event) => {
                      setSlugManuallyEdited(true);
                      setField('slug', event.target.value);
                    }}
                    placeholder="mon-projet"
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Description courte (carte)</FieldLabel>
                  <StyledTextarea
                    value={form.short_description}
                    onChange={(event) => setField('short_description', event.target.value)}
                    placeholder="Une phrase qui résume le projet..."
                    style={{ minHeight: '72px' }}
                  />
                </FieldGroup>

                <TwoCol>
                  <FieldGroup>
                    <FieldLabel>
                      <TagIcon size={12} /> Tags
                    </FieldLabel>
                    <TagsField
                      value={form.tags}
                      onChange={(tags) => setField('tags', tags)}
                      placeholder="Ajouter un tag..."
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <FieldLabel>
                      <Layers size={12} /> Stack technique
                    </FieldLabel>
                    <TagsField
                      value={form.tech_stack}
                      onChange={(tags) => setField('tech_stack', tags)}
                      placeholder="React, Node.js..."
                    />
                  </FieldGroup>
                </TwoCol>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <AccentIcon>
                  <Globe size={14} />
                </AccentIcon>
                <CardTitle>Contenu détaillé</CardTitle>
                <ActionButton
                  $variant="secondary"
                  onClick={() => setShowPreview((prev) => !prev)}
                  whileTap={{ scale: 0.97 }}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  {showPreview ? (
                    <>
                      <EyeOff size={12} /> Éditeur
                    </>
                  ) : (
                    <>
                      <Eye size={12} /> Aperçu
                    </>
                  )}
                </ActionButton>
              </CardHeader>
              <CardBody>
                <AnimatePresence mode="wait">
                  {showPreview ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <PreviewPane>
                        {previewBlocks.length > 0 ? (
                          <BlockRenderer blocks={previewBlocks} />
                        ) : (
                          <p style={{ color: '#9494b0', fontSize: '0.875rem' }}>
                            Aucun bloc ajouté.
                          </p>
                        )}
                      </PreviewPane>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="editor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <BlockEditor blocks={form.blocks} onChange={(blocks) => setField('blocks', blocks)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardBody>
            </Card>
          </MainColumn>

          <SideColumn>
            <Card>
              <CardHeader>
                <AccentIcon>
                  <ImageIcon size={14} />
                </AccentIcon>
                <CardTitle>Image de couverture</CardTitle>
              </CardHeader>
              <CardBody>
                {form.cover_url ? (
                  <CoverPreview>
                    <img src={form.cover_url} alt="cover" />
                    <CoverOverlay>
                      <OverlayActionLabel>
                        <input type="file" accept="image/*" onChange={handleCoverUpload} />
                        <Upload size={13} /> Changer
                      </OverlayActionLabel>
                      <OverlayActionButton type="button" onClick={() => setField('cover_url', '')}>
                        <Trash2 size={13} /> Retirer
                      </OverlayActionButton>
                    </CoverOverlay>
                  </CoverPreview>
                ) : (
                  <CoverUpload>
                    <input type="file" accept="image/*" onChange={handleCoverUpload} />
                    <ImageIcon size={24} strokeWidth={1} />
                    <span>{uploadingCover ? 'Upload...' : 'Cliquer pour uploader'}</span>
                    <span style={{ fontSize: '0.75rem' }}>16:9 recommandé</span>
                  </CoverUpload>
                )}
                <FieldGroup>
                  <FieldLabel>Ou URL directe</FieldLabel>
                  <StyledInput
                    value={form.cover_url}
                    onChange={(event) => setField('cover_url', event.target.value)}
                    placeholder="https://..."
                  />
                </FieldGroup>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <AccentIcon>
                  <ExternalLink size={14} />
                </AccentIcon>
                <CardTitle>Liens</CardTitle>
              </CardHeader>
              <CardBody>
                <FieldGroup>
                  <FieldLabel>
                    <Globe size={12} /> Site en ligne
                  </FieldLabel>
                  <StyledInput
                    value={form.live_url}
                    onChange={(event) => setField('live_url', event.target.value)}
                    placeholder="https://..."
                  />
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel>
                    <Github size={12} /> GitHub
                  </FieldLabel>
                  <StyledInput
                    value={form.github_url}
                    onChange={(event) => setField('github_url', event.target.value)}
                    placeholder="https://github.com/..."
                  />
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel>
                    <ExternalLink size={12} /> Démo
                  </FieldLabel>
                  <StyledInput
                    value={form.demo_url}
                    onChange={(event) => setField('demo_url', event.target.value)}
                    placeholder="https://..."
                  />
                </FieldGroup>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <AccentIcon>
                  <Eye size={14} />
                </AccentIcon>
                <CardTitle>Visibilité</CardTitle>
              </CardHeader>
              <CardBody>
                <Toggle
                  $active={form.published}
                  onClick={() => setField('published', !form.published)}
                  type="button"
                >
                  {form.published ? (
                    <>
                      <Eye size={14} /> Publié — visible sur le site
                    </>
                  ) : (
                    <>
                      <EyeOff size={14} /> Brouillon — non visible
                    </>
                  )}
                </Toggle>
                <Toggle
                  $active={form.featured}
                  onClick={() => setField('featured', !form.featured)}
                  type="button"
                >
                  {form.featured ? (
                    <>
                      <Star size={14} /> En vedette
                    </>
                  ) : (
                    <>
                      <StarOff size={14} /> Non mis en avant
                    </>
                  )}
                </Toggle>
              </CardBody>
            </Card>
          </SideColumn>
        </EditorLayout>
      </motion.div>
    </PageWrapper>
  );
}
