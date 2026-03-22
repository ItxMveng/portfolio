import { motion } from 'framer-motion';
import styled, { css, keyframes } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = styled(motion.button)<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.base};
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  ${({ size = 'md' }) => {
    if (size === 'sm') {
      return css`
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      `;
    }

    if (size === 'lg') {
      return css`
        padding: 1rem 2rem;
        font-size: 1.0625rem;
      `;
    }

    return css`
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      `;
  }}

  ${({ variant = 'primary', theme }) => {
    if (variant === 'secondary') {
      return css`
        background: ${theme.colors.surface};
        color: ${theme.colors.textPrimary};
        border: 1px solid ${theme.colors.surfaceBorder};

        &:hover {
          background: ${theme.colors.surfaceHover};
          border-color: ${theme.colors.accent};
          color: ${theme.colors.accent};
        }
      `;
    }

    if (variant === 'ghost') {
      return css`
        background: transparent;
        color: ${theme.colors.textSecondary};

        &:hover {
          color: ${theme.colors.textPrimary};
          background: ${theme.colors.surface};
        }
      `;
    }

    if (variant === 'danger') {
      return css`
        background: rgba(239,68,68,0.1);
        color: ${theme.colors.danger};
        border: 1px solid rgba(239,68,68,0.2);

        &:hover {
          background: rgba(239,68,68,0.2);
          border-color: ${theme.colors.danger};
        }
      `;
    }

    return css`
        background: ${theme.colors.accent};
        color: #fff;
        box-shadow: 0 0 0 0 ${theme.colors.accentGlow};

        &:hover {
          background: ${theme.colors.accentHover};
          box-shadow: 0 0 24px ${theme.colors.accentGlow};
          transform: translateY(-1px);
        }

        &:active {
          transform: translateY(0);
        }
      `;
  }}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export const Badge = styled.span<{
  variant?: 'accent' | 'teal' | 'muted' | 'success' | 'warning' | 'danger';
}>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.65rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;

  ${({ variant = 'muted', theme }) => {
    const variants = {
      accent: css`
        background: ${theme.colors.accentDim};
        color: ${theme.colors.accentHover};
        border: 1px solid rgba(124,92,252,0.2);
      `,
      teal: css`
        background: ${theme.colors.tealDim};
        color: ${theme.colors.teal};
        border: 1px solid rgba(0,212,170,0.2);
      `,
      muted: css`
        background: ${theme.colors.surface};
        color: ${theme.colors.textSecondary};
        border: 1px solid ${theme.colors.surfaceBorder};
      `,
      success: css`
        background: rgba(0,212,170,0.1);
        color: ${theme.colors.success};
        border: 1px solid rgba(0,212,170,0.2);
      `,
      warning: css`
        background: rgba(245,158,11,0.1);
        color: ${theme.colors.warning};
        border: 1px solid rgba(245,158,11,0.2);
      `,
      danger: css`
        background: rgba(239,68,68,0.1);
        color: ${theme.colors.danger};
        border: 1px solid rgba(239,68,68,0.2);
      `,
    };
    return variants[variant];
  }}
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 500;
  background: rgba(124,92,252,0.08);
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid rgba(124,92,252,0.15);
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.accentDim};
    color: ${({ theme }) => theme.colors.accentHover};
    border-color: rgba(124,92,252,0.3);
  }
`;

export const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    border-color: rgba(124,92,252,0.3);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9375rem;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.surfaceHover};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9375rem;
  resize: vertical;
  min-height: 120px;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.surfaceHover};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  margin: 2rem 0;
`;

export const SectionLabel = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 1rem;

  &::before {
    content: '';
    display: block;
    width: 20px;
    height: 1px;
    background: ${({ theme }) => theme.colors.accent};
  }
`;

export const SectionTitle = styled(motion.h2)`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;

  span {
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.accent},
      ${({ theme }) => theme.colors.teal}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div<{ size?: number }>`
  width: ${({ size = 24 }) => size}px;
  height: ${({ size = 24 }) => size}px;
  border: 2px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;
