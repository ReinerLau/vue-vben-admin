/**
 * // [x]
 * @description: 为组件提供样式相关的属性的 hook
 */
import { useAppProviderContext } from '@/components/Application';

export function useDesign(scope: string) {
  const values = useAppProviderContext();

  return {
    prefixCls: `${values.prefixCls}-${scope}`,
    prefixVar: values.prefixCls,
  };
}
