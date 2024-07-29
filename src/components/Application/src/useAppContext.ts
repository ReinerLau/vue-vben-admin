/**
 * // [x]
 * @description 赋予 AppProvider 组件提供上下文能力的 hook
 */
import { createContext, useContext } from '@/hooks/core/useContext';
import { InjectionKey, Ref } from 'vue';

export interface AppProviderContextProps {
  prefixCls: Ref<string>;
  isMobile: Ref<boolean>;
}

const key: InjectionKey<AppProviderContextProps> = Symbol();

export function createAppProviderContext(context: AppProviderContextProps) {
  return createContext<AppProviderContextProps>(context, key);
}

export function useAppProviderContext() {
  return useContext<AppProviderContextProps>(key);
}
