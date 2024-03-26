import { TSettings } from '@/schemas';
import { CurrencyType, LocaleType } from '@prisma/client';
import { create } from 'zustand';

interface SettingsState {
    settings: TSettings;
    setSettings: (settings: Partial<TSettings>) => void;
}

const useSettingsStore = create<SettingsState>((set) => ({
    settings: {
        id: '',
        currencyType: CurrencyType.ARS,
        localeType: LocaleType.es_AR,
        cashReserves: 0,
    },
    setSettings: (newSettings) => set((state) => ({ ...state, settings: { ...state.settings, ...newSettings } })),
}));

export default useSettingsStore;