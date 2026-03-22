import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
  Zap,
} from 'lucide-react';
import styled from 'styled-components';
import { useSkills } from '../../hooks/useSkills';
import { supabase } from '../../lib/supabase';
import { staggerContainer, staggerItem } from '../../lib/animations';
import type { Skill } from '../../types';

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

const SkillsList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SkillCard = styled(motion.div)<{ $inactive: boolean }>`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  opacity: ${({ $inactive }) => ($inactive ? 0.6 : 1)};
`;

const SkillCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

const SkillNum = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(124, 92, 252, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const SkillLabel = styled.span`
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
  background: ${({ $saved, theme }) =>
    $saved ? 'rgba(0,212,170,0.1)' : theme.colors.accent};
  color: ${({ $saved, theme }) => ($saved ? theme.colors.teal : '#fff')};
  border-color: ${({ $saved }) => ($saved ? 'rgba(0,212,170,0.25)' : 'transparent')};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SkillCardBody = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
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

interface SkillItemProps {
  skill: Skill;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onUpdate: (skill: Skill) => void;
}

function SkillItem({
  skill,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
}: SkillItemProps) {
  const [form, setForm] = useState(skill);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(skill);
  }, [skill]);

  const handleSave = async () => {
    setSaving(true);

    const { data, error } = await supabase
      .from('skills')
      .update({
        label: form.label,
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
    setForm((prev) => ({ ...prev, active: newActive }));
    await supabase.from('skills').update({ active: newActive }).eq('id', form.id);
  };

  return (
    <SkillCard
      $inactive={!form.active}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <SkillCardHeader>
        <SkillNum>{index + 1}</SkillNum>
        <SkillLabel>{form.label || 'Atout sans titre'}</SkillLabel>
        <HeaderActions>
          <IconBtn
            $active={form.active}
            onClick={handleToggle}
            type="button"
            title={form.active ? 'Désactiver' : 'Activer'}
          >
            {form.active ? <Eye size={13} /> : <EyeOff size={13} />}
          </IconBtn>
          <IconBtn onClick={onMoveUp} type="button" disabled={index === 0}>
            <ChevronUp size={13} />
          </IconBtn>
          <IconBtn onClick={onMoveDown} type="button" disabled={index === total - 1}>
            <ChevronDown size={13} />
          </IconBtn>
          <IconBtn $danger onClick={onDelete} type="button">
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
      </SkillCardHeader>

      <SkillCardBody>
        <FieldGroup>
          <FieldLabel>Libellé (affiché en chip sur le Hero)</FieldLabel>
          <StyledInput
            value={form.label}
            onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
            placeholder="ex: Développement full-stack"
          />
        </FieldGroup>
        <FieldGroup>
          <FieldLabel>Description (optionnel)</FieldLabel>
          <StyledTextarea
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Détail de cet atout..."
          />
        </FieldGroup>
      </SkillCardBody>
    </SkillCard>
  );
}

const EmptyState = styled(motion.div)`
  padding: 4rem 2rem;
  text-align: center;
  color: var(--color-text-muted);
  background: var(--color-bg-card);
  border-radius: 16px;
  border: 1px dashed var(--color-surface-border);
`;

export default function SkillsEditor() {
  const { skills: initialSkills, loading } = useSkills(true);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    if (initialSkills.length > 0) {
      setSkills(initialSkills);
    }
  }, [initialSkills]);

  const handleAdd = async () => {
    const { data, error } = await supabase
      .from('skills')
      .insert({
        label: 'Nouvel atout',
        description: '',
        display_order: skills.length + 1,
        active: true,
      })
      .select()
      .single();

    if (!error && data) {
      setSkills((prev) => [...prev, data]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet atout ?')) return;
    await supabase.from('skills').delete().eq('id', id);
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
  };

  const moveSkill = async (index: number, direction: 'up' | 'down') => {
    const reordered = [...skills];
    const target = direction === 'up' ? index - 1 : index + 1;

    if (target < 0 || target >= reordered.length) {
      return;
    }

    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    await Promise.all(
      reordered.map((skill, skillIndex) =>
        supabase.from('skills').update({ display_order: skillIndex + 1 }).eq('id', skill.id),
      ),
    );

    setSkills(reordered);
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--color-text-secondary)' }}>Chargement...</div>;
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={staggerItem}>
        <PageHeader>
          <div>
            <PageTitle>Atouts & Compétences</PageTitle>
            <PageSubtitle>Chips affichés sur le Hero de la page d&apos;accueil</PageSubtitle>
          </div>
          <AddButton onClick={handleAdd} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Plus size={16} /> Ajouter un atout
          </AddButton>
        </PageHeader>
      </motion.div>

      <motion.div variants={staggerItem}>
        <SkillsList variants={staggerContainer} initial="hidden" animate="visible">
          <AnimatePresence>
            {skills.map((skill, index) => (
              <SkillItem
                key={skill.id}
                skill={skill}
                index={index}
                total={skills.length}
                onMoveUp={() => moveSkill(index, 'up')}
                onMoveDown={() => moveSkill(index, 'down')}
                onDelete={() => handleDelete(skill.id)}
                onUpdate={(updated) =>
                  setSkills((prev) => prev.map((skillItem) => (skillItem.id === updated.id ? updated : skillItem)))
                }
              />
            ))}
          </AnimatePresence>
        </SkillsList>
      </motion.div>

      {skills.length === 0 && (
        <EmptyState variants={staggerItem}>
          <Zap size={36} strokeWidth={1} style={{ margin: '0 auto 1rem' }} />
          <p>Aucun atout. Cliquez sur &quot;Ajouter un atout&quot; pour commencer.</p>
        </EmptyState>
      )}
    </motion.div>
  );
}
