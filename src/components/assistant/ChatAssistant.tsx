import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  RefreshCw,
  Send,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { AssistantError, callAssistant } from '../../lib/mistral';

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(234,88,12,0.4); }
  50% { box-shadow: 0 0 0 12px rgba(234,88,12,0); }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const FloatButton = styled(motion.button)<{ $hasUnread: boolean }>`
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: ${({ theme }) => theme.zIndex.modal};
  width: 58px;
  height: 58px;
  border: none;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradients.brand};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(234,88,12,0.45);
  animation: ${({ $hasUnread }) =>
    $hasUnread ? css`${pulse} 2s ease-in-out infinite` : 'none'};

  @media (max-width: 480px) {
    right: 1rem;
    bottom: 1rem;
  }
`;

const FloatButtonIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UnreadBadge = styled(motion.div)`
  position: absolute;
  top: -3px;
  right: -3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.bg};
  background: ${({ theme }) => theme.colors.danger};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
`;

const ChatWindow = styled(motion.div)`
  position: fixed;
  right: 2rem;
  bottom: 6.5rem;
  z-index: ${({ theme }) => theme.zIndex.modal};
  width: 380px;
  height: min(560px, calc(100vh - 8rem));
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 24px 64px rgba(120, 53, 15, 0.22),
    0 0 0 1px rgba(234,88,12, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  @media (max-width: 480px) {
    left: 0.75rem;
    right: 0.75rem;
    bottom: 5.5rem;
    width: auto;
    height: 72vh;
    border-radius: ${({ theme }) => theme.radii.lg};
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.125rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: linear-gradient(
    135deg,
    rgba(234,88,12, 0.15),
    rgba(219,39,119, 0.08)
  );
  flex-shrink: 0;
`;

const AvatarRing = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradients.brand};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OnlineDot = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border: 2px solid ${({ theme }) => theme.colors.bgCard};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.success};
`;

const HeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const HeaderName = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const HeaderStatus = styled.div`
  font-size: 0.6875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.success};
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.success};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const HeaderBtn = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.surfaceBorder};
    border-radius: 2px;
  }
`;

const MessageBubble = styled(motion.div)<{ $role: 'user' | 'assistant' }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 88%;
  align-self: ${({ $role }) =>
    $role === 'user' ? 'flex-end' : 'flex-start'};
  align-items: ${({ $role }) =>
    $role === 'user' ? 'flex-end' : 'flex-start'};
`;

const BubbleContent = styled.div<{ $role: 'user' | 'assistant' }>`
  padding: 0.625rem 0.875rem;
  border-radius: ${({ $role }) =>
    $role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;

  ${({ $role, theme }) =>
    $role === 'user'
      ? `
        background: ${theme.gradients.brand};
        color: #fff;
      `
      : `
        background: ${theme.colors.surface};
        border: 1px solid ${theme.colors.surfaceBorder};
        color: ${theme.colors.textSecondary};
      `}

  strong {
    font-weight: 700;
    color: inherit;
  }

  a {
    color: ${({ $role, theme }) => ($role === 'user' ? '#fff' : theme.colors.accentHover)};
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const BubbleTime = styled.div`
  padding: 0 0.25rem;
  font-size: 0.625rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TypingBubble = styled(motion.div)`
  width: fit-content;
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.625rem 0.875rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 16px 16px 16px 4px;
`;

const TypingDot = styled.span<{ $delay: number }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  animation: ${blink} 1.2s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}ms;
`;

const WelcomeCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.125rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: linear-gradient(
    135deg,
    rgba(234,88,12, 0.08),
    rgba(219,39,119, 0.05)
  );
  border: 1px solid rgba(234,88,12, 0.15);
`;

const WelcomeTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const WelcomeText = styled.div`
  font-size: 0.8125rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SuggestionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.25rem;
`;

const SuggestionChip = styled(motion.button)`
  padding: 0.3rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1px solid rgba(234,88,12, 0.2);
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.75rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(234,88,12, 0.2);
    border-color: rgba(234,88,12, 0.4);
  }
`;

const StreamingCursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 14px;
  margin-left: 2px;
  vertical-align: text-bottom;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 1px;
  animation: ${blink} 0.8s ease-in-out infinite;
`;

const InlineCTA = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: fit-content;
  margin-top: 0.25rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: 0 0 16px ${({ theme }) => theme.colors.accentGlow};
  }
`;

const InputArea = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: ${({ theme }) => theme.colors.bgSecondary};
  flex-shrink: 0;
`;

const ChatInput = styled.textarea`
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  resize: none;
  overflow-y: auto;
  padding: 0.6rem 0.875rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  font-family: inherit;
  line-height: 1.5;
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

const SendButton = styled(motion.button)<{ $disabled: boolean }>`
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  border: 1px solid
    ${({ $disabled, theme }) =>
      $disabled ? theme.colors.surfaceBorder : 'transparent'};
  background: ${({ $disabled, theme }) =>
    $disabled
      ? theme.colors.surface
      : `${theme.gradients.brand}`};
  color: ${({ $disabled, theme }) =>
    $disabled ? theme.colors.textMuted : '#fff'};
  box-shadow: ${({ $disabled, theme }) =>
    $disabled ? 'none' : `0 2px 12px ${theme.colors.accentGlow}`};
`;

const PoweredBy = styled.div`
  padding: 0.25rem 0 0.5rem;
  text-align: center;
  font-size: 0.625rem;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgSecondary};

  span {
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 600;
  }
`;

const INITIAL_SUGGESTIONS = [
  'Quels sont tes projets IA ?',
  'Quels services proposes-tu ?',
  'Comment te contacter ?',
  'Quel est ton stack technique ?',
  'Parle-moi de ton experience',
  'Tu es disponible pour un CDI ?',
];

const INLINE_MARKDOWN = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Rendu Markdown minimal (gras + liens) en éléments React : aucune injection HTML possible. */
function renderRichText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_MARKDOWN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(text.slice(lastIndex, index));

    const [raw, bold, label, href] = match;
    if (bold) {
      nodes.push(<strong key={index}>{bold}</strong>);
    } else if (href && /^(https?:\/\/|mailto:|\/(?!\/))/.test(href)) {
      const external = /^https?:/.test(href);
      nodes.push(
        <a
          key={index}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>,
      );
    } else {
      nodes.push(raw);
    }

    lastIndex = index + raw.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function detectCTA(text: string) {
  const keywords = [
    'contacter',
    'contact',
    'mission',
    'projet',
    'travailler',
    'collaboration',
    'devis',
    'disponible',
    'interesse',
  ];

  return keywords.some((keyword) => text.toLowerCase().includes(keyword));
}

interface EnrichedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  showCTA?: boolean;
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<EnrichedMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const { profile } = useProfile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setHasUnread(true);
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const ownerName = profile?.full_name?.trim().split(/\s+/)[0] || 'ce portfolio';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleOpen = useCallback(async () => {
    setIsOpen(true);
    setHasUnread(false);
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleReset = useCallback(async () => {
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  }, []);

  const handleContactCTA = useCallback(() => {
    setIsOpen(false);
    const contactSection = document.getElementById('contact');

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    window.location.href = '/#contact';
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: EnrichedMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    const history = [...messages, userMessage];
    setMessages(history);
    setInput('');
    setIsLoading(true);

    const assistantId = `assistant-${Date.now()}`;
    const assistantMessage: EnrichedMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages([...history, assistantMessage]);

    try {
      const historyForApi = history.map((message) => ({
        role: message.role,
        content: message.content,
      }));

      await callAssistant(historyForApi, (chunk) => {
        setMessages((previous) =>
          previous.map((message) =>
            message.id === assistantId
              ? { ...message, content: message.content + chunk }
              : message,
          ),
        );
      });

      setMessages((previous) =>
        previous.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                isStreaming: false,
                showCTA: detectCTA(trimmed) || detectCTA(message.content),
              }
            : message,
        ),
      );
    } catch (error) {
      setMessages((previous) =>
        previous.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content:
                  error instanceof AssistantError && error.status === 429
                    ? error.message
                    : "Désolé, une erreur s'est produite. Vous pouvez réessayer ou passer par le formulaire de contact.",
                isStreaming: false,
              }
            : message,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }, [input, sendMessage]);

  const handleSuggestion = useCallback((suggestion: string) => {
    void sendMessage(suggestion);
  }, [sendMessage]);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <FloatButton
            $hasUnread={hasUnread}
            onClick={() => {
              void handleOpen();
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Ouvrir l'assistant IA"
          >
            <FloatButtonIcon
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.5, delay: 2, repeat: Infinity, repeatDelay: 8 }}
            >
              <Sparkles size={24} />
            </FloatButtonIcon>
            {hasUnread && (
              <UnreadBadge
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                1
              </UnreadBadge>
            )}
          </FloatButton>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            initial={{ opacity: 0, scale: 0.88, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <ChatHeader>
              <AvatarRing>
                <Sparkles size={18} color="#fff" />
                <OnlineDot />
              </AvatarRing>
              <HeaderInfo>
                <HeaderName>Assistant IA</HeaderName>
                <HeaderStatus>
                  En ligne
                </HeaderStatus>
              </HeaderInfo>
              <HeaderActions>
                <HeaderBtn
                  onClick={() => {
                    void handleReset();
                  }}
                  title="Reinitialiser la conversation"
                >
                  <RefreshCw size={14} />
                </HeaderBtn>
                <HeaderBtn onClick={handleClose} title="Fermer">
                  <ChevronDown size={16} />
                </HeaderBtn>
              </HeaderActions>
            </ChatHeader>

            <MessagesArea>
              {messages.length === 0 && (
                <WelcomeCard
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <WelcomeTitle>
                    <Sparkles size={14} color="var(--accent)" />
                    Bonjour ! Je suis l&apos;assistant de {ownerName}
                  </WelcomeTitle>
                  <WelcomeText>
                    Je connais les projets, les choix techniques, les services et les articles de ce portfolio. Posez votre question ou choisissez un sujet pour commencer.
                  </WelcomeText>
                  <SuggestionsRow>
                    {INITIAL_SUGGESTIONS.map((suggestion) => (
                      <SuggestionChip
                        key={suggestion}
                        onClick={() => handleSuggestion(suggestion)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {suggestion}
                      </SuggestionChip>
                    ))}
                  </SuggestionsRow>
                </WelcomeCard>
              )}

              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    $role={message.role}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BubbleContent $role={message.role}>
                      {message.role === 'assistant' ? renderRichText(message.content) : message.content}
                      {message.isStreaming && <StreamingCursor />}
                    </BubbleContent>
                    <BubbleTime>{formatTime(message.timestamp)}</BubbleTime>

                    {message.role === 'assistant' &&
                      message.showCTA &&
                      !message.isStreaming && (
                        <InlineCTA
                          onClick={handleContactCTA}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Zap size={13} /> Contacter maintenant
                        </InlineCTA>
                      )}
                  </MessageBubble>
                ))}
              </AnimatePresence>

              {isLoading && messages[messages.length - 1]?.content === '' && (
                <TypingBubble initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <TypingDot $delay={0} />
                  <TypingDot $delay={200} />
                  <TypingDot $delay={400} />
                </TypingBubble>
              )}

              <div ref={messagesEndRef} />
            </MessagesArea>

            <InputArea>
              <ChatInput
                ref={inputRef}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  event.target.style.height = 'auto';
                  event.target.style.height = `${Math.min(event.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question..."
                disabled={isLoading}
                rows={1}
              />
              <SendButton
                $disabled={!input.trim() || isLoading}
                onClick={() => {
                  void sendMessage(input);
                }}
                disabled={!input.trim() || isLoading}
                whileHover={
                  input.trim() && !isLoading ? { scale: 1.08 } : {}
                }
                whileTap={
                  input.trim() && !isLoading ? { scale: 0.92 } : {}
                }
              >
                <Send size={15} />
              </SendButton>
            </InputArea>

            <PoweredBy>
              Propulsé par <span>Mistral AI</span>
            </PoweredBy>
          </ChatWindow>
        )}
      </AnimatePresence>
    </>
  );
}
