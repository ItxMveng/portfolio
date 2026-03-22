import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import styled from 'styled-components';
import { supabase } from '../../lib/supabase';
import { useServices } from '../../hooks/useServices';
import { staggerContainer, staggerItem } from '../../lib/animations';
import type { Service } from '../../types';

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

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
  }
`;

const ServicesList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ServiceCard = styled(motion.div)<{ $inactive: boolean }>`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  opacity: ${({ $inactive }) => ($inactive ? 0.6 : 1)};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const ServiceCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  cursor: pointer;
  user-select: none;
`;

const DragHandle = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const ServiceIcon = styled.div`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const ServiceHeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ServiceHeaderTitle = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ServiceHeaderSub = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
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
          : 'rgba(255,255,255,0.05)'};
    color: ${({ $danger, $active, theme }) =>
      $danger ? theme.colors.danger : $active ? theme.colors.teal : theme.colors.textPrimary};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const SaveServiceBtn = styled(motion.button)<{ $saved: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.875rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid;
  transition: all ${({ theme }) => theme.transitions.fast};
  background: ${({ $saved, theme }) => ($saved ? 'rgba(0,212,170,0.1)' : theme.colors.accent)};
  color: ${({ $saved, theme }) => ($saved ? theme.colors.teal : '#fff')};
  border-color: ${({ $saved }) => ($saved ? 'rgba(0,212,170,0.25)' : 'transparent')};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ServiceCardBody = styled(motion.div)`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  overflow: hidden;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const FieldLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 0.875rem;
  align-items: start;
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
  min-height: 80px;
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

const EmojiInput = styled(StyledInput)`
  font-size: 1.5rem;
  text-align: center;
  padding: 0.5rem;
`;

const BulletsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BulletRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BulletDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
`;

const AddBulletBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.accent};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.accentHover};
  }
`;

const RemoveBulletBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    background: rgba(239,68,68,0.12);
    color: ${({ theme }) => theme.colors.danger};
  }
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

const EmptyState = styled(motion.div)`
  padding: 4rem 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px dashed ${({ theme }) => theme.colors.surfaceBorder};
`;

const LoadingState = styled.div`
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface ServiceItemProps {
  service: Service;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onUpdate: (service: Service) => void;
}

function ServiceItem({
  service,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
}: ServiceItemProps) {
  const [form, setForm] = useState<Service>(service);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(service);
  }, [service]);

  const setField = <K extends keyof Service>(key: K, value: Service[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const setBullet = (indexToUpdate: number, value: string) => {
    const bullets = [...form.bullets];
    bullets[indexToUpdate] = value;
    setField('bullets', bullets);
  };

  const addBullet = () => setField('bullets', [...form.bullets, '']);

  const removeBullet = (indexToRemove: number) => {
    setField(
      'bullets',
      form.bullets.filter((_, bulletIndex) => bulletIndex !== indexToRemove)
    );
  };

  const handleSave = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setSaving(true);

    const { data, error } = await supabase
      .from('services')
      .update({
        title: form.title,
        icon: form.icon,
        tagline: form.tagline,
        description: form.description,
        bullets: form.bullets,
        workflow: form.workflow,
        cta_label: form.cta_label,
        cta_url: form.cta_url,
        active: form.active,
      })
      .eq('id', form.id)
      .select()
      .single();

    if (!error && data) {
      onUpdate(data as Service);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    }

    setSaving(false);
  };

  const handleToggleActive = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const newActive = !form.active;
    setField('active', newActive);

    const { error } = await supabase
      .from('services')
      .update({ active: newActive })
      .eq('id', form.id);

    if (!error) {
      onUpdate({ ...form, active: newActive });
    } else {
      setField('active', !newActive);
    }
  };

  return (
    <ServiceCard
      $inactive={!form.active}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <ServiceCardHeader onClick={() => setOpen((prev) => !prev)}>
        <DragHandle>
          <GripVertical size={15} />
        </DragHandle>
        <ServiceIcon>{form.icon}</ServiceIcon>
        <ServiceHeaderInfo>
          <ServiceHeaderTitle>{form.title || 'Service sans titre'}</ServiceHeaderTitle>
          <ServiceHeaderSub>{form.tagline || 'Aucun tagline'}</ServiceHeaderSub>
        </ServiceHeaderInfo>
        <HeaderActions onClick={(event) => event.stopPropagation()}>
          <IconBtn
            type="button"
            onClick={handleToggleActive}
            $active={form.active}
            title={form.active ? 'Désactiver' : 'Activer'}
          >
            {form.active ? <Eye size={14} /> : <EyeOff size={14} />}
          </IconBtn>
          <IconBtn
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            title="Monter"
          >
            <ChevronUp size={14} />
          </IconBtn>
          <IconBtn
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            title="Descendre"
          >
            <ChevronDown size={14} />
          </IconBtn>
          <IconBtn $danger type="button" onClick={onDelete} title="Supprimer">
            <Trash2 size={14} />
          </IconBtn>
          <SaveServiceBtn
            type="button"
            $saved={saved}
            onClick={handleSave}
            disabled={saving}
            whileTap={{ scale: 0.97 }}
          >
            {saved ? (
              <>
                <CheckCircle size={12} /> OK
              </>
            ) : (
              <>
                <Save size={12} /> Sauvegarder
              </>
            )}
          </SaveServiceBtn>
        </HeaderActions>
      </ServiceCardHeader>

      <AnimatePresence initial={false}>
        {open && (
          <ServiceCardBody
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <FieldRow>
              <FieldGroup>
                <FieldLabel>Icône</FieldLabel>
                <EmojiInput
                  value={form.icon}
                  onChange={(event) => setField('icon', event.target.value)}
                  placeholder="🌐"
                  maxLength={2}
                />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Titre</FieldLabel>
                <StyledInput
                  value={form.title}
                  onChange={(event) => setField('title', event.target.value)}
                  placeholder="Web & Mobile"
                />
              </FieldGroup>
            </FieldRow>

            <FieldGroup>
              <FieldLabel>Tagline (sous-titre court)</FieldLabel>
              <StyledInput
                value={form.tagline}
                onChange={(event) => setField('tagline', event.target.value)}
                placeholder="Applications web et mobiles orientées conversion"
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Description</FieldLabel>
              <StyledTextarea
                value={form.description}
                onChange={(event) => setField('description', event.target.value)}
                placeholder="Conception d'applications web et mobiles..."
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Points clés</FieldLabel>
              <BulletsWrapper>
                {form.bullets.map((bullet, bulletIndex) => (
                  <BulletRow key={`${form.id}-bullet-${bulletIndex}`}>
                    <BulletDot />
                    <StyledInput
                      value={bullet}
                      onChange={(event) => setBullet(bulletIndex, event.target.value)}
                      placeholder={`Point clé ${bulletIndex + 1}`}
                    />
                    <RemoveBulletBtn type="button" onClick={() => removeBullet(bulletIndex)}>
                      <Trash2 size={12} />
                    </RemoveBulletBtn>
                  </BulletRow>
                ))}
                <AddBulletBtn type="button" onClick={addBullet}>
                  <Plus size={13} /> Ajouter un point
                </AddBulletBtn>
              </BulletsWrapper>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Workflow (ex: Brief → Design → Build)</FieldLabel>
              <StyledInput
                value={form.workflow}
                onChange={(event) => setField('workflow', event.target.value)}
                placeholder="Brief → Design → Build → Deploy"
              />
            </FieldGroup>

            <TwoCol>
              <FieldGroup>
                <FieldLabel>Label CTA</FieldLabel>
                <StyledInput
                  value={form.cta_label}
                  onChange={(event) => setField('cta_label', event.target.value)}
                  placeholder="Lancer mon app"
                />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>URL CTA (vide = contact)</FieldLabel>
                <StyledInput
                  value={form.cta_url}
                  onChange={(event) => setField('cta_url', event.target.value)}
                  placeholder="https://..."
                />
              </FieldGroup>
            </TwoCol>
          </ServiceCardBody>
        )}
      </AnimatePresence>
    </ServiceCard>
  );
}

export default function ServicesEditor() {
  const { services: initialServices, loading } = useServices(true);
  const [services, setServices] = useState<Service[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    window.setTimeout(() => setFeedback(null), 2500);
  };

  const handleAdd = async () => {
    const newService = {
      title: 'Nouveau service',
      icon: '⚡',
      tagline: '',
      description: '',
      bullets: [],
      workflow: '',
      cta_label: '',
      cta_url: '',
      display_order: services.length + 1,
      active: true,
    };

    const { data, error } = await supabase
      .from('services')
      .insert(newService)
      .select()
      .single();

    if (!error && data) {
      setServices((prev) => [...prev, data as Service]);
      showFeedback('success', 'Service ajouté.');
    } else {
      showFeedback('error', 'Impossible d’ajouter le service.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce service ?')) {
      return;
    }

    const { error } = await supabase.from('services').delete().eq('id', id);

    if (error) {
      showFeedback('error', 'Impossible de supprimer ce service.');
      return;
    }

    const remaining = services.filter((service) => service.id !== id);
    const reordered = remaining.map((service, index) => ({
      ...service,
      display_order: index + 1,
    }));

    await Promise.all(
      reordered.map((service) =>
        supabase.from('services').update({ display_order: service.display_order }).eq('id', service.id)
      )
    );

    setServices(reordered);
    showFeedback('success', 'Service supprimé.');
  };

  const moveService = async (index: number, direction: 'up' | 'down') => {
    const reordered = [...services];
    const target = direction === 'up' ? index - 1 : index + 1;

    if (target < 0 || target >= reordered.length) {
      return;
    }

    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    const withOrder = reordered.map((service, serviceIndex) => ({
      ...service,
      display_order: serviceIndex + 1,
    }));

    const updates = await Promise.all(
      withOrder.map((service) =>
        supabase
          .from('services')
          .update({ display_order: service.display_order })
          .eq('id', service.id)
      )
    );

    if (updates.some((result) => result.error)) {
      showFeedback('error', 'Impossible de réordonner les services.');
      return;
    }

    setServices(withOrder);
  };

  if (loading) {
    return <LoadingState>Chargement...</LoadingState>;
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={staggerItem}>
        <PageHeader>
          <div>
            <PageTitle>Services</PageTitle>
            <PageSubtitle>Gérez les prestations affichées sur la page d&apos;accueil</PageSubtitle>
          </div>
          <AddButton onClick={handleAdd} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Plus size={16} /> Ajouter un service
          </AddButton>
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
            {feedback.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {feedback.msg}
          </FeedbackBanner>
        )}
      </AnimatePresence>

      <motion.div variants={staggerItem}>
        <ServicesList variants={staggerContainer} initial="hidden" animate="visible">
          <AnimatePresence>
            {services.map((service, index) => (
              <ServiceItem
                key={service.id}
                service={service}
                index={index}
                total={services.length}
                onMoveUp={() => moveService(index, 'up')}
                onMoveDown={() => moveService(index, 'down')}
                onDelete={() => handleDelete(service.id)}
                onUpdate={(updatedService) =>
                  setServices((prev) =>
                    prev.map((serviceItem) =>
                      serviceItem.id === updatedService.id ? updatedService : serviceItem
                    )
                  )
                }
              />
            ))}
          </AnimatePresence>
        </ServicesList>
      </motion.div>

      {services.length === 0 && (
        <motion.div variants={staggerItem}>
          <EmptyState>
            <Briefcase size={36} strokeWidth={1} style={{ margin: '0 auto 1rem' }} />
            <p>Aucun service. Cliquez sur &quot;Ajouter un service&quot; pour commencer.</p>
          </EmptyState>
        </motion.div>
      )}
    </motion.div>
  );
}
