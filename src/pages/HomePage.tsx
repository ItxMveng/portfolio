import { SEOHead } from '../components/layout/SEOHead';
import { BlogPreviewSection } from '../components/sections/BlogPreviewSection';
import { CertificationsSection } from '../components/sections/CertificationsSection';
import { ContactSection } from '../components/sections/ContactSection';
import { HeroSection } from '../components/sections/HeroSection';
import { ProjectsPreviewSection } from '../components/sections/ProjectsPreviewSection';
import { ServicesSection } from '../components/sections/ServicesSection';

export default function HomePage() {
  return (
    <>
      <SEOHead />
      <HeroSection />
      <ServicesSection />
      <ProjectsPreviewSection />
      <CertificationsSection />
      <BlogPreviewSection />
      <ContactSection />
    </>
  );
}
