import type { AppRouteRecordRaw, Menu, MenuModule } from '@/router/types';
import { AppRouteModule } from '@/router/types';
import { findPath, treeMap } from '@/utils/helper/treeHelper';
import { isHttpUrl } from '@/utils/is';
import { cloneDeep } from 'lodash-es';
import { toRaw } from 'vue';
import { RouteParams } from 'vue-router';

export function getAllParentPath<T = Recordable>(treeData: T[], path: string) {
  const menuList = findPath(treeData, (n) => n.path === path) as Menu[];
  return (menuList || []).map((item) => item.path);
}
/**
 * 路径处理
 */
function joinParentPath(
  /**
   * 菜单列表
   */
  menus: Menu[],
  /**
   * 父路径
   */
  parentPath = '',
) {
  for (let index = 0; index < menus.length; index++) {
    /**
     * 菜单项
     */
    const menu = menus[index];
    /**
     * 这允许你利用组件嵌套，而无需使用嵌套 URL。
     * 请注意，以 / 开头的嵌套路径将被视为根路径。
     * @tutorial https://next.router.vuejs.org/guide/essentials/nested-routes.html
     */
    if (!(menu.path.startsWith('/') || isHttpUrl(menu.path))) {
      // 路径不以 / 开头，也不是 url，加入父路径
      menu.path = `${parentPath}/${menu.path}`;
    }
    if (menu?.children?.length) {
      joinParentPath(menu.children, menu.meta?.hidePathForChildren ? parentPath : menu.path);
    }
  }
}

// Parsing the menu module
export function transformMenuModule(menuModule: MenuModule): Menu {
  const menuList = [menuModule];

  joinParentPath(menuList);
  return menuList[0];
}
/**
 * 将路由转换成菜单
 * @param routeModList 路由列表
 * @param routerMapping 是否开启路由映射
 */
export function transformRouteToMenu(routeModList: AppRouteModule[], routerMapping = false) {
  /**
   * 深拷贝后的路由列表
   */
  const cloneRouteModList = cloneDeep(routeModList);
  /**
   * 需要显示菜单的路由列表
   */
  const routeList: AppRouteRecordRaw[] = [];

  // 对路由项进行修改
  cloneRouteModList.forEach(
    /**
     * @param item 菜单项
     */
    (item) => {
      if (routerMapping && item.meta.hideChildrenInMenu && typeof item.redirect === 'string') {
        item.path = item.redirect;
      }

      if (item.meta?.single) {
        /**
         * 实际菜单项
         */
        const realItem = item?.children?.[0];
        realItem && routeList.push(realItem);
      } else {
        routeList.push(item);
      }
    },
  );
  /**
   * 路由转换成菜单后的列表
   */
  const list = treeMap(routeList, {
    conversion: (node: AppRouteRecordRaw) => {
      const { meta: { hideMenu = false } = {}, name } = node;

      return {
        ...(node.meta || {}),
        meta: node.meta,
        name,
        hideMenu,
        path: node.path,
        ...(node.redirect ? { redirect: node.redirect } : {}),
      };
    },
  });
  joinParentPath(list);
  return cloneDeep(list);
}

/**
 * config menu with given params
 */
const menuParamRegex = /(?::)([\s\S]+?)((?=\/)|$)/g;

export function configureDynamicParamsMenu(menu: Menu, params: RouteParams) {
  const { path, paramPath } = toRaw(menu);
  let realPath = paramPath ? paramPath : path;
  const matchArr = realPath.match(menuParamRegex);

  matchArr?.forEach((it) => {
    const realIt = it.substr(1);
    if (params[realIt]) {
      realPath = realPath.replace(`:${realIt}`, params[realIt] as string);
    }
  });
  // save original param path.
  if (!paramPath && matchArr && matchArr.length > 0) {
    menu.paramPath = path;
  }
  menu.path = realPath;
  // children
  menu.children?.forEach((item) => configureDynamicParamsMenu(item, params));
}
