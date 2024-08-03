import { useDebounceFn, useThrottleFn } from '@vueuse/core';
import type { Ref } from 'vue';
import { ref, unref, watch } from 'vue';

export type RemoveEventFn = () => void;
export interface UseEventParams {
  /**
   * 监听元素
   */
  el?: Element | Ref<Element | undefined> | Window | any;
  /**
   * 事件名称
   */
  name: string;
  /**
   * 事件监听函数
   */
  listener: EventListener;
  /**
   * addEventListener 选项
   */
  options?: boolean | AddEventListenerOptions;
  /**
   * 监听元素变化后是否自动清除对旧元素的事件监听
   */
  autoRemove?: boolean;
  /**
   * 是否使用防抖
   */
  isDebounce?: boolean;
  /**
   * 防抖时间或节流频率
   * @description 没有设置则不使用防抖或节流
   * @description 默认 80ms
   */
  wait?: number;
}

/**
 * 增加事件监听相关 hook
 */
export function useEventListener({
  el = window,
  name,
  listener,
  options,
  autoRemove = true,
  isDebounce = true,
  wait = 80,
}: UseEventParams): { removeEvent: RemoveEventFn } {
  /* eslint-disable-next-line */
  let remove: RemoveEventFn = () => {};
  const isAddRef = ref(false);

  if (el) {
    /**
     * 监听元素
     */
    const element = ref(el as Element) as Ref<Element>;
    /**
     * 监听函数
     * @description 默认使用防抖，否则使用节流
     */
    const handler = isDebounce ? useDebounceFn(listener, wait) : useThrottleFn(listener, wait);
    /**
     * 实际的事件处理函数
     * @description 如果不需要防抖或者节流，则直接使用监听函数
     */
    const realHandler = wait ? handler : listener;
    const removeEventListener = (e: Element) => {
      isAddRef.value = true;
      e.removeEventListener(name, realHandler, options);
    };
    /**
     * 添加事件监听
     * @param e 监听元素
     */
    const addEventListener = (e: Element) => {
      e.addEventListener(name, realHandler, options);
    };

    const removeWatch = watch(
      element,
      (v, _ov, cleanUp) => {
        if (v) {
          !unref(isAddRef) && addEventListener(v);
          /**
           * 清理掉对旧元素的事件监听
           * @tutorial https://www.cnblogs.com/zychuan/p/17130858.html
           */
          cleanUp(() => {
            autoRemove && removeEventListener(v);
          });
        }
      },
      { immediate: true },
    );

    remove = () => {
      removeEventListener(element.value);
      removeWatch();
    };
  }
  return { removeEvent: remove };
}
