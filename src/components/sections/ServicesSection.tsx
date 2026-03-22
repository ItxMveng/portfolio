import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SectionLabel, SectionTitle } from '../../components/ui';
import { useServices } from '../../hooks/useServices';
import { defaultViewport, fadeUp, staggerContainer, staggerItem } from '../../lib/animations';

const Section = styled.section`
  padding: 6rem 0;
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 2rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const SectionDesc = styled(motion.p)`
  font-size: 1.0625rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;

const ServicesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ServiceCard = styled(motion.div)`
  position: relative;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  cursor: default;
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.base};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(124, 92, 252, 0.06),
      transparent 60%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(124, 92, 252, 0.3);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-4px);

    &::before {
      opacity: 1;
    }
  }
`;

const ServiceIconWrapper = styled.div`
  width: 52px;
  height: 52px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid rgba(124, 92, 252, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const ServiceTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em;
`;

const ServiceTagline = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 500;
`;

const ServiceDesc = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  flex: 1;
`;

const ServiceBullets = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ServiceBullet = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
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
  padding: 0.6rem 0.875rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.75rem;
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
  transition: gap ${({ theme }) => theme.transitions.fast};
  margin-top: auto;
  cursor: pointer;

  &:hover {
    gap: 0.65rem;
  }
`;

const SectionCTARow = styled(motion.div)`
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
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  text-decoration: none;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: 0 0 24px ${({ theme }) => theme.colors.accentGlow};
    transform: translateY(-1px);
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
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  text-decoration: none;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
  }
`;

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
              Trois prestations pour livrer <span>vite et proprement</span>
            </SectionTitle>
            <SectionDesc variants={staggerItem}>
              Du developpement d&apos;application a l&apos;automatisation intelligente - chaque
              prestation est pensee pour creer de la valeur mesurable.
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
            <ServiceCard
              key={service.id}
              variants={staggerItem}
              whileHover={{ y: -4, rotateX: 1.5, rotateY: -1.5 }}
              onMouseMove={(event) => {
                const card = event.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
              }}
            >
              <ServiceIconWrapper>{service.icon}</ServiceIconWrapper>

              <div>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceTagline>{service.tagline}</ServiceTagline>
              </div>

              <ServiceDesc>{service.description}</ServiceDesc>

              <ServiceBullets>
                {service.bullets.map((bullet, i) => (
                  <ServiceBullet key={`${service.id}-bullet-${i}`}>{bullet}</ServiceBullet>
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
          ))}
        </ServicesGrid>

        <SectionCTARow
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <CTAPrimary
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              type="button"
            >
              Demarrer un projet <ArrowUpRight size={16} />
            </CTAPrimary>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <CTASecondary to="/projects">Voir mes realisations</CTASecondary>
          </motion.div>
        </SectionCTARow>
      </Container>
    </Section>
  );
}
