import { PROCESS } from '@/constants/content';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import ProcessStep from './components/ProcessStep';

export default function Process() {
  return (
    <Section id="process" className="bg-white">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow={PROCESS.eyebrow}
            title={PROCESS.heading}
            align="left"
          />
          <ol className="mt-2">
            {PROCESS.steps.map((step, i) => (
              <ProcessStep key={step.number} step={step} index={i} />
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}