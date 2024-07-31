import { registerPiniaPersistPlugin } from '@/store/plugin/persist';
import { createPinia } from 'pinia';
import type { App } from 'vue';

const store = createPinia();
registerPiniaPersistPlugin(store);

/**
 * 注册 Pinia 插件
 * @param app vue 应用实例
 */
export function setupStore(app: App<Element>) {
  app.use(store);
}

export { store };
