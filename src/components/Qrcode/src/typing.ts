import type { QRCodeRenderersOptions, QRCodeSegment } from 'qrcode';

/**
 * 扫二维码后的内容
 */
export type ContentType = string | QRCodeSegment[];

export type { QRCodeRenderersOptions };

export type LogoType = {
  src: string;
  logoSize: number;
  borderColor: string;
  bgColor: string;
  borderSize: number;
  crossOrigin: string;
  borderRadius: number;
  logoRadius: number;
};

export interface RenderQrCodeParams {
  /**
   * 渲染二维码的元素
   */
  canvas: any;
  /**
   * 扫二维码后的内容
   */
  content: ContentType;
  width?: number;
  /**
   * qrcode 库的配置
   */
  options?: QRCodeRenderersOptions;
  /**
   * 二维码中间图标
   */
  logo?: LogoType | string;
  image?: HTMLImageElement;
  downloadName?: string;
  download?: boolean | Fn;
}

export type ToCanvasFn = (options: RenderQrCodeParams) => Promise<unknown>;

export interface QrCodeActionType {
  download: (fileName?: string) => void;
}

export interface QrcodeDoneEventParams {
  url: string;
  ctx?: CanvasRenderingContext2D | null;
}
