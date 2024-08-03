import { screenEnum, screenMap, sizeEnum } from '@/enums/breakpointEnum';
import { useEventListener } from '@/hooks/event/useEventListener';
import { computed, ComputedRef, ref, unref } from 'vue';

// 可以用这个替换，优化项
// import { Grid } from 'ant-design-vue';
// const { useBreakpoint } = Grid;

/**
 * 当前尺寸
 */
let globalScreenRef: ComputedRef<sizeEnum | undefined>;
/**
 * 当前尺寸对应的最大屏幕宽度
 */
let globalWidthRef: ComputedRef<number>;
/**
 * 当前实际屏幕宽度
 */
let globalRealWidthRef: ComputedRef<number>;

export interface CreateCallbackParams {
  /**
   * 当前尺寸
   */
  screen: ComputedRef<sizeEnum | undefined>;
  /**
   * 当前尺寸对应的最大屏幕宽度
   */
  width: ComputedRef<number>;
  /**
   * 当前实际屏幕宽度
   */
  realWidth: ComputedRef<number>;
  /**
   * 尺寸对应的最大屏幕宽度枚举
   */
  screenEnum: typeof screenEnum;
  /**
   * 尺寸与屏幕宽度的映射
   */
  screenMap: Map<sizeEnum, number>;
  /**
   * 尺寸枚举
   */
  sizeEnum: typeof sizeEnum;
}

export function useBreakpoint() {
  return {
    screenRef: computed(() => unref(globalScreenRef)),
    widthRef: globalWidthRef,
    screenEnum,
    realWidthRef: globalRealWidthRef,
  };
}

/**
 * 监听屏幕窗口大小调整
 * @param fn 屏幕窗口调整大小后触发的回调
 */
export function createBreakpointListen(fn?: (opt: CreateCallbackParams) => void) {
  /**
   * 尺寸
   */
  const screenRef = ref<sizeEnum>(sizeEnum.XL);
  /**
   * 实际屏幕宽度
   */
  const realWidthRef = ref(window.innerWidth);

  /**
   * 获取尺寸和实际屏幕宽度
   */
  function getWindowWidth() {
    const width = document.body.clientWidth;
    const xs = screenMap.get(sizeEnum.XS)!;
    const sm = screenMap.get(sizeEnum.SM)!;
    const md = screenMap.get(sizeEnum.MD)!;
    const lg = screenMap.get(sizeEnum.LG)!;
    const xl = screenMap.get(sizeEnum.XL)!;
    if (width < xs) {
      screenRef.value = sizeEnum.XS;
    } else if (width < sm) {
      screenRef.value = sizeEnum.SM;
    } else if (width < md) {
      screenRef.value = sizeEnum.MD;
    } else if (width < lg) {
      screenRef.value = sizeEnum.LG;
    } else if (width < xl) {
      screenRef.value = sizeEnum.XL;
    } else {
      screenRef.value = sizeEnum.XXL;
    }
    realWidthRef.value = width;
  }

  useEventListener({
    el: window,
    name: 'resize',

    listener: () => {
      getWindowWidth();
      resizeFn();
    },
    // wait: 100,
  });

  getWindowWidth();
  globalScreenRef = computed(() => unref(screenRef));
  globalWidthRef = computed((): number => screenMap.get(unref(screenRef)!)!);
  globalRealWidthRef = computed((): number => unref(realWidthRef));

  /**
   * 屏幕窗口调整大小后触发回调
   */
  function resizeFn() {
    fn?.({
      screen: globalScreenRef,
      width: globalWidthRef,
      realWidth: globalRealWidthRef,
      screenEnum,
      screenMap,
      sizeEnum,
    });
  }

  resizeFn();
  return {
    screenRef: globalScreenRef,
    screenEnum,
    widthRef: globalWidthRef,
    realWidthRef: globalRealWidthRef,
  };
}
