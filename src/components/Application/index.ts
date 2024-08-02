/**
 * @description 提供应用层级公共组件和上下文 hook 的入口文件
 */
import { withInstall } from '@/utils';

import appDarkModeToggle from './src/AppDarkModeToggle.vue';
import appLocalePicker from './src/AppLocalePicker.vue';
import appLogo from './src/AppLogo.vue';
import appProvider from './src/AppProvider.vue';
import appSearch from './src/search/AppSearch.vue';

export { useAppProviderContext } from './src/useAppContext';

export const AppLogo = withInstall(appLogo);
// TODO
export const AppProvider = withInstall(appProvider);
export const AppSearch = withInstall(appSearch);
export const AppLocalePicker = withInstall(appLocalePicker);
export const AppDarkModeToggle = withInstall(appDarkModeToggle);
