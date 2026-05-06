import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Variants } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Globe,
  Zap,
} from 'lucide-react';
import styled from 'styled-components';
import { useProfile } from '../../hooks/useProfile';
import { useSkills } from '../../hooks/useSkills';
import { staggerContainer, staggerItem } from '../../lib/animations';

/* ── Layout ── */
const HeroWrapper = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-top: 72px;
  background: ${({ theme }) => theme.colors.bg};
`;

/* ── Blobs d'arrière-plan ── */
const BlobGreen = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  top: -10%;
  right: -8%;
  border-radius: 50%;
  background: radial-gradient(circle, ${({ theme }) => theme.colors.accentDim} 0%, transparent 70%);
  filter: blur(90px);
  pointer-events: none;
  animation: blobFloat 14s ease-in-out infinite;
  opacity: ${({ theme }) => theme.isDark ? 0.9 : 0.7};
`;

const BlobBlue = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  bottom: 5%;
  left: -5%;
  border-radius: 50%;
  background: radial-gradient(circle, ${({ theme }) => theme.colors.blueDim} 0%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
  animation: blobFloat 18s ease-in-out infinite reverse;
  opacity: ${({ theme }) => theme.isDark ? 0.8 : 0.6};
`;

/* Grille légère */
const GridLines = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(${({ theme }) => theme.colors.divider} 1px, transparent 1px),
    linear-gradient(90deg, ${({ theme }) => theme.colors.divider} 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 80% 65% at 55% 35%, black 0%, transparent 75%);
  pointer-events: none;
`;

/* Trait vertical décoratif */
const VerticalAccent = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    ${({ theme }) => theme.colors.accent} 30%,
    ${({ theme }) => theme.colors.teal} 70%,
    transparent 100%
  );
  opacity: 0.35;
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const HeroContainer = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 2rem;
  }
`;

const HeroGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 3rem 0 4rem;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 380px;
    gap: 4rem;
    padding: 3.5rem 0 4.5rem;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  order: 2;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 1;
  }
`;

/* ── Badge disponibilité ── */
const StatusBadge = styled(motion.div)<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.9rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid;
  cursor: default;
  background: ${({ $status, theme }) =>
    $status === 'open'
      ? theme.colors.accentDim
      : $status === 'busy'
        ? 'rgba(217,119,6,0.08)'
        : 'rgba(220,38,38,0.08)'};
  color: ${({ $status, theme }) =>
    $status === 'open'
      ? theme.colors.accent
      : $status === 'busy'
        ? theme.colors.warning
        : theme.colors.danger};
  border-color: ${({ $status, theme }) =>
    $status === 'open'
      ? theme.colors.accent + '44'
      : $status === 'busy'
        ? 'rgba(217,119,6,0.25)'
        : 'rgba(220,38,38,0.25)'};
`;

const PulseDot = styled(motion.span)<{ $status: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $status, theme }) =>
    $status === 'open'
      ? theme.colors.accent
      : $status === 'busy'
        ? theme.colors.warning
        : theme.colors.danger};
`;

/* ── Titre principal ── */
const HeroTitle = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const AccentLine = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  display: block;
`;

/* ── Sous-titre ── */
const HeroSub = styled(motion.p)`
  font-size: clamp(0.9375rem, 2vw, 1.0625rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  max-width: 520px;
`;

/* ── Badges de compétences ── */
const SkillBadges = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.875rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.8125rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  color: ${({ theme }) => theme.colors.textPrimary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: default;

  svg { color: ${({ theme }) => theme.colors.accent}; }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent}55;
    background: ${({ theme }) => theme.colors.accentDim};
    color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.accent};
    transform: translateY(-2px);
  }
`;

/* ── CTAs ── */
const CTARow = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
  align-items: center;
`;

const PrimaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.accent};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: ${({ theme }) => theme.shadows.accentStrong};
    transform: translateY(-2px) scale(1.02);
  }
  &:active { transform: translateY(0) scale(0.99); }
`;

const SecondaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1.5px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.9375rem;
  font-weight: 600;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
    transform: translateY(-2px) scale(1.02);
  }
  &:active { transform: translateY(0) scale(0.99); }
`;

const SecondaryLinkBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1.5px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
    transform: translateY(-2px) scale(1.02);
  }
`;

/* ── Stats ── */
const StatsRow = styled(motion.div)`
  display: flex;
  gap: 0;
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgCard};
  box-shadow: ${({ theme }) => theme.shadows.card};
  max-width: 400px;
  width: 100%;
`;

const StatItem = styled.div`
  flex: 1;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  border-right: 1px solid ${({ theme }) => theme.colors.divider};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:last-child { border-right: none; }
  &:hover { background: ${({ theme }) => theme.colors.accentDim}; }
`;

const StatVal = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.04em;
  line-height: 1;

  span { color: ${({ theme }) => theme.colors.accent}; }
`;

const StatLab = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

/* ── Colonne droite ── */
const HeroRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  order: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    align-items: flex-start;
    order: 2;
  }
`;

/* Carte profil */
const ProfileCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.25rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  width: 220px;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 1.5rem;
    gap: 1.25rem;
    width: auto;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(to right, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.teal});
  }
`;

/* Orb avatar */
const OrbWrap = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
  height: 90px;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: 110px;
  }
`;

const OrbOuter = styled(motion.div)`
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    ${({ theme }) => theme.colors.accent},
    ${({ theme }) => theme.colors.teal},
    ${({ theme }) => theme.colors.blue},
    ${({ theme }) => theme.colors.accent}
  );
  filter: blur(1px);
  animation: orbSpin 8s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 100px;
    height: 100px;
  }

  @keyframes orbSpin {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to   { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const OrbInner = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1.5px solid ${({ theme }) => theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 86px;
    height: 86px;
    font-size: 1.75rem;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileName = styled.div`
  text-align: center;
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
`;

const ProfileRole = styled.div`
  text-align: center;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProfileLinks = styled.div`
  display: none;
  flex-direction: column;
  gap: 0.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
  }
`;

const ProfileLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  svg { color: ${({ theme }) => theme.colors.accent}; flex-shrink: 0; }

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-color: ${({ theme }) => theme.colors.accent}44;
    background: ${({ theme }) => theme.colors.accentDim};
    transform: translateX(3px);
  }
`;

/* Carte localisation */
const InfoCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 0.875rem 1rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: none;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
  }

  svg { color: ${({ theme }) => theme.colors.accent}; flex-shrink: 0; }
`;

/* ── Scroll indicator ── */
const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  z-index: 1;
`;

const ScrollLine = styled(motion.div)`
  width: 1px;
  height: 32px;
  background: linear-gradient(to bottom, ${({ theme }) => theme.colors.accent}, transparent);
  transform-origin: top;
`;

/* ── Animations ── */
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function AnimatedTitle({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          custom={i}
          variants={wordVariants}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}

function getStatusLabel(s: string) {
  if (s === 'open') return 'Disponible';
  if (s === 'busy') return 'Partiellement dispo';
  return 'Indisponible';
}

const SPECIALTY_BADGES = [
  { label: 'Full Stack', icon: Zap },
  { label: 'IA & Agents', icon: Bot },
  { label: 'Automatisation', icon: ArrowRight },
];

export function HeroSection() {
  const { profile, loading } = useProfile();
  const { skills } = useSkills();
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 0.3], ['0%', '20%']);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  if (loading || !profile) return null;

  const status = profile.status ?? 'closed';
  const stats = profile.stats ?? { projects: 0, domains: 0, response_time: '' };
  const profileLinks = [
    profile.github_url ? { href: profile.github_url, label: 'GitHub', icon: Github } : null,
    profile.linkedin_url ? { href: profile.linkedin_url, label: 'LinkedIn', icon: Linkedin } : null,
    profile.email ? { href: `mailto:${profile.email}`, label: profile.email, icon: Mail } : null,
    profile.website_url ? { href: profile.website_url, label: 'Site web', icon: Globe } : null,
  ].filter(Boolean) as Array<{ href: string; label: string; icon: typeof Github }>;

  const initials = (profile.full_name ?? '')
    .split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <HeroWrapper>
      <BlobGreen />
      <BlobBlue />
      <GridLines />
      <VerticalAccent />

      <HeroContainer>
        <HeroGrid
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ y: parallaxY }}
        >
          {/* ── Gauche ── */}
          <HeroLeft>
            <StatusBadge
              $status={status}
              variants={staggerItem}
              whileHover={{ scale: 1.04 }}
            >
              <PulseDot
                $status={status}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {getStatusLabel(status)}
            </StatusBadge>

            <HeroTitle
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <AnimatedTitle text={profile.full_name ?? ''} />
              <AccentLine>
                <motion.span variants={staggerItem} custom={3} style={{ display: 'block' }}>
                  Full Stack Developer
                </motion.span>
              </AccentLine>
            </HeroTitle>

            <HeroSub variants={staggerItem}>
              Je conçois des applications modernes, intelligentes et automatisées — de l&apos;interface utilisateur jusqu&apos;à l&apos;intégration IA.
            </HeroSub>

            <SkillBadges variants={staggerItem}>
              {SPECIALTY_BADGES.map(({ label, icon: Icon }) => (
                <SkillBadge key={label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Icon size={13} />
                  {label}
                </SkillBadge>
              ))}
              {skills.slice(0, 4).map((s) => (
                <SkillBadge key={s.id} whileHover={{ scale: 1.05 }}>
                  {s.label}
                </SkillBadge>
              ))}
            </SkillBadges>

            <CTARow variants={staggerItem}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <PrimaryBtn to="/projects">
                  Voir mes projets <ArrowRight size={16} />
                </PrimaryBtn>
              </motion.div>
              {profile.cv_url ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <SecondaryLinkBtn href={profile.cv_url} target="_blank" rel="noopener noreferrer">
                    <Download size={16} /> Télécharger CV
                  </SecondaryLinkBtn>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <SecondaryBtn
                    type="button"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Me contacter <ArrowRight size={16} />
                  </SecondaryBtn>
                </motion.div>
              )}
            </CTARow>

            <StatsRow variants={staggerItem}>
              <StatItem>
                <StatVal>{stats.projects}<span>+</span></StatVal>
                <StatLab>Projets</StatLab>
              </StatItem>
              <StatItem>
                <StatVal>{stats.domains}</StatVal>
                <StatLab>Domaines</StatLab>
              </StatItem>
              <StatItem>
                <StatVal><span style={{ fontSize: '0.9rem' }}>{stats.response_time || '24h'}</span></StatVal>
                <StatLab>Réponse</StatLab>
              </StatItem>
            </StatsRow>
          </HeroLeft>

          {/* ── Droite ── */}
          <HeroRight>
            <ProfileCard
              variants={staggerItem}
              whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
            >
              <OrbWrap>
                <OrbOuter />
                <OrbInner>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name || ''} />
                  ) : (
                    initials
                  )}
                </OrbInner>
              </OrbWrap>

              <div>
                <ProfileName>{profile.full_name}</ProfileName>
                <ProfileRole>{profile.title || 'Full Stack Developer · IA & Automatisation'}</ProfileRole>
              </div>

              {profileLinks.length > 0 && (
                <ProfileLinks>
                  {profileLinks.slice(0, 3).map((item) => (
                    <ProfileLink key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                      <item.icon size={14} />
                      {item.label}
                    </ProfileLink>
                  ))}
                </ProfileLinks>
              )}
            </ProfileCard>

            {profile.location && (
              <InfoCard
                variants={staggerItem}
                whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              >
                <MapPin size={15} />
                <span>{profile.location}</span>
              </InfoCard>
            )}
          </HeroRight>
        </HeroGrid>
      </HeroContainer>

      <ScrollIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <ScrollLine
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        scroll
      </ScrollIndicator>
    </HeroWrapper>
  );
}
