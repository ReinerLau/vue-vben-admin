import { isDevMode } from '@/utils/env';

// System default cache time, in seconds
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

// aes encryption key
export const cacheCipher = {
  key: '_11111000001111@',
  iv: '@11111000001111_',
};

/**
 * @description 是否缓存数据进行加密, 生产环境下开启
 */
export const SHOULD_ENABLE_STORAGE_ENCRYPTION = !isDevMode();
