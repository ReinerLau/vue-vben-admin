import { useAppProviderContext } from '@/components/Application';

/**
 * 定义样式作用域的 hook
 * @param scope - 自定义样式作用域标识
 * @returns {Object} result - 一个对象
 * @returns {string} result.prefixCls - 样式作用域类名 = 样式作用域前缀 + 自定义作用域标识
 * @returns {string} result.prefixVar - 样式作用域前缀，默认为 vben
 */
export function useDesign(scope: string) {
  const values = useAppProviderContext();

  return {
    prefixCls: `${values.prefixCls}-${scope}`,
    prefixVar: values.prefixCls,
  };
}
