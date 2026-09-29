import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, BadgeCheck, ExternalLink, ShieldCheck } from 'lucide-react';
import styled from 'styled-components';
import { SEOHead } from '../components/layout/SEOHead';
import { SectionLabel, SectionTitle } from '../components/ui';
import { useCertifications } from '../hooks/useCertifications';
import { staggerContainer, staggerItem } from '../lib/animations';

const PageWrapper = styled.div`
  min-height: 100vh;
  padding-top: 100px;
`;

const PageHeader = styled.section`
  padding: 4rem 0 3rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -70px;
    right: 6%;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.sun};
    pointer-events: none;
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

const HeaderContent = styled(motion.div)`
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  position: relative;
  z-index: 1;
`;

const PageSubtitle = styled.p`
  font-size: 1.0625rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;

const StatsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.75rem;
  margin-top: 0.5rem;
`;

const Stat = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const FiltersBar = styled.div`
  padding: 1.5rem 0 2.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`;

const FilterChip = styled.button<{ $active: boolean }>`
  padding: 0.45rem 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.surfaceBorder)};
  background: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.bgCard)};
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.textSecondary)};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.accent)};
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding-bottom: 5rem;

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
  flex-direction: column;
  gap: 1rem;
  padding: 1.75rem;
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
  width: 112px;
  height: 112px;
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
    transform: scale(1.04) rotate(-2deg);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.1875rem;
  font-weight: 700;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MetaRow = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
`;

const Issuer = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
`;

const IssuedAt = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const Description = styled.p`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex: 1;
`;

const VerifyButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: fit-content;
  padding: 0.6rem 1.125rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: ${({ theme }) => theme.shadows.accent};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.accentStrong};
  }
`;

const EmptyState = styled(motion.div)`
  grid-column: 1 / -1;
  padding: 5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px dashed ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
`;

const SkeletonCard = styled.div`
  height: 320px;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.surface}, transparent);
    animation: shimmer 1.4s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
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

export default function CertificationsPage() {
  const { certifications, loading } = useCertifications();
  const [activeIssuer, setActiveIssuer] = useState('Tous');

  const issuers = useMemo(() => {
    const unique = Array.from(
      new Set(certifications.map((item) => item.issuer.trim()).filter(Boolean)),
    );
    return ['Tous', ...unique];
  }, [certifications]);

  const filtered = useMemo(
    () =>
      activeIssuer === 'Tous'
        ? certifications
        : certifications.filter((item) => item.issuer.trim() === activeIssuer),
    [certifications, activeIssuer],
  );

  return (
    <PageWrapper>
      <SEOHead
        title="Certifications"
        description="Certifications professionnelles obtenues, chacune accompagnée de son lien de vérification officiel."
      />

      <PageHeader>
        <Container>
          <HeaderContent initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <SectionLabel>Certifications</SectionLabel>
            <SectionTitle>
              Des compétences <span>vérifiables</span>
            </SectionTitle>
            <PageSubtitle>
              Chaque certification renvoie vers sa page de vérification chez l&apos;organisme
              émetteur : rien à croire sur parole.
            </PageSubtitle>
            {!loading && certifications.length > 0 && (
              <StatsRow>
                <Stat>
                  <Award size={15} />
                  {certifications.length} certification{certifications.length > 1 ? 's' : ''}
                </Stat>
                <Stat>
                  <ShieldCheck size={15} />
                  {issuers.length - 1} organisme{issuers.length - 1 > 1 ? 's' : ''} émetteur
                  {issuers.length - 1 > 1 ? 's' : ''}
                </Stat>
              </StatsRow>
            )}
          </HeaderContent>
        </Container>
      </PageHeader>

      <Container>
        {issuers.length > 2 && (
          <FiltersBar>
            {issuers.map((issuer) => (
              <FilterChip
                key={issuer}
                type="button"
                $active={activeIssuer === issuer}
                onClick={() => setActiveIssuer(issuer)}
              >
                {issuer}
              </FilterChip>
            ))}
          </FiltersBar>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <Grid key="skeleton">
              {[1, 2, 3].map((index) => (
                <SkeletonCard key={index} />
              ))}
            </Grid>
          ) : (
            <Grid
              key={activeIssuer}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              style={issuers.length > 2 ? undefined : { paddingTop: '2.5rem' }}
            >
              {filtered.length === 0 ? (
                <EmptyState initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Award size={40} strokeWidth={1} />
                  <p style={{ fontSize: '1rem' }}>Aucune certification à afficher pour le moment.</p>
                </EmptyState>
              ) : (
                filtered.map((certification) => {
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
                          <BadgeCheck size={44} strokeWidth={1.5} aria-hidden="true" />
                        )}
                      </BadgeFrame>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <CardTitle>{certification.title}</CardTitle>
                        <MetaRow>
                          <Issuer>{certification.issuer}</Issuer>
                          {issuedAt && <IssuedAt>{issuedAt}</IssuedAt>}
                        </MetaRow>
                      </div>

                      {certification.description && (
                        <Description>{certification.description}</Description>
                      )}

                      {certification.credential_url && (
                        <VerifyButton
                          href={certification.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Vérifier <ExternalLink size={14} />
                        </VerifyButton>
                      )}
                    </Card>
                  );
                })
              )}
            </Grid>
          )}
        </AnimatePresence>
      </Container>
    </PageWrapper>
  );
}
