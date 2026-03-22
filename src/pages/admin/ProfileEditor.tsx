import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  FileText,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Save,
  Upload,
  User,
  Zap,
} from 'lucide-react';
import styled from 'styled-components';
import { useMedia } from '../../hooks/useMedia';
import { useProfile } from '../../hooks/useProfile';
import { staggerContainer, staggerItem } from '../../lib/animations';
import type { Profile } from '../../types';

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

const SaveButton = styled(motion.button)<{ $saved: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all ${({ theme }) => theme.transitions.base};
  background: ${({ $saved, theme }) => ($saved ? 'rgba(0,212,170,0.15)' : theme.colors.accent)};
  color: ${({ $saved, theme }) => ($saved ? theme.colors.teal : '#fff')};
  border: 1px solid
    ${({ $saved }) => ($saved ? 'rgba(0,212,170,0.3)' : 'transparent')};

  &:hover:not(:disabled) {
    background: ${({ $saved, theme }) =>
      $saved ? 'rgba(0,212,170,0.2)' : theme.colors.accentHover};
    box-shadow: ${({ $saved, theme }) =>
      $saved ? 'none' : `0 0 24px ${theme.colors.accentGlow}`};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 300px 1fr;
    align-items: start;
  }
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.125rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const AccentIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.accent};
`;

const CardBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9rem;
  font-family: inherit;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.bgSecondary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.7rem 1rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.bgSecondary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.7rem 1rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9rem;
  font-family: inherit;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
`;

const AvatarPreview = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: ${({ theme }) => theme.colors.accentDim};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
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

const UploadHint = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

const StatusDot = styled.span<{ $status: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $status, theme }) =>
    $status === 'open'
      ? theme.colors.teal
      : $status === 'busy'
        ? theme.colors.warning
        : theme.colors.danger};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.875rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
`;

const StatLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatValueInput = styled.input`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.25rem;
  font-weight: 700;
  width: 100%;
  font-family: inherit;
  padding: 0;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const FeedbackBanner = styled(motion.div)<{ $success: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.875rem 1.25rem;
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

type ProfileStats = NonNullable<Profile['stats']>;

function getSafeStats(stats?: Partial<ProfileStats>): ProfileStats {
  return {
    projects: Number(stats?.projects ?? 0),
    domains: Number(stats?.domains ?? 0),
    response_time: stats?.response_time ?? '< 24h',
  };
}

export default function ProfileEditor() {
  const { profile, loading, update } = useProfile();
  const { upload } = useMedia();
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        ...profile,
        stats: getSafeStats(profile.stats),
      });
    }
  }, [profile]);

  const setField = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const setStats = (key: keyof ProfileStats, value: string) => {
    setForm((prev) => ({
      ...prev,
      stats: {
        ...getSafeStats(prev.stats),
        [key]: key === 'response_time' ? value : Number(value || 0),
      },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    const payload: Partial<Profile> = {
      ...form,
      stats: getSafeStats(form.stats),
    };

    const { error } = await update(payload);

    if (error) {
      setFeedback({ type: 'error', msg: 'Erreur lors de la sauvegarde.' });
    } else {
      setFeedback({ type: 'success', msg: 'Profil mis à jour avec succès !' });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const url = await upload(file, 'avatars');
    if (url) setField('avatar_url', url);
    setUploadingAvatar(false);
  };

  const handleCvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCv(true);
    const url = await upload(file, 'cv');
    if (url) setField('cv_url', url);
    setUploadingCv(false);
  };

  if (loading) {
    return <LoadingState>Chargement...</LoadingState>;
  }

  const stats = getSafeStats(form.stats);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={staggerItem}>
        <PageHeader>
          <div>
            <PageTitle>Profil</PageTitle>
            <PageSubtitle>Informations personnelles et paramètres du portfolio</PageSubtitle>
          </div>
          <SaveButton
            $saved={saved}
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {saved ? (
              <>
                <CheckCircle size={16} /> Sauvegardé
              </>
            ) : (
              <>
                <Save size={16} /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </>
            )}
          </SaveButton>
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

      <Grid variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div
          variants={staggerItem}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <Card>
            <CardHeader>
              <AccentIcon>
                <User size={15} />
              </AccentIcon>
              <CardTitle>Photo de profil</CardTitle>
            </CardHeader>
            <AvatarSection>
              <AvatarPreview>
                {form.avatar_url ? (
                  <img src={form.avatar_url} alt="avatar" />
                ) : (
                  form.full_name?.[0] ?? 'A'
                )}
              </AvatarPreview>
              <UploadLabel>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} />
                <Upload size={14} />
                {uploadingAvatar ? 'Upload...' : 'Changer la photo'}
              </UploadLabel>
              <UploadHint>JPG, PNG ou WebP — max 2 MB</UploadHint>
              {form.avatar_url && (
                <StyledInput
                  value={form.avatar_url}
                  onChange={(event) => setField('avatar_url', event.target.value)}
                  placeholder="ou URL directe..."
                  style={{ fontSize: '0.75rem' }}
                />
              )}
            </AvatarSection>
          </Card>

          <Card>
            <CardHeader>
              <AccentIcon>
                <Zap size={15} />
              </AccentIcon>
              <CardTitle>Disponibilité</CardTitle>
            </CardHeader>
            <CardBody>
              <FieldGroup>
                <FieldLabel>
                  <StatusDot $status={form.status ?? 'open'} />
                  Statut affiché
                </FieldLabel>
                <StyledSelect
                  value={form.status ?? 'open'}
                  onChange={(event) =>
                    setField('status', event.target.value as Profile['status'])
                  }
                >
                  <option value="open">Disponible</option>
                  <option value="busy">Occupé</option>
                  <option value="closed">Indisponible</option>
                </StyledSelect>
              </FieldGroup>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <AccentIcon>
                <BarChart3 size={15} />
              </AccentIcon>
              <CardTitle>Stats — Hero</CardTitle>
            </CardHeader>
            <CardBody>
              <StatsGrid>
                <StatInput>
                  <StatLabel>Projets</StatLabel>
                  <StatValueInput
                    type="number"
                    value={stats.projects}
                    onChange={(event) => setStats('projects', event.target.value)}
                    placeholder="4"
                  />
                </StatInput>
                <StatInput>
                  <StatLabel>Domaines</StatLabel>
                  <StatValueInput
                    type="number"
                    value={stats.domains}
                    onChange={(event) => setStats('domains', event.target.value)}
                    placeholder="3"
                  />
                </StatInput>
                <StatInput>
                  <StatLabel>Réponse</StatLabel>
                  <StatValueInput
                    value={stats.response_time}
                    onChange={(event) => setStats('response_time', event.target.value)}
                    placeholder="< 24h"
                  />
                </StatInput>
              </StatsGrid>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          variants={staggerItem}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <Card>
            <CardHeader>
              <AccentIcon>
                <User size={15} />
              </AccentIcon>
              <CardTitle>Informations principales</CardTitle>
            </CardHeader>
            <CardBody>
              <FieldRow>
                <FieldGroup>
                  <FieldLabel>
                    <User size={12} /> Nom complet
                  </FieldLabel>
                  <StyledInput
                    value={form.full_name ?? ''}
                    onChange={(event) => setField('full_name', event.target.value)}
                    placeholder="Francis Itoua"
                  />
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel>
                    <MapPin size={12} /> Localisation
                  </FieldLabel>
                  <StyledInput
                    value={form.location ?? ''}
                    onChange={(event) => setField('location', event.target.value)}
                    placeholder="Paris, France"
                  />
                </FieldGroup>
              </FieldRow>

              <FieldGroup>
                <FieldLabel>
                  <Zap size={12} /> Titre / Accroche
                </FieldLabel>
                <StyledInput
                  value={form.title ?? ''}
                  onChange={(event) => setField('title', event.target.value)}
                  placeholder="Ingénieur informatique — IA, automatisation et applications sur mesure"
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>
                  <FileText size={12} /> Bio
                </FieldLabel>
                <StyledTextarea
                  value={form.bio ?? ''}
                  onChange={(event) => setField('bio', event.target.value)}
                  placeholder="Je conçois des expériences numériques utiles, rapides et mémorables..."
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>
                  <MessageSquare size={12} /> Texte d&apos;accroche — Section Contact
                </FieldLabel>
                <StyledTextarea
                  value={form.contact_hook ?? ''}
                  onChange={(event) => setField('contact_hook', event.target.value)}
                  placeholder="Si votre projet doit marquer..."
                  style={{ minHeight: '80px' }}
                />
              </FieldGroup>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <AccentIcon>
                <Mail size={15} />
              </AccentIcon>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardBody>
              <FieldRow>
                <FieldGroup>
                  <FieldLabel>
                    <Mail size={12} /> Email
                  </FieldLabel>
                  <StyledInput
                    type="email"
                    value={form.email ?? ''}
                    onChange={(event) => setField('email', event.target.value)}
                    placeholder="contact@exemple.com"
                  />
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel>
                    <Phone size={12} /> Téléphone
                  </FieldLabel>
                  <StyledInput
                    value={form.phone ?? ''}
                    onChange={(event) => setField('phone', event.target.value)}
                    placeholder="+33 6 00 00 00 00"
                  />
                </FieldGroup>
              </FieldRow>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <AccentIcon>
                <Globe size={15} />
              </AccentIcon>
              <CardTitle>Liens & réseaux</CardTitle>
            </CardHeader>
            <CardBody>
              <FieldGroup>
                <FieldLabel>
                  <Github size={12} /> GitHub
                </FieldLabel>
                <StyledInput
                  value={form.github_url ?? ''}
                  onChange={(event) => setField('github_url', event.target.value)}
                  placeholder="https://github.com/..."
                />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>
                  <Linkedin size={12} /> LinkedIn
                </FieldLabel>
                <StyledInput
                  value={form.linkedin_url ?? ''}
                  onChange={(event) => setField('linkedin_url', event.target.value)}
                  placeholder="https://linkedin.com/in/..."
                />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>
                  <Globe size={12} /> Site web
                </FieldLabel>
                <StyledInput
                  value={form.website_url ?? ''}
                  onChange={(event) => setField('website_url', event.target.value)}
                  placeholder="https://monsite.com"
                />
              </FieldGroup>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <AccentIcon>
                <FileText size={15} />
              </AccentIcon>
              <CardTitle>CV / Document</CardTitle>
            </CardHeader>
            <CardBody>
              <FieldGroup>
                <FieldLabel>Fichier CV (PDF)</FieldLabel>
                <UploadLabel>
                  <input type="file" accept=".pdf" onChange={handleCvUpload} />
                  <Upload size={14} />
                  {uploadingCv ? 'Upload en cours...' : 'Téléverser un PDF'}
                </UploadLabel>
              </FieldGroup>
              {form.cv_url && (
                <FieldGroup>
                  <FieldLabel>URL du CV</FieldLabel>
                  <StyledInput
                    value={form.cv_url}
                    onChange={(event) => setField('cv_url', event.target.value)}
                    placeholder="https://..."
                  />
                </FieldGroup>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </Grid>
    </motion.div>
  );
}
