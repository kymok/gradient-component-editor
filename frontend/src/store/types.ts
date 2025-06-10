import { CurveControlPoint } from "../utils/curve";
import { LinearControlPoint } from "../utils/linear";
import { z } from "zod";

// Zod schemas
export const matchingMethodSchema = z.enum(["lightness", "color"]);
export const oklabSchema = z.tuple([z.number(), z.number(), z.number()]);
export const oklchSchema = z.tuple([z.number(), z.number(), z.number()]);

export const referenceInternalSchema = z.object({
  id: z.string(),
  color: z.string(), // e.g. "rgb(0 183 195)"
  matchingMethod: matchingMethodSchema,
});

export const matchingErrorSchema = z.object({
  deltaL: z.number(),
  deltaC: z.number(),
  deltaHdeg: z.number(),
});

export const matchSchema = z.object({
  t: z.number(),
  distance: z.number(),
  color: oklabSchema,
  matchingError: matchingErrorSchema,
  isError: z.boolean(),
});

export const referenceSchema = referenceInternalSchema.extend({
  oklabColor: oklabSchema,
  match: matchSchema,
});

export const shadeGeneratorParameterSchema = z.object({
  id: z.string(),
  name: z.string(),
  sampler: z.array(z.custom<LinearControlPoint<null>>()),
  references: z.array(referenceInternalSchema),
  lightness: z.array(z.custom<CurveControlPoint>()),
  chroma: z.array(z.custom<CurveControlPoint>()),
  hue: z.array(z.custom<CurveControlPoint>()),
});

export const contrastGridReferenceColorSchema = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number(),
  color: z.string(), // e.g. "rgb(255, 255, 255)"
  name: z.string(),
});

export const contrastGridReferenceColorInternalSchema = z.object({
  color: z.string(), // e.g. "rgb(255, 255, 255)"
  name: z.string(),
});

export const importDataSchema = z.object({
  parameters: z.array(shadeGeneratorParameterSchema),
  activeParamId: z.string(),
  contrastGridReferenceColors: z.array(contrastGridReferenceColorInternalSchema),
});


// Types using z.infer
export type MatchingMethod = z.infer<typeof matchingMethodSchema>;
export type Oklab = z.infer<typeof oklabSchema>;
export type Oklch = z.infer<typeof oklchSchema>;
export type ReferenceInternal = z.infer<typeof referenceInternalSchema>;
export type MatchingError = z.infer<typeof matchingErrorSchema>;
export type Match = z.infer<typeof matchSchema>;
export type Reference = z.infer<typeof referenceSchema>;
export type ShadeGeneratorParameter = z.infer<typeof shadeGeneratorParameterSchema>;
export type ImportData = z.infer<typeof importDataSchema>;
export type ContrastGridReferenceColor = z.infer<typeof contrastGridReferenceColorSchema>;
export type ContrastGridReferenceColorInternal = z.infer<typeof contrastGridReferenceColorInternalSchema>;