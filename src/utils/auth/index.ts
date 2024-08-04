import { CacheTypeEnum, TOKEN_KEY } from '@/enums/cacheEnum';
import projectSetting from '@/settings/projectSetting';
import { BasicKeys, Persistent } from '@/utils/cache/persistent';

const { permissionCacheType } = projectSetting;
/**
 * 是否使用 localStorage 缓存
 */
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getToken() {
  return getAuthCache(TOKEN_KEY);
}
/**
 * 获取权限相关数据缓存
 * @param key 缓存key
 */
export function getAuthCache<T>(key: BasicKeys) {
  /**
   * 根据配置使用对应的缓存方式
   */
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}
/**
 * 设置权限相关数据的缓存
 * @param key 缓存 key
 * @param value 缓存值
 */
export function setAuthCache(key: BasicKeys, value) {
  /**
   * 根据配置使用对应的缓存函数
   */
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}
