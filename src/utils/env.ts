import type { GlobEnvConfig } from '#/config';
import { API_ADDRESS } from '@/enums/cacheEnum';
import pkg from '../../package.json';

export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_TITLE } = getAppEnvConfig();
  return `${VITE_GLOB_APP_TITLE.replace(/\s/g, '_')}__${getEnv()}`.toUpperCase();
}

// Generate cache key according to version
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}
/**
 * 基于标题转换成变量名, 用于访问生产环境全局变量
 * @param title 要转换成十六进制字符串的标题
 * @returns 以 __PRODUCTION__xxx_CONF__ 格式的字符串
 * @tutorial https://doc.vvbin.cn/guide/settings.html#%E8%AF%B4%E6%98%8E
 */
const getVariableName = (title: string) => {
  /**
   * 将字符串转换成16进制字符串, 为了加密
   * @param str 要转换的字符串
   * @returns 16进制字符串
   */
  function strToHex(str: string) {
    const result: string[] = [];
    for (let i = 0; i < str.length; ++i) {
      // 每个字符转换成 Unicode 编码后转成 16 进制字符串
      const hex = str.charCodeAt(i).toString(16);
      // 是为了保证每个十六进制字符都是 4 位，方便还原成原始字符串
      result.push(('000' + hex).slice(-4));
    }
    // 每个字符转成十六进制后拼接成字符串, 大写可要可不要
    return result.join('').toUpperCase();
  }
  return `__PRODUCTION__${strToHex(title) || '__APP'}__CONF__`.toUpperCase().replace(/\s/g, '');
};

export function getAppEnvConfig() {
  const ENV_NAME = getVariableName(import.meta.env.VITE_GLOB_APP_TITLE);
  const ENV = import.meta.env.DEV
    ? // Get the global configuration (the configuration will be extracted independently when packaging)
      (import.meta.env as unknown as GlobEnvConfig)
    : (window[ENV_NAME] as unknown as GlobEnvConfig);
  const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL_PREFIX, VITE_GLOB_UPLOAD_URL } = ENV;
  let { VITE_GLOB_API_URL } = ENV;
  if (localStorage.getItem(API_ADDRESS)) {
    const address = JSON.parse(localStorage.getItem(API_ADDRESS) || '{}');
    if (address?.key) VITE_GLOB_API_URL = address?.val;
  }
  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
  };
}

/**
 * @description: Development mode
 */
export const devMode = 'development';

/**
 * @description: Production mode
 */
export const prodMode = 'production';

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}
