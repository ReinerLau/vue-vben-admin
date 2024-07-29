import { createContext, useContext } from '@/hooks/core/useContext';
import { InjectionKey, Ref } from 'vue';

export interface AppProviderContextProps {
  prefixCls: Ref<string>;
  isMobile: Ref<boolean>;
}

/**
 * 注入来自 AppProvider 组件的上下文时使用的 key
 */
const key: InjectionKey<AppProviderContextProps> = Symbol();

/**
 * AppProvider 组件提供上下文
 * @param context - 要提供的上下文
 * @returns 响应式处理后的上下文
 */
export function createAppProviderContext(context: AppProviderContextProps) {
  return createContext<AppProviderContextProps>(context, key);
}

/**
 * 获取来自 AppProvider 组件的上下文
 * @returns AppProvider 组件提供的上下文
 */
export function useAppProviderContext() {
  return useContext<AppProviderContextProps>(key);
}
