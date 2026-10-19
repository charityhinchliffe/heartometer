export type AlcoholStatus = "none" | "occasional" | "regular";
export type Gender = "female" | "male";

export type HeartometerInput = {
  age: number;
  systolic: number;
  sugarMmol: number;
  alcohol: AlcoholStatus;
  gender: Gender;
};

/**
 * Preview weighting so the try-out page can return a chance from the five
 * inputs. Replace this with the trained model when it is connected.
 */
export function estimateChance(input: HeartometerInput): number {
  const alcohol = { none: 0, occasional: 0.25, regular: 0.55 }[input.alcohol];
  const gender = { female: 0, male: 0.35 }[input.gender];
  const score =
    -2.2 +
    0.03 * (input.age - 40) +
    0.018 * (input.systolic - 120) +
    0.22 * (input.sugarMmol - 5.5) +
    alcohol +
    gender;
  const probability = 1 / (1 + Math.exp(-score));
  const percent = Math.round(probability * 100);
  return Math.min(92, Math.max(3, percent));
}
