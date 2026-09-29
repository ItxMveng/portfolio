import { motion } from 'framer-motion';
import { BadgeCheck, ExternalLink } from 'lucide-react';
import styled from 'styled-components';
import { SectionLabel, SectionTitle } from '../../components/ui';
import { useCertifications } from '../../hooks/useCertifications';
import { defaultViewport, fadeUp, staggerContainer, staggerItem } from '../../lib/animations';

/* Section 4 → fond de base, pour conserver l'alternance des sections */
const Section = styled.section`
  padding: 6rem 0;
  position: relative;
  background: ${({ theme }) => theme.colors.bg};

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, ${({ theme }) => theme.colors.divider} 30%, ${({ theme }) => theme.colors.divider} 70%, transparent);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) { padding: 0 2rem; }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const SectionDesc = styled(motion.p)`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled(motion.article)`
  position: relative;
  display: flex;
  gap: 1.125rem;
  align-items: flex-start;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s cubic-bezier(0.16,1,0.3,1);

  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(to right, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.sun});
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent}33;
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-6px);
    &::after { opacity: 1; }
  }
`;

const BadgeFrame = styled.div`
  width: 84px;
  height: 84px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  svg {
    color: ${({ theme }) => theme.colors.accent};
  }

  ${Card}:hover & {
    transform: scale(1.05) rotate(-2deg);
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
`;

const Title = styled.h3`
  font-size: 1.0625rem;
  font-weight: 700;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Issuer = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
`;

const IssuedAt = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const Description = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const VerifyLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.35rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  width: fit-content;
  border-bottom: 1px solid transparent;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-bottom-color: ${({ theme }) => theme.colors.accent};
  }
`;

function formatIssuedAt(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date
    .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

export function CertificationsSection() {
  const { certifications, loading } = useCertifications();

  if (loading || certifications.length === 0) return null;

  return (
    <Section id="certifications">
      <Container>
        <SectionHeader>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
          >
            <SectionLabel>Certifications</SectionLabel>
            <SectionTitle>
              Des compétences <span>vérifiables</span>
            </SectionTitle>
            <SectionDesc variants={staggerItem}>
              Chaque certification renvoie vers sa page de vérification officielle chez l&apos;organisme
              émetteur.
            </SectionDesc>
          </motion.div>
        </SectionHeader>

        <Grid
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {certifications.map((certification) => {
            const issuedAt = formatIssuedAt(certification.issued_at);

            return (
              <Card key={certification.id} variants={staggerItem}>
                <BadgeFrame>
                  {certification.image_url ? (
                    <img
                      src={certification.image_url}
                      alt={`Badge ${certification.title} délivré par ${certification.issuer}`}
                      loading="lazy"
                    />
                  ) : (
                    <BadgeCheck size={34} strokeWidth={1.6} aria-hidden="true" />
                  )}
                </BadgeFrame>

                <CardBody>
                  <Title>{certification.title}</Title>
                  <Issuer>{certification.issuer}</Issuer>
                  {issuedAt && <IssuedAt>{issuedAt}</IssuedAt>}
                  {certification.description && (
                    <Description>{certification.description}</Description>
                  )}
                  {certification.credential_url && (
                    <VerifyLink
                      href={certification.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Vérifier la certification <ExternalLink size={13} />
                    </VerifyLink>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </Grid>
      </Container>
    </Section>
  );
}
