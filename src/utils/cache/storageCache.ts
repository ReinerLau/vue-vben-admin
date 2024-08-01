/**
 * @description storage 缓存相关
 */
import { cacheCipher } from '@/settings/encryptionSetting';
import { Encryption, EncryptionFactory, EncryptionParams } from '@/utils/cipher';
import { isNil } from '@/utils/is';

export interface CreateStorageParams extends EncryptionParams {
  prefixKey: string;
  storage: Storage;
  hasEncrypt: boolean;
  timeout?: Nullable<number>;
}

/**
 * @description 创建控制缓存对象
 */
export const createStorage = ({
  prefixKey = '',
  storage = sessionStorage,
  key = cacheCipher.key,
  iv = cacheCipher.iv,
  timeout = null,
  hasEncrypt = true,
}: Partial<CreateStorageParams> = {}) => {
  if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
    throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!');
  }

  /**
   * @description AES 加密器
   */
  const persistEncryption: Encryption = EncryptionFactory.createAesEncryption({
    key: cacheCipher.key,
    iv: cacheCipher.iv,
  });
  /**
   * Cache class
   * Construction parameters can be passed into sessionStorage, localStorage,
   * @class Cache
   * @example
   */
  const WebStorage = class WebStorage {
    private storage: Storage;
    private prefixKey?: string;
    private encryption: Encryption;
    private hasEncrypt: boolean;
    /**
     *
     * @param {*} storage
     */
    constructor() {
      this.storage = storage;
      this.prefixKey = prefixKey;
      this.encryption = persistEncryption;
      this.hasEncrypt = hasEncrypt;
    }

    /**
     * @description 对缓存 key 进行处理并获取
     * @param key 缓存 key
     * @returns 带有前缀的缓存 key(大写)
     */
    private getKey(key: string) {
      return `${this.prefixKey}${key}`.toUpperCase();
    }

    /**
     * @description 设置缓存
     * @param key 缓存 key
     * @param value 缓存 value
     * @param expire 过期时长
     */
    set(key: string, value: any, expire: number | null = timeout) {
      /**
       * @description 未加密前的缓存数据
       */
      const stringData = JSON.stringify({
        value,
        /**
         * @description 缓存时的时间戳
         */
        time: Date.now(),
        /**
         * @description Lodash.isNil() 方法是一个用来检查 value 是否为 null 或者 undefined 的方法。
         * @description 最终时间戳为当前时间戳 + 过期时长, 要么为 null
         */
        expire: !isNil(expire) ? new Date().getTime() + expire * 1000 : null,
      });
      /**
       * @description 是否对缓存数据进行加密
       */
      const stringifyValue = this.hasEncrypt ? this.encryption.encrypt(stringData) : stringData;
      /**
       * @description 设置缓存
       * @deprecated 先对缓存 key 进行处理
       */
      this.storage.setItem(this.getKey(key), stringifyValue);
    }

    /**
     * @description 读取缓存
     */
    get(key: string, def: any = null): any {
      const val = this.storage.getItem(this.getKey(key));
      if (!val) return def;

      try {
        const decVal = this.hasEncrypt ? this.encryption.decrypt(val) : val;
        const data = JSON.parse(decVal);
        const { value, expire } = data;
        if (isNil(expire) || expire >= new Date().getTime()) {
          return value;
        }
        this.remove(key);
      } catch (e) {
        return def;
      }
    }

    /**
     * Delete cache based on key
     * @param {string} key
     * @memberof Cache
     */
    remove(key: string) {
      this.storage.removeItem(this.getKey(key));
    }

    /**
     * Delete all caches of this instance
     */
    clear(): void {
      this.storage.clear();
    }
  };
  return new WebStorage();
};
