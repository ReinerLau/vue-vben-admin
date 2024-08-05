import { renderQrCode } from './drawCanvas';
import { drawLogo } from './drawLogo';
import { RenderQrCodeParams } from './typing';
/**
 * 渲染二维码到 canvas 上
 * @param options 配置项
 */
export const toCanvas = (options: RenderQrCodeParams) => {
  return renderQrCode(options)
    .then(() => {
      return options;
    })
    .then(drawLogo) as Promise<string>;
};
