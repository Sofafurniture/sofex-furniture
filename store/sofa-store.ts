import { create } from 'zustand';
import { FABRIC_DETAILS, type BackStyle, type CushionType, type FabricQuality, type SofaConfiguration, type SofaModel } from '@/lib/sofa-data';
import { DEFAULT_CATEGORY_INDEX } from '@/lib/configurator-catalog';

interface ConfiguratorStore {
  config: SofaConfiguration;
  isPriceBreakdownOpen: boolean;
  setModel: (model: SofaModel) => void;
  setCategoryIndex: (index: number) => void;
  setFabricQuality: (quality: FabricQuality) => void;
  setFabricColor: (colorId: string) => void;
  setCushionType: (type: CushionType) => void;
  setBackStyle: (style: BackStyle) => void;
  togglePriceBreakdown: () => void;
}

export const useSofaStore = create<ConfiguratorStore>((set) => ({
  config: {
    model: 'brooklyn',
    categoryIndex: DEFAULT_CATEGORY_INDEX,
    fabricQuality: 'standard-linen',
    fabricColorId: 'lin-ivory',
    cushionType: 'foam-wrap',
    backStyle: 'normal',
  },
  isPriceBreakdownOpen: false,
  setModel: (model) =>
    set((state) => {
      const defaultColor = FABRIC_DETAILS[state.config.fabricQuality].colors[0].id;
      return { config: { ...state.config, model, fabricColorId: defaultColor } };
    }),
  setCategoryIndex: (categoryIndex) => set((state) => ({ config: { ...state.config, categoryIndex } })),
  setFabricQuality: (fabricQuality) =>
    set((state) => ({
      config: {
        ...state.config,
        fabricQuality,
        fabricColorId: FABRIC_DETAILS[fabricQuality].colors[0].id,
      },
    })),
  setFabricColor: (fabricColorId) => set((state) => ({ config: { ...state.config, fabricColorId } })),
  setCushionType: (cushionType) => set((state) => ({ config: { ...state.config, cushionType } })),
  setBackStyle: (backStyle) => set((state) => ({ config: { ...state.config, backStyle } })),
  togglePriceBreakdown: () => set((state) => ({ isPriceBreakdownOpen: !state.isPriceBreakdownOpen })),
}));
