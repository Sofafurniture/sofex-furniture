import {
  BACK_DETAILS,
  CUSHION_DETAILS,
  FABRIC_DETAILS,
  MODEL_DETAILS,
  type SofaConfiguration,
} from './sofa-data';

export interface PriceBreakdown {
  baseFramePrice: number;
  cushionPremium: number;
  backPremium: number;
  total: number;
}

export function calculatePrice(config: SofaConfiguration): PriceBreakdown {
  const base = MODEL_DETAILS[config.model].basePrice;
  const cushionPremium = CUSHION_DETAILS[config.cushionType].premium;
  const backPremium = BACK_DETAILS[config.backStyle].premium;

  return {
    baseFramePrice: base,
    cushionPremium,
    backPremium,
    total: base + cushionPremium + backPremium,
  };
}

export function getColorName(config: SofaConfiguration): string {
  const fabric = FABRIC_DETAILS[config.fabricQuality];
  return fabric.colors.find((c) => c.id === config.fabricColorId)?.name ?? fabric.colors[0].name;
}

export function buildOrderDescription(config: SofaConfiguration): string {
  const model = MODEL_DETAILS[config.model].name;
  const fabric = FABRIC_DETAILS[config.fabricQuality].name;
  const color = getColorName(config);
  const cushion = CUSHION_DETAILS[config.cushionType].name;
  const back = BACK_DETAILS[config.backStyle].name;
  return `${model} — 3 Seater — ${fabric} (${color}) — ${cushion} — ${back}`;
}
