import {
  readonly as defineReadonly,
  inject,
  InjectionKey,
  provide,
  reactive,
  UnwrapRef,
} from 'vue';

export interface CreateContextOptions {
  /**
   * 是否只读
   */
  readonly?: boolean;
  /**
   * 是否创建 provider
   */
  createProvider?: boolean;
  /**
   * 是否使用原生的上下文，不做响应式处理
   */
  native?: boolean;
}

type ShallowUnwrap<T> = {
  [P in keyof T]: UnwrapRef<T[P]>;
};

/**
 * 祖先组件提供上下文
 * @param context 祖先组件提供的上下文
 * @param key 祖先组件提供的 key
 * @param options 配置项
 * @tutorial https://cn.vuejs.org/api/composition-api-dependency-injection.html#provide
 */
export function createContext<T>(
  context: any,
  key: InjectionKey<T> = Symbol(),
  options: CreateContextOptions = {},
) {
  const { readonly = true, createProvider = true, native = false } = options;

  /**
   * 响应式上下文
   */
  const state = reactive(context);
  /**
   * 可能只读的响应式上下文
   */
  const provideData = readonly ? defineReadonly(state) : state;
  createProvider && provide(key, native ? context : provideData);

  return {
    state,
  };
}

export function useContext<T>(key: InjectionKey<T>, native?: boolean): T;

/**
 * 注入来自祖先组件的值
 * @param key - 祖先组件提供的 key
 * @param defaultValue - 祖先组件未提供时的默认值
 * @returns 返回祖先组件提供的值
 * @tutorial https://cn.vuejs.org/api/composition-api-dependency-injection.html#inject
 */
export function useContext<T>(
  key: InjectionKey<T> = Symbol(),
  defaultValue?: any,
): ShallowUnwrap<T> {
  return inject(key, defaultValue || {});
}
