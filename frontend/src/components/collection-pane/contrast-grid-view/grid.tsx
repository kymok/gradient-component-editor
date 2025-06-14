import { useAtomValue } from "jotai";
import { Fragment, useState } from "react";
import { activeParamIdAtom, getGradientSwatchesAtom, contrastGridReferenceColorsAtom } from "../../../store";
import { Checkbox } from "../../inputs/checkbox";
import { Toolbar } from "../../inputs/toolbar";

// Contrast ratio thresholds for WCAG standards
const WCAG = {
  AAA: 7,
  AA: 4.5,
  AA18: 3, // AA for large text
};

// Calculate relative luminance for a color
const getLuminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Calculate contrast ratio between two colors
type sRGB = [number, number, number];

const getContrastRatio = (color1: sRGB, color2: sRGB) => {
  const [r1, g1, b1] = color1;
  const [r2, g2, b2] = color2;
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

// Get accessibility level based on contrast ratio
const getAccessibilityLevel = (ratio: number) => {
  if (ratio >= WCAG.AAA) {
    return 'AAA';
  }
  if (ratio >= WCAG.AA) {
    return 'AA';
  }
  if (ratio >= WCAG.AA18) {
    return 'AA18';
  }
  return 'Fail';
};

export const ContrastGridContent = (props: { id?: string }) => {
  const idAtomValue = useAtomValue(activeParamIdAtom);
  const id = props.id ?? idAtomValue;
  const colors = useAtomValue(getGradientSwatchesAtom(id));

  // Filter states
  const [showAAA, setShowAAA] = useState(true);
  const [showAA, setShowAA] = useState(true);
  const [showAA18, setShowAA18] = useState(true);
  const [showFail, setShowFail] = useState(true);

  // Filter function
  const shouldShowContrast = (level: string) => {
    switch (level) {
      case 'AAA': return showAAA;
      case 'AA': return showAA;
      case 'AA18': return showAA18;
      case 'Fail': return showFail;
      default: return true;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {/* Contrast grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `auto repeat(${colors.swatches.length}, 1fr)`,
        gap: '1px',
      }}>
        {/* Header row */}
        <div /> {/* Empty corner cell */}
        {colors.swatches.map((color, i) => (
          <div
            key={`header-${i}`}
            className="border border-border-primary-alpha"
            style={{
              backgroundColor: color.serializedColor,
              padding: '8px',
              textAlign: 'center',
              minWidth: '60px',
              minHeight: '30px',
            }}
          />
        ))}

        {/* Grid rows */}
        {useAtomValue(contrastGridReferenceColorsAtom).map((rowColor, i) => (
          <Fragment key={`row-${i}`}>
            {/* Row header */}
            <div
              className="border border-border-primary-alpha"
              style={{
                backgroundColor: `rgb(${rowColor.r * 255}, ${rowColor.g * 255}, ${rowColor.b * 255})`,
                padding: '8px',
                minWidth: '30px',
                minHeight: '45px',
              }}
            />

            {/* Contrast cells */}
            {colors.swatches.map((colColor, j) => {
              const ratio = getContrastRatio(
                [rowColor.r, rowColor.g, rowColor.b],
                [colColor.srgb.r, colColor.srgb.g, colColor.srgb.b]
              );
              const level = getAccessibilityLevel(ratio);

              return shouldShowContrast(level) ? (
                <div
                  key={`cell-${i}-${j}`}
                  className="flex flex-col justify-center text-center align-middle"
                >
                  <div className="text-text-primary">
                    {ratio.toFixed(2)}
                  </div>
                  <div className={`text-xs ${level === 'Fail' ? 'text-text-error' : 'text-text-secondary'}`}>
                    {level}
                  </div>
                </div>
              ) : <div
                key={`empty-${i}-${j}`}
              />;
            })}
          </Fragment>
        ))}
      </div>
      {/* Filter checkboxes */}
      <Toolbar>
        <Checkbox
          label="AAA"
          checked={showAAA}
          onCheckedChange={(checked) => setShowAAA(checked === true)}
        />
        <Checkbox
          label="AA"
          checked={showAA}
          onCheckedChange={(checked) => setShowAA(checked === true)}
        />
        <Checkbox
          label="AA18"
          checked={showAA18}
          onCheckedChange={(checked) => setShowAA18(checked === true)}
        />
        <Checkbox
          label="Fail"
          checked={showFail}
          onCheckedChange={(checked) => setShowFail(checked === true)}
        />
        <div style={{ flexGrow: 1 }} />
      </Toolbar>
    </div>
  );
};
