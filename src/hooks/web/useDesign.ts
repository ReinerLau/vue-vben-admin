import { useAppProviderContext } from '@/components/Application';

/**
 * 定义样式命名空间的 hook
 * @param scope - 命名空间标识
 */
export function useDesign(scope: string) {
  /**
   * 来自 AppProvider 组件的上下文
   */
  const values = useAppProviderContext();

  return {
    /**
     * 命名空间类名前缀: 全局类名前缀 + 命名空间标识
     */
    prefixCls: `${values.prefixCls}-${scope}`,
    /**
     * 前缀变量：全局类名前缀
     */
    prefixVar: values.prefixCls,
  };
}
