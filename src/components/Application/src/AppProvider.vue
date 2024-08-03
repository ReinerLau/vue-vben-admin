<script lang="ts">
  import { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum';
  import { createBreakpointListen } from '@/hooks/event/useBreakpoint';
  import { prefixCls } from '@/settings/designSetting';
  import { useAppStore } from '@/store/modules/app';
  import { defineComponent, ref, toRefs, unref } from 'vue';
  import { createAppProviderContext } from './useAppContext';

  const props = {
    /**
     * 类名前缀
     * @example 默认为 vben
     */
    prefixCls: { type: String, default: prefixCls },
  };

  export default defineComponent({
    name: 'AppProvider',
    inheritAttrs: false,
    props,
    setup(props, { slots }) {
      /**
       * 是否为移动端
       */
      const isMobile = ref(false);
      /**
       * 是否已经设置了移动端下的状态
       */
      const isSetState = ref(false);

      const appStore = useAppStore();

      createBreakpointListen(({ screenMap, sizeEnum, width }) => {
        const lgWidth = screenMap.get(sizeEnum.LG);
        if (lgWidth) {
          // 当前屏幕宽度小于 lgWidth 时为移动端
          isMobile.value = width.value - 1 < lgWidth;
        }
        handleRestoreState();
      });

      const { prefixCls } = toRefs(props);

      createAppProviderContext({ prefixCls, isMobile });

      /**
       * PC和移动端切换后对菜单重新配置
       */
      function handleRestoreState() {
        if (unref(isMobile)) {
          // 从PC切换到移动端
          if (!unref(isSetState)) {
            isSetState.value = true;
            const {
              menuSetting: {
                type: menuType,
                mode: menuMode,
                collapsed: menuCollapsed,
                split: menuSplit,
              },
            } = appStore.getProjectConfig;
            appStore.setProjectConfig({
              menuSetting: {
                type: MenuTypeEnum.SIDEBAR,
                mode: MenuModeEnum.INLINE,
                split: false,
              },
            });
            appStore.setBeforeMiniInfo({ menuMode, menuCollapsed, menuType, menuSplit });
          }
        } else {
          // 从移动端切换到PC
          if (unref(isSetState)) {
            isSetState.value = false;
            const { menuMode, menuCollapsed, menuType, menuSplit } = appStore.getBeforeMiniInfo;
            appStore.setProjectConfig({
              menuSetting: {
                type: menuType,
                mode: menuMode,
                collapsed: menuCollapsed,
                split: menuSplit,
              },
            });
          }
        }
      }
      /**
       * @tutorial https://cn.vuejs.org/guide/extras/render-function.html#rendering-slots
       */
      return () => slots.default?.();
    },
  });
</script>
