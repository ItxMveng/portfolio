import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AtSign,
  CheckCheck,
  Clock,
  FileText,
  Mail,
  MailOpen,
  MessageSquare,
  Search,
  Trash2,
} from 'lucide-react';
import { useMessages } from '../../hooks/useMessages';
import { supabase } from '../../lib/supabase';
import { staggerContainer, staggerItem } from '../../lib/animations';
import type { Message } from '../../types';

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const PageTitle = styled.h1`
  font-size: 1.625rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
`;

const PageSubtitle = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MarkAllButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme.colors.teal};
    color: ${({ theme }) => theme.colors.teal};
    background: ${({ theme }) => theme.colors.tealDim};
  }
`;

const ToolBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 360px;
`;

const SearchIconWrap = styled.div`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
  display: flex;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.875rem 0.6rem 2.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.full};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  font-family: inherit;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
`;

const FilterSelect = styled.select`
  padding: 0.6rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.full};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const ResultCount = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
  margin-left: auto;
`;

const MessagesLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  align-items: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 340px 1fr;
  }
`;

const MessagesList = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`;

const MessageItem = styled(motion.div)<{ $unread: boolean; $selected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.125rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  background: ${({ $selected, $unread, theme }) =>
    $selected
      ? theme.colors.accentDim
      : $unread
        ? 'rgba(124,92,252,0.03)'
        : 'transparent'};
  border-left: 3px solid ${({ $selected, $unread, theme }) =>
    $selected
      ? theme.colors.accent
      : $unread
        ? 'rgba(124,92,252,0.3)'
        : 'transparent'};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ $selected, theme }) =>
      $selected ? theme.colors.accentDim : theme.colors.surface};
  }
`;

const MessageAvatar = styled.div<{ $unread: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $unread, theme }) =>
    $unread ? theme.colors.accentDim : theme.colors.surface};
  border: 1px solid ${({ $unread, theme }) =>
    $unread ? 'rgba(124,92,252,0.25)' : theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ $unread, theme }) =>
    $unread ? theme.colors.accent : theme.colors.textSecondary};
  flex-shrink: 0;
`;

const MessageItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const MessageItemTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.2rem;
`;

const MessageSender = styled.span<{ $unread: boolean }>`
  font-size: 0.875rem;
  font-weight: ${({ $unread }) => ($unread ? 700 : 500)};
  color: ${({ $unread, theme }) =>
    $unread ? theme.colors.textPrimary : theme.colors.textSecondary};
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

const MessagePreview = styled.p<{ $unread: boolean }>`
  font-size: 0.8125rem;
  color: ${({ $unread, theme }) =>
    $unread ? theme.colors.textSecondary : theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: ${({ $unread }) => ($unread ? 500 : 400)};
`;

const UnreadDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
  margin-top: 6px;
`;

const DetailPanel = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: sticky;
    top: 80px;
  }
`;

const DetailEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 5rem 2rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  font-size: 0.9375rem;
`;

const DetailHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

const DetailHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const DetailName = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DetailMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const DetailMetaItem = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const DetailActions = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-shrink: 0;
`;

const DetailActionBtn = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid;
  transition: all ${({ theme }) => theme.transitions.fast};
  background: ${({ $danger }) => ($danger ? 'rgba(239,68,68,0.08)' : 'transparent')};
  color: ${({ $danger, theme }) =>
    $danger ? theme.colors.danger : theme.colors.textMuted};
  border-color: ${({ $danger }) =>
    $danger ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'};

  &:hover {
    background: ${({ $danger }) =>
      $danger ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'};
    color: ${({ $danger, theme }) =>
      $danger ? theme.colors.danger : theme.colors.textPrimary};
    border-color: currentColor;
  }
`;

const DetailSubject = styled.div`
  padding: 1rem 1.5rem 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const DetailBody = styled.div`
  padding: 1rem 1.5rem 1.5rem;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
`;

const DetailDate = styled.div`
  padding: 0.875rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 5rem 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
`;

export default function MessagesPage() {
  const { messages, loading, markRead } = useMessages(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [search, setSearch] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const filtered = localMessages
    .filter((message) => {
      if (filterRead === 'unread') {
        return !message.read;
      }
      if (filterRead === 'read') {
        return message.read;
      }
      return true;
    })
    .filter((message) => {
      if (!search.trim()) {
        return true;
      }

      const query = search.toLowerCase();
      return (
        message.name.toLowerCase().includes(query) ||
        message.email.toLowerCase().includes(query) ||
        message.message.toLowerCase().includes(query) ||
        (message.subject ?? '').toLowerCase().includes(query)
      );
    });

  const unreadCount = localMessages.filter((message) => !message.read).length;

  const handleSelect = async (message: Message) => {
    const nextSelected = message.read ? message : { ...message, read: true };
    setSelected(nextSelected);

    if (!message.read) {
      await markRead(message.id);
      setLocalMessages((prev) =>
        prev.map((item) => (item.id === message.id ? { ...item, read: true } : item)),
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce message ?')) {
      return;
    }

    await supabase.from('messages').delete().eq('id', id);
    setLocalMessages((prev) => prev.filter((message) => message.id !== id));
    if (selected?.id === id) {
      setSelected(null);
    }
  };

  const handleMarkAllRead = async () => {
    await supabase.from('messages').update({ read: true }).eq('read', false);
    setLocalMessages((prev) => prev.map((message) => ({ ...message, read: true })));
    setSelected((prev) => (prev ? { ...prev, read: true } : prev));
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    if (days === 1) {
      return 'Hier';
    }

    if (days < 7) {
      return `${days}j`;
    }

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={staggerItem}>
        <PageHeader>
          <div>
            <PageTitle>
              Messages
              {unreadCount > 0 && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '0.75rem',
                    minWidth: '24px',
                    height: '24px',
                    padding: '0 6px',
                    background: 'var(--accent)',
                    color: '#fff',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    verticalAlign: 'middle',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </PageTitle>
            <PageSubtitle>Messages recus via le formulaire de contact</PageSubtitle>
          </div>

          {unreadCount > 0 && (
            <MarkAllButton onClick={handleMarkAllRead} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <CheckCheck size={15} /> Tout marquer comme lu
            </MarkAllButton>
          )}
        </PageHeader>
      </motion.div>

      <motion.div variants={staggerItem}>
        <ToolBar>
          <SearchWrapper>
            <SearchIconWrap>
              <Search size={15} />
            </SearchIconWrap>
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un message..."
            />
          </SearchWrapper>

          <FilterSelect
            value={filterRead}
            onChange={(event) => setFilterRead(event.target.value as 'all' | 'unread' | 'read')}
          >
            <option value="all">Tous</option>
            <option value="unread">Non lus</option>
            <option value="read">Lus</option>
          </FilterSelect>

          <ResultCount>
            {filtered.length} message{filtered.length !== 1 ? 's' : ''}
          </ResultCount>
        </ToolBar>
      </motion.div>

      <motion.div variants={staggerItem}>
        {loading ? (
          <EmptyState>Chargement...</EmptyState>
        ) : filtered.length === 0 ? (
          <EmptyState>
            <MessageSquare size={36} strokeWidth={1} />
            <p>Aucun message trouve.</p>
          </EmptyState>
        ) : (
          <MessagesLayout>
            <MessagesList>
              <AnimatePresence>
                {filtered.map((message, index) => (
                  <MessageItem
                    key={message.id}
                    $unread={!message.read}
                    $selected={selected?.id === message.id}
                    onClick={() => handleSelect(message)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    {!message.read && <UnreadDot />}
                    <MessageAvatar $unread={!message.read}>
                      {message.name[0]?.toUpperCase()}
                    </MessageAvatar>
                    <MessageItemContent>
                      <MessageItemTop>
                        <MessageSender $unread={!message.read}>{message.name}</MessageSender>
                        <MessageDate>{formatDateShort(message.created_at)}</MessageDate>
                      </MessageItemTop>
                      <MessagePreview $unread={!message.read}>
                        {message.subject ? `[${message.subject}] ` : ''}
                        {message.message}
                      </MessagePreview>
                    </MessageItemContent>
                  </MessageItem>
                ))}
              </AnimatePresence>
            </MessagesList>

            <DetailPanel
              key={selected?.id ?? 'empty'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {!selected ? (
                <DetailEmpty>
                  <MailOpen size={40} strokeWidth={1} />
                  <p>Selectionnez un message pour le lire</p>
                </DetailEmpty>
              ) : (
                <>
                  <DetailHeader>
                    <DetailHeaderLeft>
                      <DetailName>{selected.name}</DetailName>
                      <DetailMeta>
                        <DetailMetaItem>
                          <AtSign size={11} />
                          <a
                            href={`mailto:${selected.email}`}
                            style={{ color: 'inherit', textDecoration: 'underline' }}
                          >
                            {selected.email}
                          </a>
                        </DetailMetaItem>
                      </DetailMeta>
                    </DetailHeaderLeft>

                    <DetailActions>
                      <DetailActionBtn
                        type="button"
                        onClick={() => {
                          window.location.href = `mailto:${selected.email}?subject=Re: ${
                            selected.subject || 'Votre message'
                          }`;
                        }}
                        title="Repondre par email"
                      >
                        <Mail size={13} /> Repondre
                      </DetailActionBtn>
                      <DetailActionBtn
                        type="button"
                        $danger
                        onClick={() => handleDelete(selected.id)}
                        title="Supprimer"
                      >
                        <Trash2 size={13} />
                      </DetailActionBtn>
                    </DetailActions>
                  </DetailHeader>

                  {selected.subject && (
                    <DetailSubject>
                      <FileText size={12} /> {selected.subject}
                    </DetailSubject>
                  )}

                  <DetailBody>{selected.message}</DetailBody>

                  <DetailDate>
                    <Clock size={11} />
                    Recu le {formatDate(selected.created_at)}
                  </DetailDate>
                </>
              )}
            </DetailPanel>
          </MessagesLayout>
        )}
      </motion.div>
    </motion.div>
  );
}
