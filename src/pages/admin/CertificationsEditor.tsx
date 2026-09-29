import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import styled from 'styled-components';
import { useCertifications } from '../../hooks/useCertifications';
import { useMedia } from '../../hooks/useMedia';
import { supabase } from '../../lib/supabase';
import { staggerContainer, staggerItem } from '../../lib/animations';
import type { Certification } from '../../types';

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

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
  }
`;

const List = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Card = styled(motion.div)<{ $inactive: boolean }>`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  opacity: ${({ $inactive }) => ($inactive ? 0.6 : 1)};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

const Num = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(11,122,117, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const CardLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
`;

const IconBtn = styled.button<{ $danger?: boolean; $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  color: ${({ $danger, $active, theme }) =>
    $danger ? theme.colors.danger : $active ? theme.colors.success : theme.colors.textMuted};

  &:hover {
    background: ${({ $danger, $active }) =>
      $danger
        ? 'rgba(192,57,43,0.12)'
        : $active
          ? 'rgba(30,142,90,0.1)'
          : 'rgba(20,23,31,0.06)'};
    color: ${({ $danger, $active, theme }) =>
      $danger ? theme.colors.danger : $active ? theme.colors.success : theme.colors.textPrimary};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const SaveBtn = styled(motion.button)<{ $saved: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid;
  background: ${({ $saved, theme }) => ($saved ? 'rgba(30,142,90,0.1)' : theme.colors.accent)};
  color: ${({ $saved, theme }) => ($saved ? theme.colors.success : '#fff')};
  border-color: ${({ $saved }) => ($saved ? 'rgba(30,142,90,0.25)' : 'transparent')};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CardBody = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;

  @media (min-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }
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
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.875rem;
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
  padding: 0.6rem 0.875rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 70px;
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

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const BadgePreview = styled.div`
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.textMuted};

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const UploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border: 1px dashed ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  input { display: none; }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }
`;

const VerifyPreview = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
`;

const EmptyState = styled(motion.div)`
  padding: 4rem 2rem;
  text-align: center;
  color: var(--color-text-muted);
  background: var(--color-bg-card);
  border-radius: 16px;
  border: 1px dashed var(--color-surface-border);
`;

interface CertificationItemProps {
  certification: Certification;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onUpdate: (certification: Certification) => void;
}

function CertificationItem({
  certification,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
}: CertificationItemProps) {
  const [form, setForm] = useState(certification);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { upload } = useMedia();

  useEffect(() => {
    setForm(certification);
  }, [certification]);

  const setField = <K extends keyof Certification>(key: K, value: Certification[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);

    const { data, error } = await supabase
      .from('certifications')
      .update({
        title: form.title,
        issuer: form.issuer,
        issued_at: form.issued_at || null,
        credential_url: form.credential_url,
        image_url: form.image_url,
        description: form.description,
        active: form.active,
      })
      .eq('id', form.id)
      .select()
      .single();

    if (!error && data) {
      onUpdate(data);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    }

    setSaving(false);
  };

  const handleToggle = async () => {
    const newActive = !form.active;
    setField('active', newActive);
    await supabase.from('certifications').update({ active: newActive }).eq('id', form.id);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await upload(file, 'certifications');
    if (url) setField('image_url', url);
    setUploading(false);
  };

  return (
    <Card
      $inactive={!form.active}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <CardHeader>
        <Num>{index + 1}</Num>
        <CardLabel>{form.title || 'Certification sans titre'}</CardLabel>
        <HeaderActions>
          <IconBtn
            $active={form.active}
            onClick={handleToggle}
            type="button"
            title={form.active ? 'Masquer du site' : 'Afficher sur le site'}
          >
            {form.active ? <Eye size={13} /> : <EyeOff size={13} />}
          </IconBtn>
          <IconBtn onClick={onMoveUp} type="button" disabled={index === 0} title="Monter">
            <ChevronUp size={13} />
          </IconBtn>
          <IconBtn onClick={onMoveDown} type="button" disabled={index === total - 1} title="Descendre">
            <ChevronDown size={13} />
          </IconBtn>
          <IconBtn $danger onClick={onDelete} type="button" title="Supprimer">
            <Trash2 size={13} />
          </IconBtn>
          <SaveBtn $saved={saved} onClick={handleSave} disabled={saving} whileTap={{ scale: 0.97 }}>
            {saved ? (
              <>
                <CheckCircle size={11} /> OK
              </>
            ) : (
              <>
                <Save size={11} /> Sauvegarder
              </>
            )}
          </SaveBtn>
        </HeaderActions>
      </CardHeader>

      <CardBody>
        <FieldRow>
          <FieldGroup>
            <FieldLabel>Intitulé</FieldLabel>
            <StyledInput
              value={form.title}
              onChange={(event) => setField('title', event.target.value)}
              placeholder="ex: Introduction to Cybersecurity"
            />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Organisme émetteur</FieldLabel>
            <StyledInput
              value={form.issuer}
              onChange={(event) => setField('issuer', event.target.value)}
              placeholder="ex: Cisco"
            />
          </FieldGroup>
        </FieldRow>

        <FieldRow>
          <FieldGroup>
            <FieldLabel>Date d&apos;obtention</FieldLabel>
            <StyledInput
              type="date"
              value={form.issued_at ? form.issued_at.slice(0, 10) : ''}
              onChange={(event) => setField('issued_at', event.target.value || null)}
            />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Lien de vérification</FieldLabel>
            <StyledInput
              value={form.credential_url}
              onChange={(event) => setField('credential_url', event.target.value)}
              placeholder="https://www.credly.com/badges/..."
            />
            {form.credential_url && (
              <VerifyPreview href={form.credential_url} target="_blank" rel="noopener noreferrer">
                Tester le lien <ExternalLink size={12} />
              </VerifyPreview>
            )}
          </FieldGroup>
        </FieldRow>

        <FieldGroup>
          <FieldLabel>Badge</FieldLabel>
          <BadgeRow>
            <BadgePreview>
              {form.image_url ? (
                <img src={form.image_url} alt="" />
              ) : (
                <Award size={26} strokeWidth={1.5} />
              )}
            </BadgePreview>
            <UploadLabel>
              <Upload size={14} />
              {uploading ? 'Envoi en cours...' : 'Téléverser une image'}
              <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
            </UploadLabel>
            <StyledInput
              style={{ flex: 1, minWidth: '220px' }}
              value={form.image_url}
              onChange={(event) => setField('image_url', event.target.value)}
              placeholder="ou coller une URL / un chemin (/certifications/badge.png)"
            />
          </BadgeRow>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Description (optionnel)</FieldLabel>
          <StyledTextarea
            value={form.description}
            onChange={(event) => setField('description', event.target.value)}
            placeholder="Ce que couvre la certification..."
          />
        </FieldGroup>
      </CardBody>
    </Card>
  );
}

export default function CertificationsEditor() {
  const { certifications: initial, loading } = useCertifications(true);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    setCertifications(initial);
  }, [initial]);

  const handleAdd = async () => {
    const { data, error } = await supabase
      .from('certifications')
      .insert({
        title: 'Nouvelle certification',
        issuer: '',
        credential_url: '',
        image_url: '',
        description: '',
        display_order: certifications.length + 1,
        active: true,
      })
      .select()
      .single();

    if (!error && data) {
      setCertifications((prev) => [...prev, data]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette certification ?')) return;
    await supabase.from('certifications').delete().eq('id', id);
    setCertifications((prev) => prev.filter((item) => item.id !== id));
  };

  const move = async (index: number, direction: 'up' | 'down') => {
    const reordered = [...certifications];
    const target = direction === 'up' ? index - 1 : index + 1;

    if (target < 0 || target >= reordered.length) return;

    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    await Promise.all(
      reordered.map((item, itemIndex) =>
        supabase
          .from('certifications')
          .update({ display_order: itemIndex + 1 })
          .eq('id', item.id),
      ),
    );

    setCertifications(reordered);
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--color-text-secondary)' }}>Chargement...</div>;
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={staggerItem}>
        <PageHeader>
          <div>
            <PageTitle>Certifications</PageTitle>
            <PageSubtitle>
              Badges affichés sur la page d&apos;accueil, avec leur lien de vérification
            </PageSubtitle>
          </div>
          <AddButton onClick={handleAdd} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Plus size={16} /> Ajouter une certification
          </AddButton>
        </PageHeader>
      </motion.div>

      <motion.div variants={staggerItem}>
        <List variants={staggerContainer} initial="hidden" animate="visible">
          <AnimatePresence>
            {certifications.map((certification, index) => (
              <CertificationItem
                key={certification.id}
                certification={certification}
                index={index}
                total={certifications.length}
                onMoveUp={() => move(index, 'up')}
                onMoveDown={() => move(index, 'down')}
                onDelete={() => handleDelete(certification.id)}
                onUpdate={(updated) =>
                  setCertifications((prev) =>
                    prev.map((item) => (item.id === updated.id ? updated : item)),
                  )
                }
              />
            ))}
          </AnimatePresence>
        </List>
      </motion.div>

      {certifications.length === 0 && (
        <EmptyState variants={staggerItem}>
          <Award size={36} strokeWidth={1} style={{ margin: '0 auto 1rem' }} />
          <p>Aucune certification. Cliquez sur &quot;Ajouter une certification&quot; pour commencer.</p>
        </EmptyState>
      )}
    </motion.div>
  );
}
