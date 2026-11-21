import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Language, TRANSLATIONS, type Translations } from "@/lib/i18n/translations";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
      t: (key: keyof Translations) => {
        const lang = get().language || "en";
        const currentDict = TRANSLATIONS[lang] || TRANSLATIONS.en;
        return currentDict[key] || TRANSLATIONS.en[key] || String(key);
      },
    }),
    {
      name: "farmconnect-language",
      partialize: (state) => ({ language: state.language }),
    }
  )
);
