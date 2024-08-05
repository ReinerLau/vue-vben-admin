import { RoleEnum } from '@/enums/roleEnum';

export {};

declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    /**
     * 路由顺序
     */
    orderNo?: number;
    // title
    title: string;
    // dynamic router level.
    dynamicLevel?: number;
    // dynamic router real route path (For performance).
    realPath?: string;
    // Whether to ignore permissions
    ignoreAuth?: boolean;
    /**
     * 拥有该路由权限的角色列表
     */
    roles?: RoleEnum[];
    // Whether not to cache
    ignoreKeepAlive?: boolean;
    /**
     * 是否固定在标签栏上
     */
    affix?: boolean;
    // icon on tab
    icon?: string;
    // img on tab
    img?: string;
    frameSrc?: string;
    // current page transition
    transitionName?: string;
    // Whether the route has been dynamically added
    hideBreadcrumb?: boolean;
    /**
     * 是否隐藏子菜单
     */
    hideChildrenInMenu?: boolean;
    // Carrying parameters
    carryParam?: boolean;
    /**
     * 是否只有一个子菜单
     */
    single?: boolean;
    // Currently active menu
    currentActiveMenu?: string;
    // Never show in tab
    hideTab?: boolean;
    /**
     * 是否隐藏菜单
     */
    hideMenu?: boolean;
    isLink?: boolean;
    /**
     * 是否仅用于菜单生成，不存进路由表
     */
    ignoreRoute?: boolean;
    /**
     * 隐藏子菜单路径
     */
    hidePathForChildren?: boolean;
  }
}
