import type { DeepReadonly, Ref, UnwrapRef, WritableComputedRef } from 'vue';
import {
  computed,
  getCurrentInstance,
  nextTick,
  reactive,
  readonly,
  toRaw,
  unref,
  watchEffect,
} from 'vue';

import { isEqual } from 'lodash-es';

export function useRuleFormItem<T extends Recordable, K extends keyof T, V = UnwrapRef<T[K]>>(
  props: T,
  key?: K,
  changeEvent?,
  emitData?: Ref<any[]>,
): [WritableComputedRef<V>, (val: V) => void, DeepReadonly<V>];

/**
 * 表单项数据处理的 hook，方便从组件内部修改表单项数据
 * @param props 来自上层组件的表单项数据
 * @param key 监听的表单项 key
 * @param changeEvent 修改事件名称
 * @param emitData 触发修改事件时，额外传递的数据
 * @returns
 */
export function useRuleFormItem<T extends Recordable>(
  props: T,
  key: keyof T = 'value',
  changeEvent = 'change',
  emitData?: Ref<any[]>,
) {
  /**
   * 组件实例
   */
  const instance = getCurrentInstance();
  /**
   * 组件 emit 方法
   */
  const emit = instance?.emit;

  /**
   * 表单项数据
   */
  const innerState = reactive({
    value: props[key],
  });

  /**
   * 初始默认表单项数据(只读)
   */
  const defaultState = readonly(innerState);

  /**
   * 设置表单项数据
   * @param val 新数据
   */
  const setState = (val: UnwrapRef<T[keyof T]>): void => {
    innerState.value = val as T[keyof T];
  };

  /**
   * 监听来自上层 props 数据变化，更新表单项数据
   */
  watchEffect(() => {
    innerState.value = props[key];
  });

  /**
   * 表单项数据：监听数据变化，触发 change 事件
   * @tutorial: https://cn.vuejs.org/guide/essentials/computed.html#writable-computed
   */
  const state: any = computed({
    get() {
      return innerState.value;
    },
    set(value) {
      if (isEqual(value, defaultState.value)) return;

      innerState.value = value as T[keyof T];
      nextTick(() => {
        emit?.(changeEvent, value, ...(toRaw(unref(emitData)) || []));
      });
    },
  });

  return [state, setState, defaultState];
}
