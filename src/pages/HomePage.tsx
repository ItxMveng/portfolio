import { SEOHead } from '../components/layout/SEOHead';
import { BlogPreviewSection } from '../components/sections/BlogPreviewSection';
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
      <BlogPreviewSection />
      <ContactSection />
    </>
  );
}
