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
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    width: 900px;
    height: 600px;
    background: radial-gradient(
      ellipse at center,
      rgba(124,92,252,0.18) 0%,
      rgba(0,212,170,0.06) 40%,
      transparent 70%
    );
    filter: blur(60px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: linear-gradient(to bottom, transparent, ${({ theme }) => theme.colors.bg});
  }
`;

const GridLines = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(124,92,252,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(124,92,252,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%);
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
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 5rem 0 6rem;
`;

const ProfileCard = styled(motion.div)`
  width: 100%;
  max-width: 640px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 96px 1fr;
    align-items: center;
    text-align: left;
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
  margin-top: 0.15em;
  color: ${({ theme }) => theme.colors.accent};

  @supports ((-webkit-background-clip: text) or (background-clip: text)) {
    background-image: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.accent} 0%,
      ${({ theme }) => theme.colors.teal} 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
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
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: 0 0 30px ${({ theme }) => theme.colors.accentGlow};
    transform: translateY(-2px);
  }
`;

const SecondaryLinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  text-decoration: none;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  text-decoration: none;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-2px);
  }
`;

const StatsRow = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surfaceBorder};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  margin-top: 1rem;
  width: 100%;
  max-width: 600px;
`;

const StatItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1.25rem 2rem;
  background: ${({ theme }) => theme.colors.bgCard};
  flex: 1;
  min-width: 140px;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.03em;
  line-height: 1;

  span {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
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
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accent};
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

  return (
    <HeroWrapper>
      <HeroBackground style={{ y }} />
      <GridLines />

      <HeroContainer>
        <HeroContent style={{ opacity }} variants={staggerContainer} initial="hidden" animate="visible">
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
                  <MetaChip>
                    <MapPin size={14} />
                    {profile.location}
                  </MetaChip>
                )}
                {profile.email && (
                  <MetaChip>
                    <Mail size={14} />
                    {profile.email}
                  </MetaChip>
                )}
              </ProfileMeta>

              {profileLinks.length > 0 && (
                <ProfileLinks>
                  {profileLinks.map((item) => (
                    <ProfileLink
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <item.icon size={15} />
                      {item.label}
                    </ProfileLink>
                  ))}
                </ProfileLinks>
              )}
            </ProfileInfo>
          </ProfileCard>

          {skills.length > 0 && (
            <SkillsRow variants={staggerItem}>
              {skills.map((skill) => (
                <SkillChip key={skill.id} whileHover={{ scale: 1.04 }}>
                  {skill.label}
                </SkillChip>
              ))}
            </SkillsRow>
          )}

          <HeroCTAs variants={staggerItem}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <PrimaryButton to="/projects">
                Voir mes projets <ArrowRight size={18} />
              </PrimaryButton>
            </motion.div>

            {profile.cv_url ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <SecondaryLinkButton
                  href={profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
          </HeroCTAs>

          <StatsRow variants={staggerItem}>
            <StatItem whileHover={{ background: 'rgba(124,92,252,0.06)' }}>
              <StatValue>
                {stats.projects}
                <span>+</span>
              </StatValue>
              <StatLabel>
                <FolderOpen size={12} /> Projets livrés
              </StatLabel>
            </StatItem>

            <StatItem whileHover={{ background: 'rgba(124,92,252,0.06)' }}>
              <StatValue>{stats.domains}</StatValue>
              <StatLabel>
                <Layers size={12} /> Domaines actifs
              </StatLabel>
            </StatItem>

            <StatItem whileHover={{ background: 'rgba(124,92,252,0.06)' }}>
              <StatValue>
                <span style={{ fontSize: '1.25rem' }}>{stats.response_time}</span>
              </StatValue>
              <StatLabel>
                <Clock size={12} /> Temps de réponse
              </StatLabel>
            </StatItem>
          </StatsRow>
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
