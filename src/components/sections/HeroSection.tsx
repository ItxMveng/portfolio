import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Variants } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  Download,
  FolderOpen,
  Github,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Globe,
} from 'lucide-react';
import styled from 'styled-components';
import { useProfile } from '../../hooks/useProfile';
import { useSkills } from '../../hooks/useSkills';
import { staggerContainer, staggerItem } from '../../lib/animations';

const HeroWrapper = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-top: 80px;
`;

const HeroBackground = styled(motion.div)`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    top: -10%;
    right: -5%;
    width: 700px;
    height: 700px;
    background: radial-gradient(
      ellipse at center,
      rgba(249,115,22,0.12) 0%,
      rgba(56,189,248,0.05) 45%,
      transparent 70%
    );
    filter: blur(70px);
    animation: orbeFloat 12s ease-in-out infinite alternate;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 280px;
    background: linear-gradient(to bottom, transparent, ${({ theme }) => theme.colors.bg});
  }

  @keyframes orbeFloat {
    0%   { transform: translate(0, 0) scale(1); }
    50%  { transform: translate(-40px, 30px) scale(1.08); }
    100% { transform: translate(20px, -20px) scale(0.95); }
  }
`;

const GridLines = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(249,115,22,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 90% 70% at 60% 40%, black 10%, transparent 75%);
  pointer-events: none;
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

const HeroContent = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 4.5rem 0 5.5rem;
  text-align: center;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 420px;
    text-align: left;
    gap: 5rem;
    padding: 5rem 0 6rem;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    align-items: flex-start;
  }
`;

const HeroRight = styled.div`
  display: none;
  flex-direction: column;
  gap: 1.25rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
  }
`;

const OrbCard = styled(motion.div)`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OrbOuter = styled(motion.div)`
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    rgba(249,115,22,0.7),
    rgba(56,189,248,0.6),
    rgba(34,211,238,0.5),
    rgba(249,115,22,0.3),
    rgba(56,189,248,0.7),
    rgba(249,115,22,0.7)
  );
  filter: blur(2px);
  animation: orbSpin 10s linear infinite;
  position: absolute;

  @keyframes orbSpin {
    0%   { transform: rotate(0deg) scale(1); }
    50%  { transform: rotate(180deg) scale(1.05); }
    100% { transform: rotate(360deg) scale(1); }
  }
`;

const OrbInner = styled.div`
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at 35% 35%,
    rgba(249,115,22,0.25) 0%,
    rgba(56,189,248,0.12) 40%,
    ${({ theme }) => theme.colors.bgCard} 65%
  );
  border: 1px solid rgba(249,115,22,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  box-shadow:
    0 0 60px rgba(249,115,22,0.15),
    0 0 120px rgba(56,189,248,0.08),
    inset 0 1px 0 rgba(255,255,255,0.06);
`;

const OrbInitials = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.blue});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FloatBadge = styled(motion.div)`
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.9rem;
  background: rgba(7, 8, 15, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
`;

const SideCard = styled(motion.div)`
  background: rgba(17,25,39,0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(249,115,22,0.12);
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
`;

const SideCardLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SideCardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.03em;
  span { color: ${({ theme }) => theme.colors.accent}; }
`;

const ProfileCard = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(17,25,39,0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(249,115,22,0.15);
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 96px 1fr;
    align-items: center;
    text-align: left;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const AvatarWrap = styled.div`
  width: 96px;
  height: 96px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 2px solid ${({ theme }) => theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const ProfileMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: flex-start;
  }
`;

const MetaChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8125rem;
  line-height: 1;
`;

const ProfileLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: flex-start;
  }
`;

const ProfileLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.85rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
  }
`;

const StatusBadge = styled(motion.div)<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem 0.4rem 0.6rem;
  background: ${({ $status }) =>
    $status === 'open'
      ? 'rgba(0,212,170,0.06)'
      : $status === 'busy'
        ? 'rgba(245,158,11,0.06)'
        : 'rgba(239,68,68,0.06)'};
  border: 1px solid
    ${({ $status }) =>
      $status === 'open'
        ? 'rgba(0,212,170,0.2)'
        : $status === 'busy'
          ? 'rgba(245,158,11,0.2)'
          : 'rgba(239,68,68,0.2)'};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ $status, theme }) =>
    $status === 'open'
      ? theme.colors.teal
      : $status === 'busy'
        ? theme.colors.warning
        : theme.colors.danger};
  cursor: default;
`;

const PulseDot = styled(motion.span)<{ $status: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $status, theme }) =>
    $status === 'open'
      ? theme.colors.teal
      : $status === 'busy'
        ? theme.colors.warning
        : theme.colors.danger};
  flex-shrink: 0;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const GradientLine = styled(motion.span)`
  display: block;
  margin-top: 0.1em;
  background-image: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent} 0%,
    #FBBF24 40%,
    ${({ theme }) => theme.colors.blue} 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: gradientFlow 5s linear infinite;

  @keyframes gradientFlow {
    0%   { background-position: 0% center; }
    100% { background-position: 200% center; }
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  max-width: 600px;
`;

const HeroCTAs = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 0.5rem;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, #FBBF24);
  color: #fff;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(249,115,22,0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #FBBF24, ${({ theme }) => theme.colors.accent});
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 36px rgba(249,115,22,0.45);
    &::before { opacity: 1; }
  }

  span { position: relative; z-index: 1; display: contents; }
`;

const SecondaryLinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: rgba(255,255,255,0.04);
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  text-decoration: none;
  backdrop-filter: blur(10px);

  &:hover {
    border-color: rgba(249,115,22,0.4);
    color: ${({ theme }) => theme.colors.accent};
    background: rgba(249,115,22,0.06);
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: rgba(255,255,255,0.04);
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  backdrop-filter: blur(10px);

  &:hover {
    border-color: rgba(249,115,22,0.4);
    color: ${({ theme }) => theme.colors.accent};
    background: rgba(249,115,22,0.06);
    transform: translateY(-2px);
  }
`;

const StatsRow = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(249,115,22,0.12);
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  margin-top: 0.5rem;
  width: 100%;
  max-width: 560px;
  backdrop-filter: blur(12px);

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: 480px;
    justify-content: flex-start;
  }
`;

const StatItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1.1rem 1.75rem;
  background: rgba(17,25,39,0.5);
  flex: 1;
  min-width: 120px;
  transition: background 0.2s;

  &:hover {
    background: rgba(249,115,22,0.06);
  }
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.04em;
  line-height: 1;
  font-variant-numeric: tabular-nums;

  span { color: ${({ theme }) => theme.colors.accent}; }
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const SkillsRow = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
  max-width: 700px;
`;

const SkillChip = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.875rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
  cursor: default;

  &:hover {
    border-color: rgba(249,115,22,0.35);
    color: ${({ theme }) => theme.colors.accent};
    background: rgba(249,115,22,0.07);
    transform: translateY(-1px);
  }

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.blue});
    flex-shrink: 0;
  }
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  z-index: 1;
`;

const ScrollLine = styled(motion.div)`
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, ${({ theme }) => theme.colors.accent}, transparent);
`;

const HeroCTAsLeft = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 0.25rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-content: flex-start;
  }
`;

const SkillsRowLeft = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-content: flex-start;
  }
  max-width: 560px;
`;

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: index * 0.08,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

function AnimatedWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ').filter(Boolean);

  return (
    <span>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          custom={index}
          variants={wordVariants}
          className={className}
          style={{ display: 'inline-block', marginRight: '0.3em' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

function getStatusLabel(status: string) {
  if (status === 'open') return 'Disponible pour missions & CDI';
  if (status === 'busy') return 'Partiellement disponible';
  return 'Actuellement indisponible';
}

export function HeroSection() {
  const { profile, loading } = useProfile();
  const { skills } = useSkills();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.25], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.75]);

  if (loading || !profile) {
    return null;
  }

  const status = profile.status ?? 'closed';
  const stats = profile.stats ?? { projects: 0, domains: 0, response_time: '' };
  const titleHighlight =
    profile.title.split('—')[1]?.trim() ||
    profile.title.split('-')[1]?.trim() ||
    profile.title;
  const profileLinks = [
    profile.github_url
      ? { href: profile.github_url, label: 'GitHub', icon: Github }
      : null,
    profile.linkedin_url
      ? { href: profile.linkedin_url, label: 'LinkedIn', icon: Linkedin }
      : null,
    profile.website_url
      ? { href: profile.website_url, label: 'Site', icon: Globe }
      : null,
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon: typeof Github;
  }>;

  const initials = (profile.full_name ?? '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <HeroWrapper>
      <HeroBackground style={{ y }} />
      <GridLines />

      <HeroContainer>
        <HeroContent style={{ opacity }} variants={staggerContainer} initial="hidden" animate="visible">

          {/* ── Colonne gauche ── */}
          <HeroLeft>
            <StatusBadge $status={status} variants={staggerItem} whileHover={{ scale: 1.03 }}>
              <PulseDot
                $status={status}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {getStatusLabel(status)}
            </StatusBadge>

            <HeroTitle variants={staggerContainer} initial="hidden" animate="visible">
              <AnimatedWords text={profile.full_name ?? ''} />
              {profile.title && (
                <>
                  <br />
                  <GradientLine variants={staggerItem}>{titleHighlight}</GradientLine>
                </>
              )}
            </HeroTitle>

            <HeroSubtitle variants={staggerItem}>{profile.bio ?? ''}</HeroSubtitle>

            {skills.length > 0 && (
              <SkillsRowLeft variants={staggerItem}>
                {skills.map((skill) => (
                  <SkillChip key={skill.id} whileHover={{ scale: 1.04 }}>
                    {skill.label}
                  </SkillChip>
                ))}
              </SkillsRowLeft>
            )}

            <HeroCTAsLeft variants={staggerItem}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <PrimaryButton to="/projects">
                  Voir mes projets <ArrowRight size={18} />
                </PrimaryButton>
              </motion.div>

              {profile.cv_url ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SecondaryLinkButton href={profile.cv_url} target="_blank" rel="noopener noreferrer">
                    <Download size={18} /> Télécharger le CV
                  </SecondaryLinkButton>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SecondaryButton
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    type="button"
                  >
                    Me contacter <ArrowRight size={18} />
                  </SecondaryButton>
                </motion.div>
              )}
            </HeroCTAsLeft>

            <StatsRow variants={staggerItem}>
              <StatItem>
                <StatValue>{stats.projects}<span>+</span></StatValue>
                <StatLabel><FolderOpen size={12} /> Projets livrés</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stats.domains}</StatValue>
                <StatLabel><Layers size={12} /> Domaines</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue><span style={{ fontSize: '1.1rem' }}>{stats.response_time}</span></StatValue>
                <StatLabel><Clock size={12} /> Réponse</StatLabel>
              </StatItem>
            </StatsRow>
          </HeroLeft>

          {/* ── Colonne droite — visible desktop seulement ── */}
          <HeroRight>
            <OrbCard
              variants={staggerItem}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <OrbOuter />
              <OrbInner>
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || ''}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  <OrbInitials>{initials}</OrbInitials>
                )}
              </OrbInner>

              {/* Badges flottants */}
              <FloatBadge
                style={{ top: '8%', right: '-8%' }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <span style={{ color: '#22D3EE', fontSize: '0.85rem' }}>●</span>
                Disponible
              </FloatBadge>

              <FloatBadge
                style={{ bottom: '12%', left: '-6%' }}
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <span style={{ fontSize: '0.9rem' }}>⚡</span>
                Full-stack
              </FloatBadge>
            </OrbCard>

            {/* Carte profil condensée */}
            <SideCard variants={staggerItem}>
              <SideCardLabel>Localisation</SideCardLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} style={{ color: '#F97316', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: '#EFF4FF' }}>{profile.location ?? '—'}</span>
              </div>
            </SideCard>

            <SideCard variants={staggerItem}>
              <SideCardLabel>Contact direct</SideCardLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {profileLinks.map((item) => (
                  <ProfileLink key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                    <item.icon size={14} />
                    {item.label}
                  </ProfileLink>
                ))}
              </div>
            </SideCard>
          </HeroRight>

          {/* Profile card mobile (masquée desktop) */}
          <ProfileCard variants={staggerItem}>
            <AvatarWrap>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name || 'Photo de profil'} />
              ) : (
                profile.full_name?.[0] ?? ''
              )}
            </AvatarWrap>
            <ProfileInfo>
              <ProfileMeta>
                {profile.location && (
                  <MetaChip><MapPin size={14} />{profile.location}</MetaChip>
                )}
                {profile.email && (
                  <MetaChip><Mail size={14} />{profile.email}</MetaChip>
                )}
              </ProfileMeta>
              {profileLinks.length > 0 && (
                <ProfileLinks>
                  {profileLinks.map((item) => (
                    <ProfileLink key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                      <item.icon size={15} />{item.label}
                    </ProfileLink>
                  ))}
                </ProfileLinks>
              )}
            </ProfileInfo>
          </ProfileCard>

        </HeroContent>
      </HeroContainer>

      <ScrollIndicator initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <ScrollLine
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        Scroll
      </ScrollIndicator>
    </HeroWrapper>
  );
}
