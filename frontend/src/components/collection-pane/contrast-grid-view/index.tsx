import { Section } from "../../layout";
import { ContrastGridContent } from "./grid";

const HelpContent = () => {
  return (
    <div className="flex flex-col gap-2 max-w-sm text-sm">
      <p>
        The Contrast Grid displays the WCAG 2 contrast ratios between the gradient swatches and reference colors. You can add, remove, and reorder references.
      </p>
    </div>
  );
}

export const ContrastGrid = () => {
  return (
    <Section title="Contrast Grid" helpContent={<HelpContent />}>
      <ContrastGridContent />
    </Section>
  );
}