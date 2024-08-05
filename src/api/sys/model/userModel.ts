/**
 * 登录参数
 */
export interface LoginParams {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
}

export interface RoleInfo {
  roleName: string;
  /**
   * 角色值
   */
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  /**
   * 登录后的 token
   */
  token: string;
  roles: RoleInfo[];
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  /**
   * 角色列表
   */
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  /**
   * 用户真实名字
   */
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}
