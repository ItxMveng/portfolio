import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Lock, Mail, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg};
  padding: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    width: 700px;
    height: 500px;
    background: radial-gradient(ellipse at center, rgba(124, 92, 252, 0.12) 0%, transparent 70%);
    filter: blur(60px);
    pointer-events: none;
  }
`;

const Card = styled(motion.div)`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 2.5rem;
  position: relative;
  z-index: 1;
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.0625rem;
  font-weight: 700;

  span {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const Title = styled.h1`
  font-size: 1.625rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const FieldLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9375rem;
  font-family: inherit;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.bgSecondary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentDim};
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ErrorBanner = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.875rem 1rem;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.danger};
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 0.875rem;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  margin-top: 0.25rem;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: 0 0 24px ${({ theme }) => theme.colors.accentGlow};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BackToSite = styled.button`
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  background: none;
  border: none;

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export default function LoginPage() {
  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/admin', { replace: true });
    }
  }, [authLoading, navigate, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError('Email ou mot de passe incorrect.');
      setLoading(false);
      return;
    }

    navigate('/admin', { replace: true });
  };

  return (
    <PageWrapper>
      <Card
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <LogoRow>
          <Zap size={20} />
          <span>Portfolio</span> Admin
        </LogoRow>

        <Title>Connexion</Title>
        <Subtitle>Accès réservé à l&apos;administration du portfolio.</Subtitle>

        <Form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldLabel htmlFor="email">Adresse email</FieldLabel>
            <InputWrapper>
              <InputIcon>
                <Mail size={16} />
              </InputIcon>
              <StyledInput
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
                required
              />
            </InputWrapper>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <InputWrapper>
              <InputIcon>
                <Lock size={16} />
              </InputIcon>
              <StyledInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                style={{ paddingRight: '2.75rem' }}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </InputWrapper>
          </FieldGroup>

          {error && (
            <ErrorBanner initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
              <AlertCircle size={16} />
              {error}
            </ErrorBanner>
          )}

          <SubmitButton
            type="submit"
            disabled={loading || authLoading || !email || !password}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </SubmitButton>
        </Form>

        <BackToSite type="button" onClick={() => navigate('/')}>
          ← Retour au portfolio
        </BackToSite>
      </Card>
    </PageWrapper>
  );
}
