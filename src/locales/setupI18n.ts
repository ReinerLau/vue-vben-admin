/**
 * @description i18n configuration
 */
import type { App } from 'vue';
import type { I18nOptions } from 'vue-i18n';

import { localeSetting } from '@/settings/localeSetting';
import { useLocaleStoreWithOut } from '@/store/modules/locale';
import { createI18n } from 'vue-i18n';
import { setHtmlPageLang, setLoadLocalePool } from './helper';

const { fallback, availableLocales } = localeSetting;

/**
 * vue-i18n 实例
 */
export let i18n: ReturnType<typeof createI18n>;

/**
 * 创建 i18n 配置
 */
async function createI18nOptions(): Promise<I18nOptions> {
  const localeStore = useLocaleStoreWithOut();
  /**
   * 当前语言
   */
  const locale = localeStore.getLocale;
  const defaultLocal = await import(`./lang/${locale}.ts`);
  const message = defaultLocal.default?.message ?? {};

  setHtmlPageLang(locale);
  setLoadLocalePool((loadLocalePool) => {
    loadLocalePool.push(locale);
  });

  return {
    legacy: false,
    locale,
    fallbackLocale: fallback,
    messages: {
      [locale]: message,
    },
    availableLocales: availableLocales,
    sync: true, //If you don’t want to inherit locale from global scope, you need to set sync of i18n component option to false.
    silentTranslationWarn: true, // true - warning off
    missingWarn: false,
    silentFallbackWarn: true,
  };
}

/**
 * 初始化 i18n 实例并注册到 vue 应用上
 * @param app vue 应用实例
 */
export async function setupI18n(app: App) {
  const options = await createI18nOptions();
  i18n = createI18n(options);
  app.use(i18n);
}
