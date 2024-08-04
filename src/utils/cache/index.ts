/**
 * @description 缓存相关
 */
import { DEFAULT_CACHE_TIME, SHOULD_ENABLE_STORAGE_ENCRYPTION } from '@/settings/encryptionSetting';
import { getStorageShortName } from '@/utils/env';
import { createStorage as create, CreateStorageParams } from './storageCache';

export type Options = Partial<CreateStorageParams>;

/**
 * @description 创建控制缓存对象的选项
 */
const createOptions = (storage: Storage, options: Options = {}): Options => {
  return {
    // No encryption in debug mode
    hasEncrypt: SHOULD_ENABLE_STORAGE_ENCRYPTION,
    storage,
    prefixKey: getStorageShortName(),
    ...options,
  };
};

export const WebStorage = create(createOptions(sessionStorage));

/**
 * 创建控制缓存对象
 * @param storage 缓存方式
 * @param options 配置选项
 * @description 默认使用 sessionStorage 缓存
 */
export const createStorage = (storage: Storage = sessionStorage, options: Options = {}) => {
  return create(createOptions(storage, options));
};
/**
 * 创建基于 sessionStorage 的缓存控制实例
 * @param options 配置选项
 */
export const createSessionStorage = (options: Options = {}) => {
  return createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME });
};

/**
 * @description 创建基于 localStorage 的控制缓存对象
 */
export const createLocalStorage = (options: Options = {}) => {
  return createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME });
};

export default WebStorage;
