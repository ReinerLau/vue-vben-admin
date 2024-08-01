import type { GlobEnvConfig } from '#/config';
import { API_ADDRESS } from '@/enums/cacheEnum';
import pkg from '../../package.json';

/**
 * @description 生成缓存 key 前缀
 * @example VBEN_ADMIN__DEVELOPMENT
 */
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

/**
 * @description 获取环境变量配置
 * @returns result.VITE_GLOB_APP_TITLE 网站标题
 * @returns result.VITE_GLOB_API_URL 接口地址
 * @returns result.VITE_GLOB_API_URL_PREFIX 接口地址前缀
 * @returns result.VITE_GLOB_UPLOAD_URL 文件上传接口地址
 */
export function getAppEnvConfig() {
  /**
   * @description import.meta.env.VITE_GLOB_APP_TITLE 是从 .env 文件中读取的环境变量
   * @tutorial https://cn.vitejs.dev/guide/env-and-mode.html#env-variables
   * @tutorial https://cn.vitejs.dev/guide/env-and-mode.html#env-files
   * @description 以 VITE_GLOB_* 开头的的变量，在打包的时候，会被加入_app.config.js配置文件当中
   * @description VITE_GLOB_APP_TITLE 环境变量指的是网站标题
   * @tutorial https://doc.vvbin.cn/guide/settings.html#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E9%85%8D%E7%BD%AE
   */
  const ENV_NAME = getVariableName(import.meta.env.VITE_GLOB_APP_TITLE);

  /**
   * @description import.meta.env.DEV 是 Vite 内置的环境变量，用于判断当前环境是否是开发环境
   * @tutorial https://cn.vitejs.dev/guide/env-and-mode.html#env-variables
   * @description 如果是在开发环境，那么直接使用 import.meta.env 读取本地 .env 文件环境变量, 如果是生产环境，那么使用 window[ENV_NAME] 读取打包后 _app.config.js 注入的全局变量
   * @tutorial https://doc.vvbin.cn/guide/settings.html#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E9%85%8D%E7%BD%AE
   */
  const ENV = import.meta.env.DEV
    ? (import.meta.env as unknown as GlobEnvConfig)
    : (window[ENV_NAME] as unknown as GlobEnvConfig);

  const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL_PREFIX, VITE_GLOB_UPLOAD_URL } = ENV;

  /**
   * @description 从环境变量中获取接口地址
   * @tutorial https://doc.vvbin.cn/guide/settings.html#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E9%85%8D%E7%BD%AE
   */
  let { VITE_GLOB_API_URL } = ENV;

  /**
   * @description  从缓存中获取接口地址, 因为用户可能会从页面上修改接口地址
   */
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
 * @description: 从环境变量中获取运行模式
 * @returns: 运行模式
 * @example: production
 * @example: development
 * @tutorial https://cn.vitejs.dev/guide/env-and-mode.html#env-variables
 * @tutorial https://cn.vitejs.dev/guide/env-and-mode.html#modes
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * @description: 应用是否运行在开发环境
 * @tutorial https://cn.vitejs.dev/guide/env-and-mode.html#env-variables
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
