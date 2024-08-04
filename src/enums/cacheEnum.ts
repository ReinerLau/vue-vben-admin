// token key
export const TOKEN_KEY = 'TOKEN__';

/**
 * @description 缓存国际化相关配置的 key
 */
export const LOCALE_KEY = 'LOCALE__';

/**
 * 用户信息缓存 key
 */
export const USER_INFO_KEY = 'USER__INFO__';

/**
 * 缓存角色值列表的 key
 */
export const ROLES_KEY = 'ROLES__KEY__';

/**
 * @description 项目配置的缓存 key
 */
export const PROJ_CFG_KEY = 'PROJ__CFG__KEY__';

/**
 * @description 将接口地址存储在localStorage中的key
 */
export const API_ADDRESS = 'API_ADDRESS__';

// lock info
export const LOCK_INFO_KEY = 'LOCK__INFO__KEY__';

export const MULTIPLE_TABS_KEY = 'MULTIPLE_TABS__KEY__';

/**
 * @description 当前主题的缓存 key
 */
export const APP_DARK_MODE_KEY = '__APP__DARK__MODE__';

/**
 * @description 存储到 localStorage 中所有内存缓存的key
 */
export const APP_LOCAL_CACHE_KEY = 'COMMON__LOCAL__KEY__';

/**
 * 缓存到 sessionStorage 中的 key
 */
export const APP_SESSION_CACHE_KEY = 'COMMON__SESSION__KEY__';

// table 列设置
export const TABLE_SETTING_KEY = 'TABLE__SETTING__KEY__';
/**
 * 缓存类型
 */
export enum CacheTypeEnum {
  /**
   * sessionStorage
   */
  SESSION,
  /**
   * localStorage
   */
  LOCAL,
}
