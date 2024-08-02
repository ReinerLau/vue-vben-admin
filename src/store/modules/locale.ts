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
  /**
   * 当前国际化配置
   */
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
    /**
     * 获取当前语言
     * @example 默认为 zh_CN
     */
    getLocale(state): LocaleType {
      return state.localInfo?.locale ?? 'zh_CN';
    },
  },
  actions: {
    /**
     * 设置国际化配置并缓存
     * @param info 新的国际化配置
     */
    setLocaleInfo(info: Partial<LocaleSetting>) {
      this.localInfo = { ...this.localInfo, ...info };
      ls.set(LOCALE_KEY, this.localInfo);
    },
    /**
     * 初始化国际化配置，合并默认配置和缓存中的配置
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
