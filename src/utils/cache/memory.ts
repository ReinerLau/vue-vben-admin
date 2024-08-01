export interface Cache<V = any> {
  value?: V;
  timeoutId?: ReturnType<typeof setTimeout>;
  time?: number;
  alive?: number;
}

const NOT_ALIVE = 0;

/**
 * @description 内存缓存控制类
 */
export class Memory<T = any, V = any> {
  /**
   * 缓存对象
   */
  private cache: { [key in keyof T]?: Cache<V> } = {};
  /**
   * @description 缓存存活时间
   */
  private alive: number;

  constructor(alive = NOT_ALIVE) {
    // Unit second
    this.alive = alive * 1000;
  }

  get getCache() {
    return this.cache;
  }

  setCache(cache) {
    this.cache = cache;
  }

  // get<K extends keyof T>(key: K) {
  //   const item = this.getItem(key);
  //   const time = item?.time;
  //   if (!isNil(time) && time < new Date().getTime()) {
  //     this.remove(key);
  //   }
  //   return item?.value ?? undefined;
  // }

  /**
   * @description 从内存中获取缓存
   * @param key 缓存 key
   */
  get<K extends keyof T>(key: K) {
    return this.cache[key];
  }

  /**
   * @description 在内存中设置缓存
   * @param key 缓存 key
   * @param value 缓存 value
   * @param expires 过期时间
   */
  set<K extends keyof T>(key: K, value: V, expires?: number) {
    /**
     * @description 设置缓存前先查看对应缓存是否已存在
     */
    let item = this.get(key);

    /**
     * @description 如果过期时间不存在或者小于等于 0，则将过期时间设置为默认值
     */
    if (!expires || (expires as number) <= 0) {
      expires = this.alive;
    }
    /**
     * @description 如果缓存存在，则清除对缓存的过期时间计算
     * @description 如果缓存不存在，则创建缓存对象
     */
    if (item) {
      if (item.timeoutId) {
        clearTimeout(item.timeoutId);
        item.timeoutId = undefined;
      }
      item.value = value;
    } else {
      item = { value, alive: expires };
      this.cache[key] = item;
    }
    /**
     * @description 这句好像是多余的
     */
    if (!expires) {
      return value;
    }
    const now = new Date().getTime();
    /**
     * @description setTimout 最大延迟时间为 2,147,483,647 ms
     * @tutorial https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value
     */
    item.time = expires > now ? expires : now + expires;
    /**
     * @description 设置缓存过期时间
     */
    item.timeoutId = setTimeout(
      () => {
        this.remove(key);
      },
      expires > now ? expires - now : expires,
    );

    return value;
  }
  /**
   * @description 从内存中删除缓存
   * @param key 缓存 key
   */
  remove<K extends keyof T>(key: K) {
    const item = this.get(key);
    Reflect.deleteProperty(this.cache, key);
    if (item) {
      clearTimeout(item.timeoutId!);
      return item.value;
    }
  }

  resetCache(cache: { [K in keyof T]: Cache }) {
    Object.keys(cache).forEach((key) => {
      const k = key as any as keyof T;
      const item = cache[k];
      if (item && item.time) {
        const now = new Date().getTime();
        const expire = item.time;
        if (expire > now) {
          this.set(k, item.value, expire);
        }
      }
    });
  }

  clear() {
    Object.keys(this.cache).forEach((key) => {
      const item = this.cache[key];
      item.timeoutId && clearTimeout(item.timeoutId);
    });
    this.cache = {};
  }
}
