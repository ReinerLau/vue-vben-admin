import { withInstall } from '@/utils';
import countButton from './src/CountButton.vue';
import countdownInput from './src/CountdownInput.vue';

/**
 * 倒计时输入框组件
 */
export const CountdownInput = withInstall(countdownInput);
export const CountButton = withInstall(countButton);
