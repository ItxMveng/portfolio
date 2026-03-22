import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  FolderOpen,
  MessageSquare,
  Plus,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { staggerContainer, staggerItem } from '../../lib/animations';
import type { Message } from '../../types';

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  margin-bottom: 0.375rem;
`;

const PageSubtitle = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    border-color: rgba(124, 92, 252, 0.3);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

const StatTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`;

const StatIconWrap = styled.div<{ $color: string }>`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $color }) => `${$color}18`};
  border: 1px solid ${({ $color }) => `${$color}30`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.03em;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatTrend = styled.div<{ $positive: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $positive, theme }) => ($positive ? theme.colors.teal : theme.colors.textMuted)};
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1.5fr 1fr;
  }
`;

const Panel = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.125rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

const PanelTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CountBadge = styled.span`
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.1rem 0.5rem;
`;

const PanelLink = styled(Link)`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: gap ${({ theme }) => theme.transitions.fast};

  &:hover {
    gap: 0.4rem;
  }
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
`;

const MessageRow = styled.div<{ $unread: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: ${({ $unread }) => ($unread ? 'rgba(124,92,252,0.03)' : 'transparent')};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const MessageAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(124, 92, 252, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const MessageTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.2rem;
`;

const MessageName = styled.span<{ $unread: boolean }>`
  font-size: 0.875rem;
  font-weight: ${({ $unread }) => ($unread ? 600 : 500)};
  color: ${({ $unread, theme }) => ($unread ? theme.colors.textPrimary : theme.colors.textSecondary)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessageDate = styled.span`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
  flex-shrink: 0;
`;

const MessagePreview = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnreadDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
  margin-top: 5px;
`;

const EmptyPanel = styled.div`
  padding: 3rem 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
`;

const QuickActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
`;

const QuickAction = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: none;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }

  svg:last-child {
    margin-left: auto;
  }
`;

const QuickActionIcon = styled.div<{ $color: string }>`
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ $color }) => `${$color}18`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const InlineBadge = styled.span`
  margin-left: auto;
  background: rgba(245, 158, 11, 0.12);
  color: ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.1rem 0.5rem;
`;

interface DashboardStats {
  projects: number;
  posts: number;
  messages: number;
  unread: number;
  totalViews: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    posts: 0,
    messages: 0,
    unread: 0,
    totalViews: 0,
  });
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      const [
        { count: projectsCount },
        { count: postsCount },
        { count: messagesCount },
        { count: unreadCount },
        { data: viewsData },
        { data: messages },
      ] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }).eq('read', false),
        supabase.from('blog_posts').select('views').eq('published', true),
        supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      if (!active) {
        return;
      }

      const totalViews = (viewsData ?? []).reduce(
        (sum, post) => sum + ((post as { views?: number }).views ?? 0),
        0
      );

      setStats({
        projects: projectsCount ?? 0,
        posts: postsCount ?? 0,
        messages: messagesCount ?? 0,
        unread: unreadCount ?? 0,
        totalViews,
      });
      setRecentMessages((messages as Message[]) ?? []);
      setLoading(false);
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const statCards = [
    {
      label: 'Projets publiés',
      value: stats.projects,
      icon: FolderOpen,
      color: '#7c5cfc',
      trend: 'En ligne',
    },
    {
      label: 'Articles publiés',
      value: stats.posts,
      icon: FileText,
      color: '#00d4aa',
      trend: 'Actifs',
    },
    {
      label: 'Messages reçus',
      value: stats.messages,
      icon: MessageSquare,
      color: '#f59e0b',
      trend: `${stats.unread} non lus`,
    },
    {
      label: 'Vues blog',
      value: stats.totalViews,
      icon: Eye,
      color: '#3b82f6',
      trend: 'Total cumulé',
    },
  ] as const;

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Bonjour' : now.getHours() < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={staggerItem}>
        <PageHeader>
          <PageTitle>{greeting} 👋</PageTitle>
          <PageSubtitle>
            Vue d&apos;ensemble de votre portfolio —{' '}
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </PageSubtitle>
        </PageHeader>
      </motion.div>

      <motion.div variants={staggerItem}>
        <StatsGrid variants={staggerContainer} initial="hidden" animate="visible">
          {statCards.map((card) => (
            <StatCard key={card.label} variants={staggerItem}>
              <StatTop>
                <StatIconWrap $color={card.color}>
                  <card.icon size={17} />
                </StatIconWrap>
                <StatTrend $positive>
                  <TrendingUp size={11} />
                  {card.trend}
                </StatTrend>
              </StatTop>
              <div>
                <StatValue>{loading ? '—' : card.value.toLocaleString('fr-FR')}</StatValue>
                <StatLabel>{card.label}</StatLabel>
              </div>
            </StatCard>
          ))}
        </StatsGrid>
      </motion.div>

      <motion.div variants={staggerItem}>
        <ContentGrid>
          <Panel variants={staggerItem}>
            <PanelHeader>
              <PanelTitle>
                <MessageSquare size={15} />
                Messages récents
                {stats.unread > 0 && <CountBadge>{stats.unread}</CountBadge>}
              </PanelTitle>
              <PanelLink to="/admin/messages">
                Tous <ArrowUpRight size={13} />
              </PanelLink>
            </PanelHeader>

            <MessageList>
              {loading ? (
                <EmptyPanel>Chargement...</EmptyPanel>
              ) : recentMessages.length === 0 ? (
                <EmptyPanel>
                  <CheckCircle size={24} strokeWidth={1} style={{ margin: '0 auto 0.5rem' }} />
                  Aucun message pour l&apos;instant
                </EmptyPanel>
              ) : (
                recentMessages.map((message) => (
                  <MessageRow key={message.id} $unread={!message.read}>
                    {!message.read && <UnreadDot />}
                    <MessageAvatar>{message.name[0]?.toUpperCase()}</MessageAvatar>
                    <MessageContent>
                      <MessageTop>
                        <MessageName $unread={!message.read}>{message.name}</MessageName>
                        <MessageDate>
                          {new Date(message.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </MessageDate>
                      </MessageTop>
                      <MessagePreview>{message.message}</MessagePreview>
                    </MessageContent>
                  </MessageRow>
                ))
              )}
            </MessageList>
          </Panel>

          <Panel variants={staggerItem}>
            <PanelHeader>
              <PanelTitle>
                <Zap size={15} /> Actions rapides
              </PanelTitle>
            </PanelHeader>
            <QuickActions>
              <QuickAction to="/admin/projects/new">
                <QuickActionIcon $color="#7c5cfc">
                  <Plus size={15} />
                </QuickActionIcon>
                Nouveau projet
                <ArrowUpRight size={13} />
              </QuickAction>

              <QuickAction to="/admin/blog/new">
                <QuickActionIcon $color="#00d4aa">
                  <Plus size={15} />
                </QuickActionIcon>
                Nouvel article
                <ArrowUpRight size={13} />
              </QuickAction>

              <QuickAction to="/admin/messages">
                <QuickActionIcon $color="#f59e0b">
                  <MessageSquare size={15} />
                </QuickActionIcon>
                Voir les messages
                {stats.unread > 0 && <InlineBadge>{stats.unread} non lus</InlineBadge>}
                <ArrowUpRight size={13} />
              </QuickAction>

              <QuickAction to="/admin/profile">
                <QuickActionIcon $color="#3b82f6">
                  <Clock size={15} />
                </QuickActionIcon>
                Modifier le profil
                <ArrowUpRight size={13} />
              </QuickAction>
            </QuickActions>
          </Panel>
        </ContentGrid>
      </motion.div>
    </motion.div>
  );
}
