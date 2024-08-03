import type {
  HeaderSetting,
  MenuSetting,
  MultiTabsSetting,
  ProjectConfig,
  TransitionSetting,
} from '#/config';
import type { ApiAddress, BeforeMiniState } from '#/store';

import { store } from '@/store';
import { defineStore } from 'pinia';

import { ThemeEnum } from '@/enums/appEnum';
import { API_ADDRESS, APP_DARK_MODE_KEY, PROJ_CFG_KEY } from '@/enums/cacheEnum';
import { resetRouter } from '@/router';
import { darkMode } from '@/settings/designSetting';
import { deepMerge } from '@/utils';
import { Persistent } from '@/utils/cache/persistent';

interface AppState {
  /**
   * @description 主题
   */
  darkMode?: ThemeEnum;
  // Page loading status
  pageLoading: boolean;
  /**
   * @description 项目配置
   */
  projectConfig: ProjectConfig | null;
  /**
   * 切换到移动端前的菜单配置
   */
  beforeMiniInfo: BeforeMiniState;
}
let timeId: TimeoutHandle;

/**
 * @description 应用相关配置 store
 */
export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    darkMode: undefined,
    pageLoading: false,
    projectConfig: Persistent.getLocal(PROJ_CFG_KEY),
    beforeMiniInfo: {},
  }),
  getters: {
    getPageLoading(state): boolean {
      return state.pageLoading;
    },
    /**
     * @description 获取主题配置
     * @description 获取优先级：当前状态 -> localStorage -> 默认配置
     * @param state 当前状态
     * @returns 'light' | 'dark' | string
     */
    getDarkMode(state): 'light' | 'dark' | string {
      return state.darkMode || localStorage.getItem(APP_DARK_MODE_KEY) || darkMode;
    },
    /**
     * 获取切换到移动端前的菜单配置
     */
    getBeforeMiniInfo(state): BeforeMiniState {
      return state.beforeMiniInfo;
    },
    /**
     * 从内存中获取项目配置
     */
    getProjectConfig(state): ProjectConfig {
      return state.projectConfig || ({} as ProjectConfig);
    },

    getHeaderSetting(): HeaderSetting {
      return this.getProjectConfig.headerSetting;
    },
    getMenuSetting(): MenuSetting {
      return this.getProjectConfig.menuSetting;
    },
    getTransitionSetting(): TransitionSetting {
      return this.getProjectConfig.transitionSetting;
    },
    getMultiTabsSetting(): MultiTabsSetting {
      return this.getProjectConfig.multiTabsSetting;
    },
    getApiAddress() {
      return JSON.parse(localStorage.getItem(API_ADDRESS) || '{}');
    },
  },
  actions: {
    setPageLoading(loading: boolean): void {
      this.pageLoading = loading;
    },

    setDarkMode(mode: ThemeEnum): void {
      this.darkMode = mode;
      localStorage.setItem(APP_DARK_MODE_KEY, mode);
    },
    /**
     * 缓存切换到移动端前的菜单配置
     * @param state 切换到移动端前的菜单配置
     */
    setBeforeMiniInfo(state: BeforeMiniState): void {
      this.beforeMiniInfo = state;
    },
    /**
     * @description 缓存新的项目配置到内存中
     * @param config 新的项目配置
     */
    setProjectConfig(config: DeepPartial<ProjectConfig>): void {
      this.projectConfig = deepMerge(this.projectConfig || {}, config) as ProjectConfig;
      Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig);
    },
    setMenuSetting(setting: Partial<MenuSetting>): void {
      this.projectConfig!.menuSetting = deepMerge(this.projectConfig!.menuSetting, setting);
      Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig);
    },

    async resetAllState() {
      resetRouter();
      Persistent.clearAll();
    },
    async setPageLoadingAction(loading: boolean): Promise<void> {
      if (loading) {
        clearTimeout(timeId);
        // Prevent flicker
        timeId = setTimeout(() => {
          this.setPageLoading(loading);
        }, 50);
      } else {
        this.setPageLoading(loading);
        clearTimeout(timeId);
      }
    },
    setApiAddress(config: ApiAddress): void {
      localStorage.setItem(API_ADDRESS, JSON.stringify(config));
    },
  },
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store);
}
