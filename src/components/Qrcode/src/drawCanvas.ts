import { cloneDeep } from 'lodash-es';
import type { QRCodeRenderersOptions } from 'qrcode';
import { toCanvas } from 'qrcode';
import { ContentType, RenderQrCodeParams } from './typing';
/**
 * 渲染二维码到 canvas 上
 */
export const renderQrCode = ({
  canvas,
  content,
  width = 0,
  options: params = {},
}: RenderQrCodeParams) => {
  /**
   * 深拷贝后的 qrcode 配置项
   */
  const options = cloneDeep(params);
  // 容错率，默认对内容少的二维码采用高容错率，内容多的二维码采用低容错率
  options.errorCorrectionLevel = options.errorCorrectionLevel || getErrorCorrectionLevel(content);
  return getOriginWidth(content, options).then((_width: number) => {
    options.scale = width === 0 ? undefined : (width / _width) * 4;
    return toCanvas(canvas, content, options);
  });
};
/**
 * 得到原QrCode的大小，以便缩放得到正确的QrCode大小
 * @param content 扫二维码后的内容
 * @param options qrcode 配置
 */
function getOriginWidth(content: ContentType, options: QRCodeRenderersOptions) {
  /**
   * canvas 元素
   */
  const _canvas = document.createElement('canvas');
  return toCanvas(_canvas, content, options).then(() => _canvas.width);
}

/**
 * 根据内容获取 qrcode 容错率配置
 * @description 对于内容少的QrCode，增大容错率
 * @param content 扫二维码后的内容
 */
function getErrorCorrectionLevel(content: ContentType) {
  if (content.length > 36) {
    return 'M';
  } else if (content.length > 16) {
    return 'Q';
  } else {
    return 'H';
  }
}
