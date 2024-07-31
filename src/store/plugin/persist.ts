/**
 * Pinia Persist Plugin
 * Pinia 持久化插件
 * @link https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/
 *
 */
import { cacheCipher, SHOULD_ENABLE_STORAGE_ENCRYPTION } from '@/settings/encryptionSetting';
import { Encryption, EncryptionFactory } from '@/utils/cipher';
import { getCommonStoragePrefix } from '@/utils/env';
import type { Pinia } from 'pinia';
import type { PersistedStateFactoryOptions } from 'pinia-plugin-persistedstate';
import { createPersistedState, Serializer } from 'pinia-plugin-persistedstate';

/**
 * @description 缓存 key 前缀
 * @example VBEN_ADMIN__DEVELOPMENT
 */
export const PERSIST_KEY_PREFIX = getCommonStoragePrefix();

/**
 * @description aes 加密器
 */
const persistEncryption: Encryption = EncryptionFactory.createAesEncryption({
  key: cacheCipher.key,
  iv: cacheCipher.iv,
});

/**
 * @description 自定义序列化器，用于序列化和反序列化存储数据
 * @param shouldEnableEncryption 是否对缓存加密, 生产环境下开启
 * @returns 带有序列化和反序列化方法的对象
 */
function customSerializer(shouldEnableEncryption: boolean): Serializer {
  if (shouldEnableEncryption) {
    return {
      deserialize: (value) => {
        /**
         * @description 解密后反序列化
         */
        const decrypted = persistEncryption.decrypt(value);
        return JSON.parse(decrypted);
      },
      serialize: (value) => {
        /**
         * @description 序列化后加密
         */
        const serialized = JSON.stringify(value);
        return persistEncryption.encrypt(serialized);
      },
    };
  } else {
    return {
      deserialize: (value) => {
        return JSON.parse(value);
      },
      serialize: (value) => {
        return JSON.stringify(value);
      },
    };
  }
}

/**
 * @description 注册 Pinia 持久化插件
 * @param pinia Pinia instance Pinia 实例
 * @tutorial https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/advanced.html#%E5%85%A8%E5%B1%80%E6%8C%81%E4%B9%85%E5%8C%96%E9%85%8D%E7%BD%AE
 */
export function registerPiniaPersistPlugin(pinia: Pinia) {
  pinia.use(createPersistedState(createPersistedStateOptions(PERSIST_KEY_PREFIX)));
}

/**
 * @description 创建持久化状态选项
 * @param keyPrefix 缓存 key 前缀
 * @returns 持久化状态选项
 */
export function createPersistedStateOptions(keyPrefix: string): PersistedStateFactoryOptions {
  return {
    storage: localStorage,
    key: (id) => `${keyPrefix}__${id}`,
    serializer: customSerializer(SHOULD_ENABLE_STORAGE_ENCRYPTION),
  };
}
