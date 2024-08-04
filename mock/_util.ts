// Interface data format used to return a unified format
import { ResultEnum } from '@/enums/httpEnum';

/**
 * 请求成功的返回结果
 * @param result 响应结果
 * @param param1.message 响应消息
 */
export function resultSuccess<T = Recordable>(result: T, { message = 'ok' } = {}) {
  return {
    code: ResultEnum.SUCCESS,
    result,
    message,
    type: 'success',
  };
}

export function resultPageSuccess<T = any>(
  page: number,
  pageSize: number,
  list: T[],
  { message = 'ok' } = {},
) {
  const pageData = pagination(page, pageSize, list);

  return {
    ...resultSuccess({
      items: pageData,
      total: list.length,
    }),
    message,
  };
}

/**
 * 请求错误的响应结果结果
 * @param message 请求错误信息
 * @param param1
 */
export function resultError(
  message = 'Request failed',
  { code = ResultEnum.ERROR, result = null } = {},
) {
  return {
    code,
    result,
    message,
    type: 'error',
  };
}

export function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const offset = (pageNo - 1) * Number(pageSize);
  return offset + Number(pageSize) >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + Number(pageSize));
}

export interface requestParams {
  method: string;
  body: any;
  /**
   * 头信息
   */
  headers?: {
    /**
     * token
     */
    authorization?: string;
  };
  query: any;
}

/**
 * 从请求数据中获取 token
 */
export function getRequestToken({ headers }: requestParams): string | undefined {
  return headers?.authorization;
}
