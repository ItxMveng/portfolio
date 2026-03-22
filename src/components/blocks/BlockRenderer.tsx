import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  AlertCircle,
  AlertTriangle,
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Info,
  Lightbulb,
  Play,
} from 'lucide-react';
import styled from 'styled-components';
import type { Block } from '../../types';

const ProseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  font-size: 1rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const H1 = styled.h1`
  font-size: clamp(1.875rem, 4vw, 2.75rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-top: 0.5rem;
`;

const H2 = styled.h2`
  font-size: clamp(1.375rem, 3vw, 1.875rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  line-height: 1.25;
  padding-top: 1.25rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -1.5rem;
    top: 50%;
    transform: translateY(-50%) translateY(0.625rem);
    width: 3px;
    height: 60%;
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 2px;
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.fast};
  }

  &:hover::before {
    opacity: 1;
  }
`;

const H3 = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em;
  line-height: 1.3;
  padding-top: 0.5rem;
`;

const Para = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.85;

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 600;
  }

  em {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-style: italic;
  }

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.accentHover};
    }
  }

  code {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.875em;
    background: rgba(124, 92, 252, 0.12);
    color: ${({ theme }) => theme.colors.accentHover};
    padding: 0.15em 0.45em;
    border-radius: 4px;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.surfaceBorder};
    opacity: 0.5;
  }

  span {
    font-size: 0.625rem;
    letter-spacing: 0.15em;
    color: ${({ theme }) => theme.colors.textMuted};
    text-transform: uppercase;
  }
`;

const ImageFigure = styled(motion.figure)`
  margin: 0;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: ${({ theme }) => theme.colors.bgCard};

  img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform ${({ theme }) => theme.transitions.slow};
  }

  &:hover img {
    transform: scale(1.02);
  }
`;

const ImageCaption = styled.figcaption`
  padding: 0.625rem 1rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  font-style: italic;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

const VideoContainer = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: #000;
`;

const VideoAspect = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;

  iframe,
  video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const VideoCaption = styled.div`
  padding: 0.625rem 1rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  font-style: italic;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: ${({ theme }) => theme.colors.bgCard};
`;

const CodeWrapper = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

const CodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  background: rgba(10, 10, 15, 0.9);
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

const CodeLang = styled.span`
  font-size: 0.6875rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

const CodeDots = styled.div`
  display: flex;
  gap: 5px;

  span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
`;

const CopyButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }
`;

const calloutConfig = {
  info: {
    icon: Info,
    bg: 'rgba(59,130,246,0.07)',
    border: 'rgba(59,130,246,0.25)',
    accent: '#3b82f6',
    label: 'Info',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'rgba(245,158,11,0.07)',
    border: 'rgba(245,158,11,0.25)',
    accent: '#f59e0b',
    label: 'Attention',
  },
  danger: {
    icon: AlertCircle,
    bg: 'rgba(239,68,68,0.07)',
    border: 'rgba(239,68,68,0.25)',
    accent: '#ef4444',
    label: 'Important',
  },
  tip: {
    icon: Lightbulb,
    bg: 'rgba(0,212,170,0.07)',
    border: 'rgba(0,212,170,0.25)',
    accent: '#00d4aa',
    label: 'Conseil',
  },
} as const;

const CalloutBox = styled.div<{ $bg: string; $border: string }>`
  display: flex;
  gap: 1rem;
  padding: 1.125rem 1.25rem;
  background: ${({ $bg }) => $bg};
  border: 1px solid ${({ $border }) => $border};
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const CalloutIconWrap = styled.div<{ $accent: string }>`
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ $accent }) => `${$accent}22`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  color: ${({ $accent }) => $accent};
`;

const CalloutBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
`;

const CalloutLabel = styled.span<{ $accent: string }>`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ $accent }) => $accent};
`;

const CalloutText = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`;

const FileCard = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
    transform: translateX(2px);
  }
`;

const FileIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(124, 92, 252, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
`;

const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
`;

const FileName = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileSize = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
`;

const StepsHeader = styled.div`
  padding: 0.875rem 1.5rem;
  background: ${({ theme }) => theme.colors.bgCard};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepsLeadIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.accent};
`;

const StepsTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StepsCount = styled.span`
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(124, 92, 252, 0.2);
  padding: 0.1rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
`;

const StepRow = styled(motion.div)<{ $open: boolean }>`
  background: ${({ $open, theme }) => ($open ? theme.colors.bgCardHover : theme.colors.bgCard)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:last-child {
    border-bottom: none;
  }
`;

const StepRowHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.125rem 1.5rem;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(124, 92, 252, 0.04);
  }
`;

const StepNum = styled.div`
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
  margin-top: 1px;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const StepHeaderText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const StepLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.35;
`;

const StepPreview = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
`;

const StepChevron = styled.div<{ $open: boolean }>`
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
  transition: transform ${({ theme }) => theme.transitions.base};
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
  flex-shrink: 0;
`;

const StepBody = styled(motion.div)`
  overflow: hidden;
  padding: 0 1.5rem 1.25rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const StepBodyText = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.75;
  margin: 0;
`;

const StepBodyCode = styled.pre`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0.875rem 1.125rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow-x: auto;
  line-height: 1.65;
  margin: 0;
`;

const codeTheme = {
  'code[class*="language-"]': {
    color: '#e2e0f0',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    fontSize: '0.875rem',
    lineHeight: '1.75',
    background: 'transparent',
  },
  'pre[class*="language-"]': {
    background: '#0e0e16',
    padding: '1.25rem 1.5rem',
    margin: '0',
    overflow: 'auto',
  },
  comment: { color: '#5a5a7a', fontStyle: 'italic' },
  prolog: { color: '#5a5a7a' },
  doctype: { color: '#5a5a7a' },
  cdata: { color: '#5a5a7a' },
  punctuation: { color: '#7a7a9a' },
  property: { color: '#7c5cfc' },
  tag: { color: '#7c5cfc' },
  constant: { color: '#7c5cfc' },
  symbol: { color: '#7c5cfc' },
  deleted: { color: '#ef4444' },
  boolean: { color: '#f59e0b' },
  number: { color: '#f59e0b' },
  selector: { color: '#00d4aa' },
  'attr-name': { color: '#00d4aa' },
  string: { color: '#00d4aa' },
  char: { color: '#00d4aa' },
  builtin: { color: '#00d4aa' },
  inserted: { color: '#00d4aa' },
  operator: { color: '#9ca3af' },
  entity: { color: '#9ca3af', cursor: 'help' },
  url: { color: '#9ca3af' },
  variable: { color: '#e2e0f0' },
  atrule: { color: '#9b7ffd' },
  'attr-value': { color: '#00d4aa' },
  function: { color: '#9b7ffd' },
  'class-name': { color: '#9b7ffd' },
  keyword: { color: '#7c5cfc', fontStyle: 'italic' },
  regex: { color: '#f59e0b' },
  important: { color: '#f59e0b', fontWeight: 'bold' },
};

function isYouTube(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function isVimeo(url: string) {
  return url.includes('vimeo.com');
}

function getYouTubeEmbedUrl(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : url;
}

function getVimeoEmbedUrl(url: string) {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : url;
}

function CodeBlock({ block }: { block: Block }) {
  const [copied, setCopied] = useState(false);
  const lang = block.meta?.language ?? 'typescript';
  const code = block.content ?? '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed', error);
    }
  };

  return (
    <CodeWrapper>
      <CodeHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CodeDots>
            <span style={{ background: '#ff5f57' }} />
            <span style={{ background: '#febc2e' }} />
            <span style={{ background: '#28c840' }} />
          </CodeDots>
          <CodeLang>{lang}</CodeLang>
        </div>
        <CopyButton onClick={handleCopy} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          {copied ? (
            <>
              <Check size={12} /> Copie
            </>
          ) : (
            <>
              <Copy size={12} /> Copier
            </>
          )}
        </CopyButton>
      </CodeHeader>
      <SyntaxHighlighter
        language={lang}
        style={codeTheme as never}
        showLineNumbers
        lineNumberStyle={{
          color: '#3a3a5a',
          fontSize: '0.75rem',
          paddingRight: '1.25rem',
          userSelect: 'none',
        }}
        wrapLongLines={false}
      >
        {code}
      </SyntaxHighlighter>
    </CodeWrapper>
  );
}

function CalloutBlock({ block }: { block: Block }) {
  const variant = (block.meta?.variant ?? 'info') as keyof typeof calloutConfig;
  const config = calloutConfig[variant] ?? calloutConfig.info;
  const Icon = config.icon;

  return (
    <CalloutBox $bg={config.bg} $border={config.border}>
      <CalloutIconWrap $accent={config.accent}>
        <Icon size={15} />
      </CalloutIconWrap>
      <CalloutBody>
        <CalloutLabel $accent={config.accent}>{config.label}</CalloutLabel>
        <CalloutText>{block.content}</CalloutText>
      </CalloutBody>
    </CalloutBox>
  );
}

function StepGroupBlock({ block }: { block: Block }) {
  const steps = block.meta?.steps ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <StepsContainer>
      <StepsHeader>
        <StepsLeadIcon>
          <Play size={13} />
        </StepsLeadIcon>
        <StepsTitle>Etapes</StepsTitle>
        <StepsCount>
          {steps.length} etape{steps.length !== 1 ? 's' : ''}
        </StepsCount>
      </StepsHeader>

      {steps.map((step, index) => {
        const isOpen = openIndex === index;

        return (
          <StepRow key={`${block.id}-step-${index}`} $open={isOpen}>
            <StepRowHeader type="button" onClick={() => toggle(index)}>
              <StepNum>{index + 1}</StepNum>
              <StepHeaderText>
                <StepLabel>{step.title}</StepLabel>
                {!isOpen && step.content && <StepPreview>{step.content}</StepPreview>}
              </StepHeaderText>
              <StepChevron $open={isOpen}>
                <ChevronDown size={16} />
              </StepChevron>
            </StepRowHeader>

            <AnimatePresence initial={false}>
              {isOpen && (
                <StepBody
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {step.content && <StepBodyText>{step.content}</StepBodyText>}
                  {step.code && <StepBodyCode>{step.code}</StepBodyCode>}
                </StepBody>
              )}
            </AnimatePresence>
          </StepRow>
        );
      })}
    </StepsContainer>
  );
}

interface BlockRendererProps {
  blocks: Block[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <ProseWrapper>
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading': {
            const level = block.meta?.level ?? 2;
            const domId = block.meta?._domId ?? `heading-${block.id}`;
            if (level === 1) return <H1 key={block.id} id={domId}>{block.content}</H1>;
            if (level === 3) return <H3 key={block.id} id={domId}>{block.content}</H3>;
            return <H2 key={block.id} id={domId}>{block.content}</H2>;
          }
          case 'paragraph':
            return <Para key={block.id} dangerouslySetInnerHTML={{ __html: block.content ?? '' }} />;
          case 'divider':
            return (
              <Divider key={block.id}>
                <span>•••</span>
              </Divider>
            );
          case 'image': {
            const src = block.meta?.url ?? block.content ?? '';
            return (
              <ImageFigure
                key={block.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <img src={src} alt={block.meta?.alt ?? ''} loading="lazy" />
                {block.meta?.caption && <ImageCaption>{block.meta.caption}</ImageCaption>}
              </ImageFigure>
            );
          }
          case 'video': {
            const url = block.meta?.url ?? block.content ?? '';
            return (
              <VideoContainer key={block.id}>
                <VideoAspect>
                  {isYouTube(url) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(url)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={block.meta?.caption ?? 'Video'}
                    />
                  ) : isVimeo(url) ? (
                    <iframe
                      src={getVimeoEmbedUrl(url)}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={block.meta?.caption ?? 'Video'}
                    />
                  ) : (
                    <video controls src={url} preload="metadata" />
                  )}
                </VideoAspect>
                {block.meta?.caption && <VideoCaption>{block.meta.caption}</VideoCaption>}
              </VideoContainer>
            );
          }
          case 'code':
            return <CodeBlock key={block.id} block={block} />;
          case 'callout':
            return <CalloutBlock key={block.id} block={block} />;
          case 'file': {
            const href = block.meta?.url ?? '#';
            const name = block.meta?.filename ?? block.content ?? 'Fichier';
            const size = block.meta?.filesize;
            return (
              <FileCard
                key={block.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                download
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.99 }}
              >
                <FileIconWrap>
                  <FileText size={18} />
                </FileIconWrap>
                <FileInfo>
                  <FileName>{name}</FileName>
                  {size && <FileSize>{size}</FileSize>}
                </FileInfo>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <Download size={16} style={{ color: 'currentColor', opacity: 0.75 }} />
                  <ExternalLink size={14} style={{ color: 'currentColor', opacity: 0.5 }} />
                </div>
              </FileCard>
            );
          }
          case 'step_group':
            return <StepGroupBlock key={block.id} block={block} />;
          default:
            return null;
        }
      })}
    </ProseWrapper>
  );
}
