import { RoleEnum } from '@/enums/roleEnum';
import { defineComponent } from 'vue';
import type { RouteMeta, RouteRecordRaw } from 'vue-router';

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

// @ts-ignore
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  /**
   * 路由名称
   */
  name: string;
  /**
   * 路由元信息
   */
  meta: RouteMeta;
  component?: Component | string;
  components?: Component;
  /**
   * 嵌套路由列表
   */
  children?: AppRouteRecordRaw[];
  props?: Recordable;
  fullPath?: string;
}

export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success';
  content?: string;
  dot?: boolean;
}

export interface Menu {
  name: string;

  icon?: string;

  img?: string;
  /**
   * 菜单路径
   */
  path: string;

  // path contains param, auto assignment.
  paramPath?: string;

  disabled?: boolean;
  /**
   * 子菜单
   */
  children?: Menu[];

  orderNo?: number;

  roles?: RoleEnum[];

  meta?: Partial<RouteMeta>;

  tag?: MenuTag;

  hideMenu?: boolean;
}

export type MenuModule = Menu;

// export type AppRouteModule = RouteModule | AppRouteRecordRaw;
export type AppRouteModule = AppRouteRecordRaw;
