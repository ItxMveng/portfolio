import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail, Zap } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../../hooks/useProfile';
import { useServices } from '../../hooks/useServices';
import { defaultViewport, fadeUp } from '../../lib/animations';

const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.bgTertiary};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  padding: 4rem 0 2rem;
  margin-top: auto;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) { padding: 0 2rem; }
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 2fr 1fr 1fr;
    gap: 4rem;
  }
`;

const FooterBrand = styled.div`
  display: flex; flex-direction: column; gap: 1rem;
`;

const FooterLogo = styled(NavLink)`
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-size: 1.0625rem; font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  transition: opacity 0.2s;

  .zap { color: ${({ theme }) => theme.colors.accent}; }
  span { color: ${({ theme }) => theme.colors.accent}; }
  &:hover { opacity: 0.85; }
`;

const FooterBio = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7; max-width: 320px;
`;

const SocialLinks = styled.div`
  display: flex; gap: 0.625rem; margin-top: 0.25rem;
`;

const SocialLink = styled.a`
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  color: ${({ theme }) => theme.colors.textSecondary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent}44;
    background: ${({ theme }) => theme.colors.accentDim};
    transform: translateY(-2px);
  }
`;

const FooterCol = styled.div`
  display: flex; flex-direction: column; gap: 1rem;
`;

const ColTitle = styled.h4`
  font-size: 0.78rem; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const LinksList = styled.nav`
  display: flex; flex-direction: column; gap: 0.55rem;
`;

const RouteLink = styled(NavLink)`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color ${({ theme }) => theme.transitions.fast};
  &:hover { color: ${({ theme }) => theme.colors.accent}; }
`;

const HashLink = styled.button`
  font-size: 0.9rem; text-align: left;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color ${({ theme }) => theme.transitions.fast};
  &:hover { color: ${({ theme }) => theme.colors.accent}; }
`;

const FooterBottom = styled.div`
  display: flex; flex-direction: column; gap: 0.75rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.divider};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row; align-items: center; justify-content: space-between;
  }
`;

const Copyright = styled.p`
  font-size: 0.85rem; color: ${({ theme }) => theme.colors.textMuted};
`;

const AdminLink = styled(NavLink)`
  font-size: 0.8rem; color: ${({ theme }) => theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};
  display: flex; align-items: center; gap: 0.25rem;
  &:hover { color: ${({ theme }) => theme.colors.textSecondary}; }
`;

export function Footer() {
  const { profile } = useProfile();
  const { services } = useServices();
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  const nav = (hash: string) => navigate(`/#${hash}`);

  return (
    <FooterWrapper>
      <Container>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={defaultViewport}>
          <FooterTop>
            <FooterBrand>
              <FooterLogo to="/">
                <Zap size={15} className="zap" />
                {profile?.full_name ?? ''}
                <span>.</span>
              </FooterLogo>
              <FooterBio>{profile?.title ?? ''}</FooterBio>
              <SocialLinks>
                {profile?.github_url && (
                  <SocialLink href={profile.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github size={15} />
                  </SocialLink>
                )}
                {profile?.linkedin_url && (
                  <SocialLink href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin size={15} />
                  </SocialLink>
                )}
                {profile?.email && (
                  <SocialLink href={`mailto:${profile.email}`} aria-label="Email">
                    <Mail size={15} />
                  </SocialLink>
                )}
              </SocialLinks>
            </FooterBrand>

            <FooterCol>
              <ColTitle>Navigation</ColTitle>
              <LinksList>
                <RouteLink to="/projects">Projets</RouteLink>
                <RouteLink to="/blog">Blog</RouteLink>
                <HashLink onClick={() => nav('services')} type="button">Services</HashLink>
                <HashLink onClick={() => nav('contact')} type="button">Contact</HashLink>
              </LinksList>
            </FooterCol>

            <FooterCol>
              <ColTitle>Services</ColTitle>
              <LinksList>
                {services.slice(0, 3).map((s) => (
                  <HashLink key={s.id} onClick={() => nav('services')} type="button">{s.title}</HashLink>
                ))}
              </LinksList>
            </FooterCol>
          </FooterTop>

          <FooterBottom>
            <Copyright>© {year} {profile?.full_name ?? ''} — Tous droits réservés</Copyright>
            <AdminLink to="/admin">Admin <ArrowUpRight size={11} /></AdminLink>
          </FooterBottom>
        </motion.div>
      </Container>
    </FooterWrapper>
  );
}
