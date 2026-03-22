import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Hash,
  Image as ImageIcon,
  Save,
  Tag as TagIcon,
  Trash2,
  Upload,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useMedia } from '../../hooks/useMedia';
import { BlockEditor } from '../../components/blocks/BlockEditor';
import { BlockRenderer } from '../../components/blocks/BlockRenderer';
import { staggerContainer, staggerItem } from '../../lib/animations';
import type { BlogPost } from '../../types';

const Page = styled(motion.div)``;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;
const Back = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.875rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;
const Title = styled.h1`
  flex: 1;
  min-width: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;
const Btn = styled(motion.button)<{ $variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  ${({ $variant = 'secondary', theme }) =>
    $variant === 'primary'
      ? `background:${theme.colors.accent};color:#fff;border-color:transparent;`
      : $variant === 'success'
        ? `background:rgba(0,212,170,0.1);color:${theme.colors.teal};border-color:rgba(0,212,170,0.25);`
        : $variant === 'danger'
          ? `background:rgba(239,68,68,0.08);color:${theme.colors.danger};border-color:rgba(239,68,68,0.2);`
          : `background:${theme.colors.surface};color:${theme.colors.textSecondary};border-color:${theme.colors.surfaceBorder};`}
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 300px;
    align-items: start;
  }
`;
const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
const Side = styled.div`
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
const CardHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.accent};
`;
const CardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  font-weight: 700;
  flex: 1;
`;
const Body = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;
const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;
const Input = styled.input`
  width: 100%;
  padding: 0.65rem 0.875rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;
const Textarea = styled.textarea`
  width: 100%;
  padding: 0.65rem 0.875rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  min-height: 90px;
  resize: vertical;
  line-height: 1.6;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;
const Select = styled.select`
  width: 100%;
  padding: 0.65rem 0.875rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;
const TagInputWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  min-height: 44px;
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
  background: ${({ theme }) => theme.colors.tealDim};
  border: 1px solid rgba(0,212,170,0.2);
  border-radius: ${({ theme }) => theme.radii.full};
  color: ${({ theme }) => theme.colors.teal};
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
  }
`;
const TagInput = styled.input`
  flex: 1;
  min-width: 80px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.8125rem;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;
const UploadArea = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  border: 2px dashed ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
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
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.md};
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.fast};
  ${CoverPreview}:hover & {
    opacity: 1;
  }
`;
const CoverLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.8rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  input {
    display: none;
  }
`;
const CoverDanger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.8rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
`;
const PreviewPane = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 2rem;
  max-height: 700px;
  overflow-y: auto;
`;
const PreviewHead = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;
const PreviewCategory = styled.span`
  display: inline-flex;
  padding: 0.2rem 0.65rem;
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid rgba(124,92,252,0.2);
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
`;
const PreviewTitle = styled.h1`
  font-size: 1.625rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 0.75rem;
`;
const PreviewExcerpt = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  font-style: italic;
  border-left: 3px solid ${({ theme }) => theme.colors.accent};
  padding-left: 1rem;
`;
const Toggle = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid
    ${({ $active, theme }) => ($active ? 'rgba(124,92,252,0.3)' : theme.colors.surfaceBorder)};
  background: ${({ $active, theme }) => ($active ? theme.colors.accentDim : theme.colors.surface)};
  color: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.textSecondary)};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
`;
const Banner = styled(motion.div)<{ $success: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${({ $success }) =>
    $success ? 'rgba(0,212,170,0.08)' : 'rgba(239,68,68,0.08)'};
  color: ${({ $success, theme }) => ($success ? theme.colors.teal : theme.colors.danger)};
  border: 1px solid
    ${({ $success }) => ($success ? 'rgba(0,212,170,0.2)' : 'rgba(239,68,68,0.2)')};
`;
const Loading = styled.div`
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const ArticleLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  font-weight: 600;
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

type ArticleForm = Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'views'>;

function defaultArticle(): ArticleForm {
  return {
    title: '',
    slug: '',
    excerpt: '',
    cover_url: '',
    category: 'tutorial',
    tags: [],
    blocks: [],
    read_time: 5,
    published: false,
    published_at: null,
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

function toLocalDateTime(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

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
  const ref = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setInput('');
  };

  return (
    <TagInputWrap onClick={() => ref.current?.focus()}>
      {value.map((tag) => (
        <TagChip key={tag}>
          #{tag}
          <button type="button" onClick={() => onChange(value.filter((item) => item !== tag))}>
            ×
          </button>
        </TagChip>
      ))}
      <TagInput
        ref={ref}
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addTag(input);
          }
          if (event.key === 'Backspace' && !input && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => {
          if (input.trim()) addTag(input);
        }}
        placeholder={value.length === 0 ? placeholder ?? 'Ajouter un tag...' : ''}
      />
    </TagInputWrap>
  );
}

export default function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { upload } = useMedia();
  const isNew = !id;

  const [form, setForm] = useState<ArticleForm>(defaultArticle());
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
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data) {
          const article = data as BlogPost;
          setForm({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            cover_url: article.cover_url,
            category: article.category,
            tags: article.tags ?? [],
            blocks: article.blocks ?? [],
            read_time: article.read_time ?? 5,
            published: article.published,
            published_at: article.published_at,
          });
          setSlugManuallyEdited(true);
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, isNew]);

  const setField = <K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title' && !slugManuallyEdited) {
        next.slug = toSlug(value as string);
      }
      return next;
    });
    setSaved(false);
  };

  const togglePublished = () => {
    setForm((prev) => ({
      ...prev,
      published: !prev.published,
      published_at: !prev.published ? prev.published_at ?? new Date().toISOString() : null,
    }));
    setSaved(false);
  };

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const url = await upload(file, 'blog-covers');
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

    const payload = {
      ...form,
      read_time: Math.max(1, Number(form.read_time) || 1),
      published_at: form.published ? form.published_at ?? new Date().toISOString() : null,
    };

    if (isNew) {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({ ...payload, views: 0 })
        .select()
        .single();

      if (error) {
        setFeedback({ type: 'error', msg: error.message });
      } else {
        const article = data as BlogPost;
        setFeedback({ type: 'success', msg: 'Article créé avec succès !' });
        setSaved(true);
        window.setTimeout(() => navigate(`/admin/blog/${article.id}/edit`), 1000);
      }
    } else {
      const { error } = await supabase
        .from('blog_posts')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        setFeedback({ type: 'error', msg: error.message });
      } else {
        setFeedback({ type: 'success', msg: 'Article mis à jour !' });
        setSaved(true);
        window.setTimeout(() => setSaved(false), 3000);
      }
    }

    setSaving(false);
  };

  const previewBlocks = useMemo(() => form.blocks, [form.blocks]);

  if (loading) {
    return <Loading>Chargement...</Loading>;
  }

  return (
    <Page variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={staggerItem}>
        <Header>
          <Back onClick={() => navigate('/admin/blog')}>
            <ArrowLeft size={15} /> Blog
          </Back>
          <Title>{isNew ? 'Nouvel article' : form.title || "Éditer l'article"}</Title>
          <Actions>
            <Btn
              $variant={form.published ? 'success' : 'secondary'}
              onClick={togglePublished}
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
            </Btn>
            <Btn
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
            </Btn>
          </Actions>
        </Header>
      </motion.div>

      <AnimatePresence>
        {feedback && (
          <Banner
            $success={feedback.type === 'success'}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {feedback.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
            {feedback.msg}
          </Banner>
        )}
      </AnimatePresence>

      <motion.div variants={staggerItem}>
        <Layout>
          <Main>
            <Card>
              <CardHead>
                <FileText size={14} />
                <CardTitle>Informations de l&apos;article</CardTitle>
              </CardHead>
              <Body>
                <Group>
                  <Label>Titre *</Label>
                  <Input
                    value={form.title}
                    onChange={(event) => setField('title', event.target.value)}
                    placeholder="Titre de l'article"
                  />
                </Group>

                <Group>
                  <Label>
                    <Hash size={12} /> Slug * (URL : /blog/{form.slug || '...'})
                  </Label>
                  <Input
                    value={form.slug}
                    onChange={(event) => {
                      setSlugManuallyEdited(true);
                      setField('slug', event.target.value);
                    }}
                    placeholder="titre-de-l-article"
                  />
                </Group>

                <Group>
                  <Label>Extrait / Description</Label>
                  <Textarea
                    value={form.excerpt}
                    onChange={(event) => setField('excerpt', event.target.value)}
                    placeholder="Un court résumé accrocheur affiché dans les cartes et les aperçus..."
                  />
                </Group>

                <TwoCol>
                  <Group>
                    <Label>Catégorie</Label>
                    <Select
                      value={form.category}
                      onChange={(event) => setField('category', event.target.value)}
                    >
                      <option value="tutorial">Tutoriel</option>
                      <option value="article">Article</option>
                      <option value="formation">Formation</option>
                      <option value="demo">Démo</option>
                      <option value="retour">Retour d&apos;experience</option>
                      <option value="analyse">Analyse</option>
                    </Select>
                  </Group>
                  <Group>
                    <Label>
                      <Clock size={12} /> Temps de lecture (min)
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={60}
                      value={form.read_time}
                      onChange={(event) =>
                        setField('read_time', Math.max(1, Number(event.target.value) || 1))
                      }
                    />
                  </Group>
                </TwoCol>

                <Group>
                  <Label>
                    <TagIcon size={12} /> Tags
                  </Label>
                  <TagsField
                    value={form.tags}
                    onChange={(tags) => setField('tags', tags)}
                    placeholder="ia, react, automatisation..."
                  />
                </Group>
              </Body>
            </Card>

            <Card>
              <CardHead>
                <Globe size={14} />
                <CardTitle>Contenu de l&apos;article</CardTitle>
                <Btn
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
                </Btn>
              </CardHead>
              <Body>
                <AnimatePresence mode="wait">
                  {showPreview ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <PreviewPane>
                        <PreviewHead>
                          <PreviewCategory>{form.category}</PreviewCategory>
                          <PreviewTitle>{form.title || 'Titre de l\u0027article'}</PreviewTitle>
                          {form.excerpt && <PreviewExcerpt>{form.excerpt}</PreviewExcerpt>}
                        </PreviewHead>
                        {previewBlocks.length > 0 ? (
                          <BlockRenderer blocks={previewBlocks} />
                        ) : (
                          <p style={{ color: '#9494b0', fontSize: '0.875rem' }}>Aucun bloc ajouté.</p>
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
              </Body>
            </Card>
          </Main>

          <Side>
            <Card>
              <CardHead>
                <ImageIcon size={14} />
                <CardTitle>Image de couverture</CardTitle>
              </CardHead>
              <Body>
                {form.cover_url ? (
                  <CoverPreview>
                    <img src={form.cover_url} alt="cover" />
                    <CoverOverlay>
                      <CoverLabel>
                        <input type="file" accept="image/*" onChange={handleCoverUpload} />
                        <Upload size={13} /> Changer
                      </CoverLabel>
                      <CoverDanger type="button" onClick={() => setField('cover_url', '')}>
                        <Trash2 size={13} /> Retirer
                      </CoverDanger>
                    </CoverOverlay>
                  </CoverPreview>
                ) : (
                  <UploadArea>
                    <input type="file" accept="image/*" onChange={handleCoverUpload} />
                    <ImageIcon size={24} strokeWidth={1} />
                    <span>{uploadingCover ? 'Upload en cours...' : 'Cliquer pour uploader'}</span>
                    <span style={{ fontSize: '0.75rem' }}>16:9 recommandé</span>
                  </UploadArea>
                )}
                <Group>
                  <Label>Ou URL directe</Label>
                  <Input
                    value={form.cover_url}
                    onChange={(event) => setField('cover_url', event.target.value)}
                    placeholder="https://..."
                  />
                </Group>
              </Body>
            </Card>

            <Card>
              <CardHead>
                <Globe size={14} />
                <CardTitle>Publication</CardTitle>
              </CardHead>
              <Body>
                <Toggle $active={form.published} type="button" onClick={togglePublished}>
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

                {form.published && (
                  <Group>
                    <Label>Date de publication</Label>
                    <Input
                      type="datetime-local"
                      value={toLocalDateTime(form.published_at) || toLocalDateTime(new Date().toISOString())}
                      onChange={(event) =>
                        setField(
                          'published_at',
                          event.target.value ? new Date(event.target.value).toISOString() : null
                        )
                      }
                    />
                  </Group>
                )}

                {form.published_at && (
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: '#5a5a7a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Clock size={11} />
                    Publié le{' '}
                    {new Date(form.published_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </Body>
            </Card>

            {!isNew && form.published && form.slug && (
              <ArticleLink href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} /> Voir l&apos;article
              </ArticleLink>
            )}
          </Side>
        </Layout>
      </motion.div>
    </Page>
  );
}
