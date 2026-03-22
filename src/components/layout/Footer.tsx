import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail, Zap } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../../hooks/useProfile';
import { useServices } from '../../hooks/useServices';
import { defaultViewport, fadeUp } from '../../lib/animations';

const FooterWrapper = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: ${({ theme }) => theme.colors.bgSecondary};
  padding: 4rem 0 2rem;
  margin-top: auto;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 2rem;
  }
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterLogo = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;

  span {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const FooterBio = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  max-width: 340px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
    transform: translateY(-2px);
  }
`;

const FooterCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterColTitle = styled.h4`
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FooterLinks = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const FooterRouteLink = styled(NavLink)`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const FooterHashLink = styled.button`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  text-align: left;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const FooterBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Copyright = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const AdminLink = styled(NavLink)`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export function Footer() {
  const { profile } = useProfile();
  const { services } = useServices();
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  const navigateToHash = (hashTarget: string) => {
    navigate(`/#${hashTarget}`);
  };

  return (
    <FooterWrapper>
      <FooterContainer>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <FooterTop>
            <FooterBrand>
              <FooterLogo to="/">
                <Zap size={16} />
                {profile?.full_name ?? ''}
                <span>.</span>
              </FooterLogo>
              <FooterBio>{profile?.title ?? ''}</FooterBio>
              <SocialLinks>
                {profile?.github_url && (
                  <SocialLink
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <Github size={16} />
                  </SocialLink>
                )}
                {profile?.linkedin_url && (
                  <SocialLink
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={16} />
                  </SocialLink>
                )}
                {profile?.email && (
                  <SocialLink href={`mailto:${profile.email}`} aria-label="Email">
                    <Mail size={16} />
                  </SocialLink>
                )}
              </SocialLinks>
            </FooterBrand>

            <FooterCol>
              <FooterColTitle>Navigation</FooterColTitle>
              <FooterLinks>
                <FooterRouteLink to="/projects">Projets</FooterRouteLink>
                <FooterRouteLink to="/blog">Blog</FooterRouteLink>
                <FooterHashLink onClick={() => navigateToHash('services')} type="button">
                  Services
                </FooterHashLink>
                <FooterHashLink onClick={() => navigateToHash('contact')} type="button">
                  Contact
                </FooterHashLink>
              </FooterLinks>
            </FooterCol>

            <FooterCol>
              <FooterColTitle>Services</FooterColTitle>
              <FooterLinks>
                {services.slice(0, 3).map((service) => (
                  <FooterHashLink
                    key={service.id}
                    onClick={() => navigateToHash('services')}
                    type="button"
                  >
                    {service.title}
                  </FooterHashLink>
                ))}
              </FooterLinks>
            </FooterCol>
          </FooterTop>

          <FooterBottom>
            <Copyright>
              © {year} {profile?.full_name ?? ''} - Tous droits reserves
            </Copyright>
            <AdminLink to="/admin">
              Admin <ArrowUpRight size={12} />
            </AdminLink>
          </FooterBottom>
        </motion.div>
      </FooterContainer>
    </FooterWrapper>
  );
}
