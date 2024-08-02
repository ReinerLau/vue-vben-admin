import { deepMerge } from '@/utils';
import antdLocale from 'ant-design-vue/es/locale/zh_CN';
import { genMessage } from '../helper';

/**
 * 自定义语言包
 */
const modules = import.meta.glob('./zh-CN/**/*.{json,ts,js}', { eager: true });

/**
 * 合并来自 antd 自带语言包和自定义语言包
 * @tutorial https://antdv.com/docs/vue/i18n-cn#configprovider
 */
export default {
  message: {
    ...genMessage(modules as Recordable<Recordable>, 'zh-CN'),
    antdLocale: {
      ...antdLocale,
      DatePicker: deepMerge(
        antdLocale.DatePicker,
        genMessage(modules as Recordable<Recordable>, 'zh-CN').antdLocale.DatePicker,
      ),
    },
  },
};
