import { SERVICES } from '@/constants/content';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import ServiceCard from './components/ServiceCard';

export default function Services() {
  return (
    <Section id="services" className="bg-surface-50">
      <Container>
        <SectionHeading
          eyebrow={SERVICES.eyebrow}
          title={SERVICES.heading}
          description={SERVICES.subhead}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.items.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}