import type { LocaleSetting, LocaleType } from '#/config';

import { store } from '@/store';
import { defineStore } from 'pinia';

import { LOCALE_KEY } from '@/enums/cacheEnum';
import { localeSetting } from '@/settings/localeSetting';
import { createLocalStorage } from '@/utils/cache';

/**
 * @description 基于 localStorage 的控制缓存对象
 */
const ls = createLocalStorage();

/**
 * @description 国际化相关配置
 * @example 应用首次加载，尝试从 localeStorage 缓存中读取 key 为 VBEN_ADMIN__DEVELOPMENT__2.11.5__LOCALE__ 的国际化相关配置，没有读取到，使用默认配置
 * @example 应用再次加载，从 localeStorage 缓存中读取 key 为 VBEN_ADMIN__DEVELOPMENT__2.11.5__LOCALE__ 的国际化相关配置
 */
const lsLocaleSetting = (ls.get(LOCALE_KEY) || localeSetting) as LocaleSetting;

interface LocaleState {
  localInfo: LocaleSetting;
}

/**
 * @description 国际化 store
 */
export const useLocaleStore = defineStore({
  id: 'app-locale',
  state: (): LocaleState => ({
    localInfo: lsLocaleSetting,
  }),
  getters: {
    /**
     * 是否显示语言切换组件
     * @example 默认为 true 表示显示
     */
    getShowPicker(state): boolean {
      return !!state.localInfo?.showPicker;
    },
    getLocale(state): LocaleType {
      return state.localInfo?.locale ?? 'zh_CN';
    },
  },
  actions: {
    /**
     * Set up multilingual information and cache
     * @param info multilingual info
     */
    setLocaleInfo(info: Partial<LocaleSetting>) {
      this.localInfo = { ...this.localInfo, ...info };
      ls.set(LOCALE_KEY, this.localInfo);
    },
    /**
     * Initialize multilingual information and load the existing configuration from the local cache
     */
    initLocale() {
      this.setLocaleInfo({
        ...localeSetting,
        ...this.localInfo,
      });
    },
  },
});

// Need to be used outside the setup
export function useLocaleStoreWithOut() {
  return useLocaleStore(store);
}
