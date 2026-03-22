import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useProfile } from '../../hooks/useProfile';

const NAV_LINKS = [
  { label: 'Services', to: '/#services' },
  { label: 'Projets', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/#contact' },
];

const NavWrapper = styled(motion.header)<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  transition: all ${({ theme }) => theme.transitions.slow};

  ${({ $scrolled, theme }) =>
    $scrolled
      ? css`
          background: rgba(10, 10, 15, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid ${theme.colors.surfaceBorder};
          padding: 0.75rem 0;
        `
      : css`
          background: transparent;
          padding: 1.5rem 0;
        `}
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 2rem;
  }
`;

const Logo = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  transition: color ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  span {
    color: ${({ theme }) => theme.colors.accent};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const DesktopNav = styled.nav`
  display: none;
  align-items: center;
  gap: 0.25rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const navLinkStyles = css<{ $active?: boolean }>`
  position: relative;
  padding: 0.5rem 0.875rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surface};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      &::after {
        content: '';
        position: absolute;
        bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: ${theme.colors.accent};
      }
    `}
`;

const DesktopRouteLink = styled(NavLink)<{ $active?: boolean }>`
  ${navLinkStyles}
`;

const DesktopHashLink = styled.button<{ $active?: boolean }>`
  ${navLinkStyles}
`;

const NavActions = styled.div`
  display: none;
  align-items: center;
  gap: 0.75rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const AvailabilityBadge = styled(motion.div)<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid;
  cursor: default;

  ${({ $status, theme }) => {
    if ($status === 'open') {
      return css`
        background: rgba(0, 212, 170, 0.08);
        color: ${theme.colors.teal};
        border-color: rgba(0, 212, 170, 0.2);
      `;
    }

    if ($status === 'busy') {
      return css`
        background: rgba(245, 158, 11, 0.08);
        color: ${theme.colors.warning};
        border-color: rgba(245, 158, 11, 0.2);
      `;
    }

    return css`
      background: rgba(239, 68, 68, 0.08);
      color: ${theme.colors.danger};
      border-color: rgba(239, 68, 68, 0.2);
    `;
  }}
`;

const PulseDot = styled(motion.span)<{ $status: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $status, theme }) =>
    $status === 'open'
      ? theme.colors.teal
      : $status === 'busy'
        ? theme.colors.warning
        : theme.colors.danger};
  flex-shrink: 0;
`;

const ContactButton = styled.button`
  padding: 0.5rem 1.25rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
    transform: translateY(-1px);
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-color: ${({ theme }) => theme.colors.accent};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.bg};
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  flex-direction: column;
  padding: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
`;

const MobileNavLinks = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const mobileItemStyles = css`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid transparent;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.surfaceBorder};
  }
`;

const MobileRouteLink = styled(NavLink)`
  ${mobileItemStyles}
`;

const MobileHashLink = styled.button`
  ${mobileItemStyles}
`;

const MobileNavItem = styled(motion.div)`
  display: flex;
`;

const MobileContactButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: 1.0625rem;
  font-weight: 600;
  margin-top: 1rem;
  cursor: pointer;
`;

const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const mobileItemVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' },
  }),
};

function getStatusLabel(status: string) {
  if (status === 'open') return 'Disponible';
  if (status === 'busy') return 'Occupe';
  return 'Indisponible';
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const firstName = profile?.full_name?.trim().split(/\s+/)[0] ?? '';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const status = profile?.status;

  const navigateToHash = (hashTarget: string) => {
    navigate(`/#${hashTarget}`);

    if (location.pathname === '/') {
      requestAnimationFrame(() => {
        document.getElementById(hashTarget)?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  };

  return (
    <>
      <NavWrapper
        $scrolled={scrolled}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <NavContainer>
          <Logo to="/">
            <Zap size={18} />
            {firstName}
            <span>.</span>
          </Logo>

          <DesktopNav>
            {NAV_LINKS.map((link) =>
              link.to.startsWith('/#') ? (
                <DesktopHashLink
                  key={link.label}
                  $active={location.pathname === '/'}
                  onClick={() => navigateToHash(link.to.replace('/#', ''))}
                  type="button"
                >
                  {link.label}
                </DesktopHashLink>
              ) : (
                <DesktopRouteLink
                  key={link.label}
                  to={link.to}
                  $active={location.pathname.startsWith(link.to)}
                >
                  {link.label}
                </DesktopRouteLink>
              ),
            )}
          </DesktopNav>

          <NavActions>
            {status && (
              <AvailabilityBadge
                $status={status}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <PulseDot
                  $status={status}
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {getStatusLabel(status)}
              </AvailabilityBadge>
            )}

            <ContactButton onClick={() => navigateToHash('contact')} type="button">
              Me contacter
            </ContactButton>
          </NavActions>

          <MobileMenuButton
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            type="button"
          >
            <Menu size={20} />
          </MobileMenuButton>
        </NavContainer>
      </NavWrapper>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <MobileMenuHeader>
              <Logo to="/" onClick={() => setMobileOpen(false)}>
                <Zap size={18} />
                {firstName}
                <span>.</span>
              </Logo>
              <MobileMenuButton
                onClick={() => setMobileOpen(false)}
                aria-label="Fermer le menu"
                type="button"
              >
                <X size={20} />
              </MobileMenuButton>
            </MobileMenuHeader>

            <MobileNavLinks>
              {NAV_LINKS.map((link, i) => (
                <MobileNavItem
                  key={link.label}
                  custom={i}
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {link.to.startsWith('/#') ? (
                    <MobileHashLink
                      onClick={() => {
                        setMobileOpen(false);
                        navigateToHash(link.to.replace('/#', ''));
                      }}
                      type="button"
                    >
                      {link.label}
                    </MobileHashLink>
                  ) : (
                    <MobileRouteLink to={link.to} onClick={() => setMobileOpen(false)}>
                      {link.label}
                    </MobileRouteLink>
                  )}
                </MobileNavItem>
              ))}
            </MobileNavLinks>

            {status && (
              <AvailabilityBadge $status={status} style={{ alignSelf: 'flex-start' }}>
                <PulseDot
                  $status={status}
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {getStatusLabel(status)}
              </AvailabilityBadge>
            )}

            <MobileContactButton
              onClick={() => {
                setMobileOpen(false);
                navigateToHash('contact');
              }}
              type="button"
              whileTap={{ scale: 0.97 }}
            >
              Me contacter
            </MobileContactButton>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
}
