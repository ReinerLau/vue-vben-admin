import { useGlobSetting } from '@/hooks/setting';
import { useI18n } from '@/hooks/web/useI18n';
import { REDIRECT_NAME } from '@/router/constant';
import { useLocaleStore } from '@/store/modules/locale';
import { useTitle as usePageTitle } from '@vueuse/core';
import { unref, watch } from 'vue';
import { useRouter } from 'vue-router';

/**
 * 监听页面变化，动态修改站点标题
 */
export function useTitle() {
  const { title } = useGlobSetting();
  const { t } = useI18n();
  const { currentRoute } = useRouter();
  const localeStore = useLocaleStore();

  const pageTitle = usePageTitle();

  watch(
    [() => currentRoute.value.path, () => localeStore.getLocale],
    () => {
      const route = unref(currentRoute);

      if (route.name === REDIRECT_NAME) {
        return;
      }

      const tTitle = t(route?.meta?.title as string);
      pageTitle.value = tTitle ? ` ${tTitle} - ${title} ` : `${title}`;
    },
    { immediate: true },
  );
}
