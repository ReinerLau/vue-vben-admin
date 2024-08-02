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
      // TODO
      const isMobile = ref(false);
      const isSetState = ref(false);

      const appStore = useAppStore();

      // Monitor screen breakpoint information changes
      createBreakpointListen(({ screenMap, sizeEnum, width }) => {
        const lgWidth = screenMap.get(sizeEnum.LG);
        if (lgWidth) {
          isMobile.value = width.value - 1 < lgWidth;
        }
        handleRestoreState();
      });

      const { prefixCls } = toRefs(props);

      createAppProviderContext({ prefixCls, isMobile });

      /**
       * Used to maintain the state before the window changes
       */
      function handleRestoreState() {
        if (unref(isMobile)) {
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
