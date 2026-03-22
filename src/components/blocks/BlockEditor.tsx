import { useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  AlignLeft,
  ChevronDown,
  ChevronUp,
  Code2,
  Eye,
  EyeOff,
  FileDown,
  GripVertical,
  Image as ImageIcon,
  ListOrdered,
  Minus,
  Plus,
  Trash2,
  Type,
  Video,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import { useMedia } from '../../hooks/useMedia';
import type { Block, BlockType } from '../../types';
import { BlockRenderer } from './BlockRenderer';

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ToolbarTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PreviewButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.875rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }
`;

const BlockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const BlockItem = styled(motion.div)<{ $focused: boolean }>`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ $focused, theme }) =>
    $focused ? theme.colors.accent : theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ $focused, theme }) =>
      $focused ? theme.colors.accent : theme.colors.surfaceBorderHover};
  }
`;

const BlockItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  user-select: none;
`;

const DragHandle = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const BlockTypeLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  flex: 1;
`;

const BlockActions = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-left: auto;
`;

const ActionBtn = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  color: ${({ $danger, theme }) => ($danger ? theme.colors.danger : theme.colors.textMuted)};

  &:hover:not(:disabled) {
    background: ${({ $danger, theme }) =>
      $danger ? 'rgba(239,68,68,0.12)' : theme.colors.surface};
    color: ${({ $danger, theme }) =>
      $danger ? theme.colors.danger : theme.colors.textPrimary};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const BlockItemBody = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const FieldLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FieldInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.875rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
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
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
`;

const FieldTextarea = styled.textarea`
  width: 100%;
  padding: 0.6rem 0.875rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  line-height: 1.6;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
`;

const MonoTextarea = styled(FieldTextarea)`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.8125rem;
  min-height: 120px;
`;

const FieldSelect = styled.select`
  padding: 0.6rem 0.875rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  cursor: pointer;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const UploadArea = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  border: 2px dashed ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};

  input {
    display: none;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

const StepsEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StepEditorItem = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;

const StepEditorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

const StepNum = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(124, 92, 252, 0.2);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const StepEditorBody = styled.div`
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AddStepButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }
`;

const AddBlockBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const AddBlockLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  width: 100%;
  margin-bottom: 0.25rem;
`;

const BlockTypeButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.875rem;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.8125rem;
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

const PreviewPanel = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.5rem;
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const PreviewTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const BLOCK_TYPES: { type: BlockType; label: string; icon: ReactNode }[] = [
  { type: 'heading', label: 'Titre', icon: <Type size={13} /> },
  { type: 'paragraph', label: 'Paragraphe', icon: <AlignLeft size={13} /> },
  { type: 'image', label: 'Image', icon: <ImageIcon size={13} /> },
  { type: 'video', label: 'Vidéo', icon: <Video size={13} /> },
  { type: 'code', label: 'Code', icon: <Code2 size={13} /> },
  { type: 'callout', label: 'Callout', icon: <AlertCircle size={13} /> },
  { type: 'divider', label: 'Séparateur', icon: <Minus size={13} /> },
  { type: 'file', label: 'Fichier', icon: <FileDown size={13} /> },
  { type: 'step_group', label: 'Étapes', icon: <ListOrdered size={13} /> },
];

function getBlockLabel(type: BlockType): string {
  return BLOCK_TYPES.find((blockType) => blockType.type === type)?.label ?? type;
}

function createBlock(type: BlockType): Block {
  const base: Block = { id: uuidv4(), type };

  switch (type) {
    case 'heading':
      return { ...base, content: '', meta: { level: 2 } };
    case 'paragraph':
      return { ...base, content: '' };
    case 'image':
      return { ...base, content: '', meta: { url: '', alt: '', caption: '' } };
    case 'video':
      return { ...base, content: '', meta: { url: '', caption: '' } };
    case 'code':
      return { ...base, content: '', meta: { language: 'typescript' } };
    case 'callout':
      return { ...base, content: '', meta: { variant: 'info' } };
    case 'divider':
      return { ...base };
    case 'file':
      return { ...base, meta: { url: '', filename: '', filesize: '' } };
    case 'step_group':
      return {
        ...base,
        meta: { steps: [{ title: '', content: '', code: '' }] },
      };
    default:
      return base;
  }
}

interface BlockEditorItemProps {
  block: Block;
  index: number;
  total: number;
  focused: boolean;
  onFocus: () => void;
  onChange: (updated: Block) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function BlockEditorItem({
  block,
  index,
  total,
  focused,
  onFocus,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: BlockEditorItemProps) {
  const { upload } = useMedia();

  const setContent = (content: string) => onChange({ ...block, content });
  const setMeta = (meta: Partial<NonNullable<Block['meta']>>) =>
    onChange({ ...block, meta: { ...block.meta, ...meta } });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file, 'blocks');
    if (url) setMeta({ url });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file, 'files');
    if (url) {
      setMeta({
        url,
        filename: file.name,
        filesize: `${(file.size / 1024).toFixed(0)} KB`,
      });
    }
  };

  const renderBody = () => {
    switch (block.type) {
      case 'heading':
        return (
          <>
            <FieldGroup>
              <FieldLabel>Niveau</FieldLabel>
              <FieldSelect
                value={block.meta?.level ?? 2}
                onChange={(e) => setMeta({ level: Number(e.target.value) as 1 | 2 | 3 })}
              >
                <option value={1}>H1 - Titre principal</option>
                <option value={2}>H2 - Sous-titre</option>
                <option value={3}>H3 - Titre de section</option>
              </FieldSelect>
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Texte</FieldLabel>
              <FieldInput
                value={block.content ?? ''}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Saisir le titre..."
                autoFocus={focused}
              />
            </FieldGroup>
          </>
        );
      case 'paragraph':
        return (
          <FieldGroup>
            <FieldLabel>Contenu (HTML simple autorise)</FieldLabel>
            <FieldTextarea
              value={block.content ?? ''}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Saisir le paragraphe..."
              autoFocus={focused}
            />
          </FieldGroup>
        );
      case 'image':
        return (
          <>
            <FieldGroup>
              <FieldLabel>Image (upload ou URL)</FieldLabel>
              <UploadArea>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                <ImageIcon size={14} /> Choisir une image
              </UploadArea>
              {block.meta?.url && <ImagePreview src={block.meta.url} alt="preview" />}
              <FieldInput
                value={block.meta?.url ?? ''}
                onChange={(e) => setMeta({ url: e.target.value })}
                placeholder="Ou coller une URL d'image..."
              />
            </FieldGroup>
            <FieldRow>
              <FieldGroup>
                <FieldLabel>Texte alternatif</FieldLabel>
                <FieldInput
                  value={block.meta?.alt ?? ''}
                  onChange={(e) => setMeta({ alt: e.target.value })}
                  placeholder="Description accessibilite"
                />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Legende</FieldLabel>
                <FieldInput
                  value={block.meta?.caption ?? ''}
                  onChange={(e) => setMeta({ caption: e.target.value })}
                  placeholder="Legende optionnelle"
                />
              </FieldGroup>
            </FieldRow>
          </>
        );
      case 'video':
        return (
          <>
            <FieldGroup>
              <FieldLabel>URL video</FieldLabel>
              <FieldInput
                value={block.meta?.url ?? ''}
                onChange={(e) => setMeta({ url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Legende</FieldLabel>
              <FieldInput
                value={block.meta?.caption ?? ''}
                onChange={(e) => setMeta({ caption: e.target.value })}
                placeholder="Legende optionnelle"
              />
            </FieldGroup>
          </>
        );
      case 'code':
        return (
          <>
            <FieldGroup>
              <FieldLabel>Langage</FieldLabel>
              <FieldSelect
                value={block.meta?.language ?? 'typescript'}
                onChange={(e) => setMeta({ language: e.target.value })}
              >
                {[
                  'typescript',
                  'javascript',
                  'python',
                  'bash',
                  'sql',
                  'json',
                  'html',
                  'css',
                  'rust',
                  'go',
                  'java',
                  'php',
                  'yaml',
                  'markdown',
                ].map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </FieldSelect>
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Code</FieldLabel>
              <MonoTextarea
                value={block.content ?? ''}
                onChange={(e) => setContent(e.target.value)}
                placeholder="// Coller le code ici..."
                spellCheck={false}
              />
            </FieldGroup>
          </>
        );
      case 'callout':
        return (
          <>
            <FieldGroup>
              <FieldLabel>Type</FieldLabel>
              <FieldSelect
                value={block.meta?.variant ?? 'info'}
                onChange={(e) =>
                  setMeta({ variant: e.target.value as 'info' | 'warning' | 'tip' | 'danger' })
                }
              >
                <option value="info">Info</option>
                <option value="warning">Attention</option>
                <option value="danger">Important</option>
                <option value="tip">Conseil</option>
              </FieldSelect>
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Message</FieldLabel>
              <FieldTextarea
                value={block.content ?? ''}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Contenu du callout..."
              />
            </FieldGroup>
          </>
        );
      case 'divider':
        return (
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            Separateur visuel - aucune configuration necessaire.
          </p>
        );
      case 'file':
        return (
          <>
            <FieldGroup>
              <FieldLabel>Fichier (upload)</FieldLabel>
              <UploadArea>
                <input type="file" onChange={handleFileUpload} />
                <FileDown size={14} /> Choisir un fichier
              </UploadArea>
            </FieldGroup>
            <FieldRow>
              <FieldGroup>
                <FieldLabel>Nom affiche</FieldLabel>
                <FieldInput
                  value={block.meta?.filename ?? ''}
                  onChange={(e) => setMeta({ filename: e.target.value })}
                  placeholder="rapport-q3.pdf"
                />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Taille affichee</FieldLabel>
                <FieldInput
                  value={block.meta?.filesize ?? ''}
                  onChange={(e) => setMeta({ filesize: e.target.value })}
                  placeholder="420 KB"
                />
              </FieldGroup>
            </FieldRow>
            <FieldGroup>
              <FieldLabel>URL du fichier</FieldLabel>
              <FieldInput
                value={block.meta?.url ?? ''}
                onChange={(e) => setMeta({ url: e.target.value })}
                placeholder="Ou coller l'URL directement"
              />
            </FieldGroup>
          </>
        );
      case 'step_group': {
        const steps = block.meta?.steps ?? [];

        const updateStep = (stepIndex: number, field: 'title' | 'content' | 'code', value: string) => {
          const updated = steps.map((step, index) =>
            index === stepIndex ? { ...step, [field]: value } : step,
          );
          setMeta({ steps: updated });
        };

        const addStep = () =>
          setMeta({ steps: [...steps, { title: '', content: '', code: '' }] });

        const removeStep = (stepIndex: number) =>
          setMeta({ steps: steps.filter((_, index) => index !== stepIndex) });

        return (
          <StepsEditorWrapper>
            {steps.map((step, stepIndex) => (
              <StepEditorItem key={`${block.id}-editor-step-${stepIndex}`}>
                <StepEditorHeader>
                  <StepNum>{stepIndex + 1}</StepNum>
                  <span style={{ flex: 1, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Etape {stepIndex + 1}
                  </span>
                  <ActionBtn $danger type="button" onClick={() => removeStep(stepIndex)}>
                    <Trash2 size={12} />
                  </ActionBtn>
                </StepEditorHeader>
                <StepEditorBody>
                  <FieldInput
                    value={step.title}
                    onChange={(e) => updateStep(stepIndex, 'title', e.target.value)}
                    placeholder="Titre de l'etape"
                  />
                  <FieldTextarea
                    value={step.content ?? ''}
                    onChange={(e) => updateStep(stepIndex, 'content', e.target.value)}
                    placeholder="Description de l'etape"
                    style={{ minHeight: '60px' }}
                  />
                  <MonoTextarea
                    value={step.code ?? ''}
                    onChange={(e) => updateStep(stepIndex, 'code', e.target.value)}
                    placeholder="// Bloc de code associe"
                    style={{ minHeight: '60px' }}
                  />
                </StepEditorBody>
              </StepEditorItem>
            ))}
            <AddStepButton type="button" onClick={addStep}>
              <Plus size={13} /> Ajouter une etape
            </AddStepButton>
          </StepsEditorWrapper>
        );
      }
      default:
        return null;
    }
  };

  return (
    <BlockItem
      $focused={focused}
      onClick={onFocus}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <BlockItemHeader>
        <DragHandle>
          <GripVertical size={14} />
        </DragHandle>
        <BlockTypeLabel>{getBlockLabel(block.type)}</BlockTypeLabel>
        <BlockActions>
          <ActionBtn type="button" onClick={onMoveUp} disabled={index === 0} title="Monter">
            <ChevronUp size={13} />
          </ActionBtn>
          <ActionBtn
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            title="Descendre"
          >
            <ChevronDown size={13} />
          </ActionBtn>
          <ActionBtn $danger type="button" onClick={onDelete} title="Supprimer">
            <Trash2 size={13} />
          </ActionBtn>
        </BlockActions>
      </BlockItemHeader>
      <BlockItemBody>{renderBody()}</BlockItemBody>
    </BlockItem>
  );
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  const addBlock = (type: BlockType) => {
    const newBlock = createBlock(type);
    onChange([...blocks, newBlock]);
    setFocusedId(newBlock.id);
  };

  const updateBlock = (id: string, updated: Block) => {
    onChange(blocks.map((block) => (block.id === id ? updated : block)));
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const next = [...blocks];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <EditorWrapper>
      <Toolbar>
        <ToolbarTitle>{blocks.length} bloc{blocks.length !== 1 ? 's' : ''}</ToolbarTitle>
        <PreviewButton
          type="button"
          onClick={() => setShowPreview((prev) => !prev)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
          {showPreview ? 'Masquer l’aperçu' : 'Afficher l’aperçu'}
        </PreviewButton>
      </Toolbar>

      <BlockList>
        <AnimatePresence>
          {blocks.map((block, index) => (
            <BlockEditorItem
              key={block.id}
              block={block}
              index={index}
              total={blocks.length}
              focused={focusedId === block.id}
              onFocus={() => setFocusedId(block.id)}
              onChange={(updated) => updateBlock(block.id, updated)}
              onDelete={() => deleteBlock(block.id)}
              onMoveUp={() => moveBlock(index, 'up')}
              onMoveDown={() => moveBlock(index, 'down')}
            />
          ))}
        </AnimatePresence>
      </BlockList>

      <AddBlockBar>
        <AddBlockLabel>Ajouter un bloc</AddBlockLabel>
        {BLOCK_TYPES.map(({ type, label, icon }) => (
          <BlockTypeButton
            key={type}
            type="button"
            onClick={() => addBlock(type)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {icon} {label}
          </BlockTypeButton>
        ))}
      </AddBlockBar>

      {showPreview && (
        <PreviewPanel>
          <PreviewHeader>
            <PreviewTitle>Aperçu en temps réel</PreviewTitle>
          </PreviewHeader>
          <BlockRenderer blocks={blocks} />
        </PreviewPanel>
      )}
    </EditorWrapper>
  );
}
