import { ThemeEnum } from '@/enums/appEnum';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { theme } from 'ant-design-vue';
import { computed } from 'vue';

/**
 * 深色主题相关的 hook
 */
export function useDarkModeTheme() {
  const { getDarkMode } = useRootSetting();
  const { darkAlgorithm } = theme;
  const isDark = computed(() => getDarkMode.value === ThemeEnum.DARK);
  const darkTheme = {
    algorithm: [darkAlgorithm],
  };

  return {
    /**
     * 是否为深色模式
     */
    isDark,
    /**
     * antd 自带的深色主题算法
     * @tutorial https://antdv.com/docs/vue/customize-theme-cn#%E5%AE%9A%E5%88%B6%E4%B8%BB%E9%A2%98
     */
    darkTheme,
  };
}
