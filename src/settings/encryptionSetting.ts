import { isDevMode } from '@/utils/env';

// System default cache time, in seconds
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

// aes encryption key
export const cacheCipher = {
  key: '_11111000001111@',
  iv: '@11111000001111_',
};

// Whether the system cache is encrypted using aes
/**
 * @description 缓存是否使用 aes 加密, 默认生产环境下开启
 */
export const SHOULD_ENABLE_STORAGE_ENCRYPTION = !isDevMode();
