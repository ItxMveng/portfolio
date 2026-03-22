import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Send,
} from 'lucide-react';
import styled from 'styled-components';
import { Input, SectionLabel, SectionTitle, Textarea } from '../../components/ui';
import { useMessages } from '../../hooks/useMessages';
import { useProfile } from '../../hooks/useProfile';
import { defaultViewport, fadeUp, staggerContainer, staggerItem } from '../../lib/animations';

const Section = styled.section`
  padding: 6rem 0;
  background: ${({ theme }) => theme.colors.bgSecondary};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      ${({ theme }) => theme.colors.surfaceBorder},
      transparent
    );
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 2rem;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
`;

const ContactLeft = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContactHook = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.75;
`;

const ContactInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: rgba(124, 92, 252, 0.3);
    background: ${({ theme }) => theme.colors.bgCardHover};
  }
`;

const ContactInfoIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(124, 92, 252, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
`;

const ContactInfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const ContactInfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ContactInfoValue = styled.span`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
`;

const ContactRight = styled(motion.div)``;

const ContactForm = styled.form`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const FormLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SubmitButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  width: 100%;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: 0 0 24px ${({ theme }) => theme.colors.accentGlow};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FeedbackBanner = styled(motion.div)<{ $success: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.9375rem;
  font-weight: 500;
  background: ${({ $success }) =>
    $success ? 'rgba(0,212,170,0.08)' : 'rgba(239,68,68,0.08)'};
  color: ${({ $success, theme }) => ($success ? theme.colors.teal : theme.colors.danger)};
  border: 1px solid
    ${({ $success }) => ($success ? 'rgba(0,212,170,0.2)' : 'rgba(239,68,68,0.2)')};
`;

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function getAvailabilityLabel(status?: string) {
  if (status === 'open') return 'Disponible';
  if (status === 'busy') return 'Partiellement disponible';
  if (status === 'closed') return 'Indisponible';
  return '';
}

export function ContactSection() {
  const { send } = useMessages();
  const { profile } = useProfile();
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (status !== 'idle') {
      setStatus('idle');
    }

    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.message) {
      return;
    }

    setStatus('sending');
    const { error } = await send(form);
    setStatus(error ? 'error' : 'success');

    if (!error) {
      setForm({ name: '', email: '', subject: '', message: '' });
    }
  };

  const responseTime = profile?.stats?.response_time ?? '';
  const availability = getAvailabilityLabel(profile?.status);
  const availabilityValue = [availability, responseTime].filter(Boolean).join(' · ');

  return (
    <Section id="contact">
      <Container>
        <ContactGrid>
          <ContactLeft
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <motion.div
              variants={staggerItem}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <SectionLabel>Contact</SectionLabel>
              <SectionTitle>
                Un projet a lancer ? <span>Parlons-en.</span>
              </SectionTitle>
            </motion.div>

            <ContactHook>{profile?.contact_hook ?? ''}</ContactHook>

            <ContactInfoList>
              <motion.div variants={staggerItem}>
                <ContactInfoItem>
                  <ContactInfoIcon>
                    <Mail size={16} />
                  </ContactInfoIcon>
                  <ContactInfoText>
                    <ContactInfoLabel>Email</ContactInfoLabel>
                    <ContactInfoValue>{profile?.email ?? ''}</ContactInfoValue>
                  </ContactInfoText>
                </ContactInfoItem>
              </motion.div>

              <motion.div variants={staggerItem}>
                <ContactInfoItem>
                  <ContactInfoIcon>
                    <MapPin size={16} />
                  </ContactInfoIcon>
                  <ContactInfoText>
                    <ContactInfoLabel>Localisation</ContactInfoLabel>
                    <ContactInfoValue>{profile?.location ?? ''}</ContactInfoValue>
                  </ContactInfoText>
                </ContactInfoItem>
              </motion.div>

              <motion.div variants={staggerItem}>
                <ContactInfoItem>
                  <ContactInfoIcon>
                    <Clock size={16} />
                  </ContactInfoIcon>
                  <ContactInfoText>
                    <ContactInfoLabel>Disponibilité</ContactInfoLabel>
                    <ContactInfoValue>{availabilityValue}</ContactInfoValue>
                  </ContactInfoText>
                </ContactInfoItem>
              </motion.div>
            </ContactInfoList>
          </ContactLeft>

          <ContactRight variants={fadeUp} initial="hidden" whileInView="visible" viewport={defaultViewport}>
            <ContactForm onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <FormLabel htmlFor="name">Nom *</FormLabel>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Votre nom"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="email">Email *</FormLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <FormLabel htmlFor="subject">Sujet</FormLabel>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Objet de votre message"
                  value={form.subject}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="message">Message *</FormLabel>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Décrivez votre projet, besoin ou question..."
                  value={form.message}
                  onChange={handleChange}
                  style={{ minHeight: '140px' }}
                  required
                />
              </FormGroup>

              <AnimatePresence mode="wait">
                {status === 'success' && (
                  <FeedbackBanner
                    key="success"
                    $success
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <CheckCircle size={18} />
                    Message envoyé ! Je vous réponds rapidement.
                  </FeedbackBanner>
                )}

                {status === 'error' && (
                  <FeedbackBanner
                    key="error"
                    $success={false}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <AlertCircle size={18} />
                    Une erreur s&apos;est produite. Réessayez ou écrivez directement par email.
                  </FeedbackBanner>
                )}
              </AnimatePresence>

              <SubmitButton
                type="submit"
                disabled={status === 'sending' || status === 'success'}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {status === 'sending' ? (
                  <>Envoi en cours...</>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle size={18} /> Message envoyé
                  </>
                ) : (
                  <>
                    <Send size={18} /> Envoyer ma demande
                  </>
                )}
              </SubmitButton>
            </ContactForm>
          </ContactRight>
        </ContactGrid>
      </Container>
    </Section>
  );
}
