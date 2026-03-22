import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Briefcase,
  ExternalLink,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Star,
  User,
  X,
  Zap,
} from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: 'Profil', icon: User },
  { to: '/admin/skills', label: 'Atouts', icon: Star },
  { to: '/admin/services', label: 'Services', icon: Briefcase },
  { to: '/admin/projects', label: 'Projets', icon: FolderOpen },
  { to: '/admin/blog', label: 'Blog', icon: FileText },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
] satisfies ReadonlyArray<{
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
}>;

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
`;

const Sidebar = styled(motion.aside)<{ $open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 240px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-right: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  display: flex;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
  transition: transform ${({ theme }) => theme.transitions.base};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    transform: translateX(0);
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem 1.25rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};

  span {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const SidebarClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface};
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const NavSection = styled.div`
  padding: 1rem 0.75rem;
  flex: 1;
  overflow-y: auto;
`;

const NavSectionLabel = styled.span`
  display: block;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;
  margin-top: 0.75rem;

  &:first-child {
    margin-top: 0;
  }
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  text-decoration: none;
  margin-bottom: 0.125rem;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surface};
  }

  &.active {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
    font-weight: 600;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: ${({ theme }) => theme.colors.accent};
      border-radius: 0 2px 2px 0;
    }
  }
`;

const NavItemLabel = styled.span`
  flex: 1;
`;

const UnreadBadge = styled.span`
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.6875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SidebarFooter = styled.div`
  padding: 1rem 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.625rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(124, 92, 252, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserEmail = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

const FooterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.625rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  background: none;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  width: 100%;
  text-align: left;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const DangerButton = styled(FooterButton)`
  &:hover {
    color: ${({ theme }) => theme.colors.danger};
    background: rgba(239, 68, 68, 0.08);
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 240px;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.raised};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const MobileMenuBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  flex-shrink: 0;
`;

const TopBarTitle = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  flex: 1;
`;

const PageContent = styled.div`
  flex: 1;
  padding: 2rem 1.5rem;
  max-width: 1100px;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 2.5rem;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: ${({ theme }) => theme.zIndex.sticky - 1};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

function getPageTitle(pathname: string): string {
  if (pathname === '/admin') return 'Dashboard';
  if (pathname.includes('/admin/profile')) return 'Profil';
  if (pathname.includes('/admin/skills')) return 'Atouts & Compétences';
  if (pathname.includes('/admin/services')) return 'Services';
  if (pathname.includes('/admin/projects/new')) return 'Nouveau projet';
  if (pathname.includes('/admin/projects') && pathname.includes('edit')) return 'Éditer le projet';
  if (pathname.includes('/admin/projects')) return 'Projets';
  if (pathname.includes('/admin/blog/new')) return 'Nouvel article';
  if (pathname.includes('/admin/blog') && pathname.includes('edit')) return "Éditer l'article";
  if (pathname.includes('/admin/blog')) return 'Blog';
  if (pathname.includes('/admin/messages')) return 'Messages';
  return 'Admin';
}

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;

    supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('read', false)
      .then(({ count }) => {
        if (active) {
          setUnreadCount(count ?? 0);
        }
      });

    return () => {
      active = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  const emailInitial = user?.email?.[0]?.toUpperCase() ?? 'A';
  const pageTitle = getPageTitle(location.pathname);

  return (
    <LayoutWrapper>
      <AnimatePresence>
        {sidebarOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar $open={sidebarOpen}>
        <SidebarHeader>
          <SidebarLogo>
            <Zap size={18} />
            <span>Portfolio</span> Admin
          </SidebarLogo>
          <SidebarClose type="button" onClick={() => setSidebarOpen(false)}>
            <X size={16} />
          </SidebarClose>
        </SidebarHeader>

        <NavSection>
          <NavSectionLabel>Navigation</NavSectionLabel>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={16} />
              <NavItemLabel>{item.label}</NavItemLabel>
              {item.label === 'Messages' && unreadCount > 0 && (
                <UnreadBadge>{unreadCount}</UnreadBadge>
              )}
            </NavItem>
          ))}
        </NavSection>

        <SidebarFooter>
          <UserRow>
            <UserAvatar>{emailInitial}</UserAvatar>
            <UserInfo>
              <UserEmail>{user?.email ?? 'admin'}</UserEmail>
              <UserRole>Administrateur</UserRole>
            </UserInfo>
          </UserRow>

          <FooterButton type="button" onClick={() => window.open('/', '_blank', 'noopener,noreferrer')}>
            <ExternalLink size={15} />
            Voir le portfolio
          </FooterButton>

          <DangerButton type="button" onClick={handleSignOut}>
            <LogOut size={15} />
            Se déconnecter
          </DangerButton>
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        <TopBar>
          <MobileMenuBtn type="button" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} />
          </MobileMenuBtn>
          <TopBarTitle>{pageTitle}</TopBarTitle>
        </TopBar>

        <PageContent>
          <Outlet />
        </PageContent>
      </MainContent>
    </LayoutWrapper>
  );
}
