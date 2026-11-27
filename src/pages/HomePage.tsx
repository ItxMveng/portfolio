import { SEOHead } from '../components/layout/SEOHead';
import { BlogPreviewSection } from '../components/sections/BlogPreviewSection';
import { CertificationsPreviewSection } from '../components/sections/CertificationsPreviewSection';
import { ContactSection } from '../components/sections/ContactSection';
import { HeroSection } from '../components/sections/HeroSection';
import { EducationSection } from '../components/sections/EducationSection';
import { ProjectsPreviewSection } from '../components/sections/ProjectsPreviewSection';
import { ServicesSection } from '../components/sections/ServicesSection';

export default function HomePage() {
  return (
    <>
      <SEOHead />
      <HeroSection />
      <EducationSection />
      <ServicesSection />
      <ProjectsPreviewSection />
      <CertificationsPreviewSection />
      <BlogPreviewSection />
      <ContactSection />
    </>
  );
}
