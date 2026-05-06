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
    if (size === 'sm') return css`padding: 0.5rem 1rem; font-size: 0.875rem;`;
    if (size === 'lg') return css`padding: 1rem 2rem; font-size: 1.0625rem;`;
    return css`padding: 0.75rem 1.5rem; font-size: 1rem;`;
  }}

  ${({ variant = 'primary', theme }) => {
    if (variant === 'secondary') return css`
      background: ${theme.colors.bgCard};
      color: ${theme.colors.textPrimary};
      border: 1.5px solid ${theme.colors.surfaceBorder};
      box-shadow: ${theme.shadows.sm};
      &:hover {
        background: ${theme.colors.accentDim};
        border-color: ${theme.colors.accent}55;
        color: ${theme.colors.accent};
        transform: translateY(-1px);
      }
    `;
    if (variant === 'ghost') return css`
      background: transparent;
      color: ${theme.colors.textSecondary};
      &:hover {
        color: ${theme.colors.textPrimary};
        background: ${theme.colors.surface};
      }
    `;
    if (variant === 'danger') return css`
      background: rgba(220,38,38,0.08);
      color: ${theme.colors.danger};
      border: 1px solid rgba(220,38,38,0.2);
      &:hover {
        background: rgba(220,38,38,0.15);
        border-color: ${theme.colors.danger};
      }
    `;
    return css`
      background: ${theme.colors.accent};
      color: #fff;
      box-shadow: ${theme.shadows.accent};
      &:hover {
        background: ${theme.colors.accentHover};
        box-shadow: ${theme.shadows.accentStrong};
        transform: translateY(-1px) scale(1.01);
      }
      &:active { transform: translateY(0) scale(0.99); }
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
    const v = {
      accent: css`
        background: ${theme.colors.accentDim};
        color: ${theme.colors.accent};
        border: 1px solid ${theme.colors.accent}33;
      `,
      teal: css`
        background: ${theme.colors.tealDim};
        color: ${theme.colors.teal};
        border: 1px solid ${theme.colors.teal}33;
      `,
      muted: css`
        background: ${theme.colors.surface};
        color: ${theme.colors.textSecondary};
        border: 1px solid ${theme.colors.surfaceBorder};
      `,
      success: css`
        background: ${theme.colors.accentDim};
        color: ${theme.colors.success};
        border: 1px solid ${theme.colors.accent}33;
      `,
      warning: css`
        background: rgba(217,119,6,0.08);
        color: ${theme.colors.warning};
        border: 1px solid rgba(217,119,6,0.2);
      `,
      danger: css`
        background: rgba(220,38,38,0.08);
        color: ${theme.colors.danger};
        border: 1px solid rgba(220,38,38,0.2);
      `,
    };
    return v[variant];
  }}
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.18rem 0.55rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.72rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 500;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  transition: all 0.2s cubic-bezier(0.16,1,0.3,1);

  &:hover {
    background: ${({ theme }) => theme.colors.accentDim};
    color: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent}44;
  }
`;

export const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent}33;
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-4px) scale(1.01);
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1.5px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9375rem;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.bgCard};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1.5px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9375rem;
  resize: vertical;
  min-height: 120px;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-family: inherit;

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.bgCard};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  margin: 2rem 0;
`;

export const SectionLabel = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 0.5rem;

  &::before {
    content: '';
    display: block;
    width: 18px;
    height: 1.5px;
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 2px;
  }
`;

export const SectionTitle = styled(motion.h2)`
  font-size: clamp(1.625rem, 3.5vw, 2.5rem);
  font-weight: 800;
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.03em;

  span {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

export const Spinner = styled.div<{ size?: number }>`
  width: ${({ size = 24 }) => size}px;
  height: ${({ size = 24 }) => size}px;
  border: 2px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;
