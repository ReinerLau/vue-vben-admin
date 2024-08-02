/**
 * Multi-language related operations
 */
import type { LocaleType } from '#/config';

import { useLocaleStoreWithOut } from '@/store/modules/locale';
import { Locale } from 'ant-design-vue/es/locale';
import { computed, unref } from 'vue';
import { loadLocalePool, setHtmlPageLang } from './helper';
import { i18n } from './setupI18n';

interface LangModule {
  message: Recordable;
  dateLocale: Recordable;
  dateLocaleName: string;
}

function setI18nLanguage(locale: LocaleType) {
  const localeStore = useLocaleStoreWithOut();

  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    (i18n.global.locale as any).value = locale;
  }
  localeStore.setLocaleInfo({ locale });
  setHtmlPageLang(locale);
}

export function useLocale() {
  const localeStore = useLocaleStoreWithOut();
  /**
   * 当前语言
   */
  const getLocale = computed(() => localeStore.getLocale);
  const getShowLocalePicker = computed(() => localeStore.getShowPicker);

  const getAntdLocale = computed((): any => {
    /**
     * 获取当前语言对应的一系列映射
     */
    const localeMessage = i18n.global.getLocaleMessage<{ antdLocale: Locale }>(unref(getLocale));
    return localeMessage?.antdLocale ?? {};
  });

  // Switching the language will change the locale of useI18n
  // And submit to configuration modification
  async function changeLocale(locale: LocaleType) {
    const globalI18n = i18n.global;
    const currentLocale = unref(globalI18n.locale);
    if (currentLocale === locale) {
      return locale;
    }

    if (loadLocalePool.includes(locale)) {
      setI18nLanguage(locale);
      return locale;
    }
    const langModule = ((await import(`./lang/${locale}.ts`)) as any).default as LangModule;
    if (!langModule) return;

    const { message } = langModule;

    globalI18n.setLocaleMessage(locale, message);
    loadLocalePool.push(locale);

    setI18nLanguage(locale);
    return locale;
  }

  return {
    getLocale,
    /**
     * 是否显示语言切换组件
     */
    getShowLocalePicker,
    changeLocale,
    /**
     * 获取当前语言下 antd 组件的一系列映射
     */
    getAntdLocale,
  };
}
