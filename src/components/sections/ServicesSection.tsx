import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SectionLabel, SectionTitle } from '../../components/ui';
import { useServices } from '../../hooks/useServices';
import { defaultViewport, fadeUp, staggerContainer, staggerItem } from '../../lib/animations';

/* Section 2 → off-white */
const Section = styled.section`
  padding: 6rem 0;
  position: relative;
  background: ${({ theme }) => theme.colors.bgSecondary};

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, ${({ theme }) => theme.colors.divider} 30%, ${({ theme }) => theme.colors.divider} 70%, transparent);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) { padding: 0 2rem; }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const SectionDesc = styled(motion.p)`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;

const ServicesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) { grid-template-columns: repeat(3, 1fr); }
`;

const ServiceCard = styled(motion.div)`
  position: relative;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 1.875rem;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s cubic-bezier(0.16,1,0.3,1);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(to right, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.teal});
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent}33;
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-6px) scale(1.01);
    &::after { opacity: 1; }
  }
`;

const ServiceIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}33;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.375rem;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);

  ${ServiceCard}:hover & {
    background: ${({ theme }) => theme.colors.accentDimHover};
    transform: scale(1.1) rotate(-4deg);
  }
`;

const ServiceTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em;
`;

const ServiceTagline = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 500;
`;

const ServiceDesc = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  flex: 1;
`;

const ServiceBullets = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const ServiceBullet = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accent};
    flex-shrink: 0;
    margin-top: 0.45em;
  }
`;

const ServiceWorkflow = styled.div`
  padding: 0.55rem 0.825rem;
  background: ${({ theme }) => theme.colors.bgTertiary};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.72rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.02em;
`;

const ServiceCTA = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  margin-top: auto;
  cursor: pointer;
  transition: gap ${({ theme }) => theme.transitions.fast};

  &:hover { gap: 0.65rem; }
`;

const BottomRow = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
  flex-wrap: wrap;
`;

const CTAPrimary = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  box-shadow: ${({ theme }) => theme.shadows.accent};
  transition: all 0.25s cubic-bezier(0.16,1,0.3,1);

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: ${({ theme }) => theme.shadows.accentStrong};
    transform: translateY(-2px) scale(1.02);
  }
`;

const CTASecondary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.9375rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1.5px solid ${({ theme }) => theme.colors.surfaceBorder};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.base};
  text-decoration: none;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-2px);
  }
`;

function TiltCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [4, -4]);
  const rotateY = useTransform(x, [-50, 50], [-4, 4]);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (r.left + r.width / 2));
        y.set(e.clientY - (r.top + r.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

export function ServicesSection() {
  const { services, loading } = useServices();
  if (loading || services.length === 0) return null;

  return (
    <Section id="services">
      <Container>
        <SectionHeader>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
          >
            <SectionLabel>Ce que je fais</SectionLabel>
            <SectionTitle>
              Trois expertises, une seule <span>ambition</span>
            </SectionTitle>
            <SectionDesc variants={staggerItem}>
              Du développement d&apos;application à l&apos;automatisation intelligente — chaque
              prestation crée de la valeur mesurable.
            </SectionDesc>
          </motion.div>
        </SectionHeader>

        <ServicesGrid
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {services.map((service) => (
            <TiltCard key={service.id}>
              <ServiceCard variants={staggerItem}>
                <ServiceIcon>{service.icon}</ServiceIcon>
                <div>
                  <ServiceTitle>{service.title}</ServiceTitle>
                  <ServiceTagline>{service.tagline}</ServiceTagline>
                </div>
                <ServiceDesc>{service.description}</ServiceDesc>
                <ServiceBullets>
                  {service.bullets.map((b, i) => (
                    <ServiceBullet key={i}>{b}</ServiceBullet>
                  ))}
                </ServiceBullets>
                {service.workflow && <ServiceWorkflow>{service.workflow}</ServiceWorkflow>}
                {service.cta_label && (
                  <ServiceCTA
                    href={service.cta_url || '#contact'}
                    onClick={(e) => {
                      if (!service.cta_url) {
                        e.preventDefault();
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {service.cta_label} <ArrowUpRight size={14} />
                  </ServiceCTA>
                )}
              </ServiceCard>
            </TiltCard>
          ))}
        </ServicesGrid>

        <BottomRow variants={fadeUp} initial="hidden" whileInView="visible" viewport={defaultViewport}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <CTAPrimary
              type="button"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Démarrer un projet <ArrowUpRight size={16} />
            </CTAPrimary>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <CTASecondary to="/projects">Voir mes réalisations</CTASecondary>
          </motion.div>
        </BottomRow>
      </Container>
    </Section>
  );
}
