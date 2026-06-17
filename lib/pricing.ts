import {
  BACK_DETAILS,
  CUSHION_DETAILS,
  FABRIC_DETAILS,
  MODEL_DETAILS,
  type SofaConfiguration,
} from './sofa-data';
import { getConfiguratorCategory } from './configurator-catalog';

export interface PriceBreakdown {
  baseFramePrice: number;
  cushionPremium: number;
  backPremium: number;
  total: number;
  categoryLabel: string;
}

export function calculatePrice(config: SofaConfiguration): PriceBreakdown {
  const category = getConfiguratorCategory(config.categoryIndex);
  const cushionPremium = CUSHION_DETAILS[config.cushionType].premium;
  const backPremium = BACK_DETAILS[config.backStyle].premium;

  return {
    baseFramePrice: category.price,
    cushionPremium,
    backPremium,
    total: category.price + cushionPremium + backPremium,
    categoryLabel: category.label,
  };
}

export function getColorName(config: SofaConfiguration): string {
  const fabric = FABRIC_DETAILS[config.fabricQuality];
  return fabric.colors.find((c) => c.id === config.fabricColorId)?.name ?? fabric.colors[0].name;
}

export function buildOrderDescription(config: SofaConfiguration): string {
  const model = MODEL_DETAILS[config.model].name;
  const category = getConfiguratorCategory(config.categoryIndex).label;
  const fabric = FABRIC_DETAILS[config.fabricQuality].name;
  const color = getColorName(config);
  const cushion = CUSHION_DETAILS[config.cushionType].name;
  const back = BACK_DETAILS[config.backStyle].name;
  return `${model} — ${category} — ${fabric} (${color}) — ${cushion} — ${back}`;
}
