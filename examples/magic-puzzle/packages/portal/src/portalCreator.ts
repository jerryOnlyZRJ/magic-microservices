import { useProps } from '@magic-microservices/magic';
import { IDefaultPortalProps, MagicPortalElement } from './interface';
import { isPortalRegister } from './portalRegister';

export function portalElementCreator<T extends IDefaultPortalProps = IDefaultPortalProps>(
  props?: T,
): MagicPortalElement {
  // 如果还没注册过 Portal，先执行注册逻辑
  if (!isPortalRegister()) {
    throw new Error(
      'Portal did not be registered, please use `portalRegister` to register it in advance.',
    );
  }
  const serviceIns = document.createElement('magic-portal') as MagicPortalElement;
  serviceIns.style.width = '100%';
  Object.keys(props || {}).forEach((key: keyof IDefaultPortalProps) => {
    if (!props![key]) return;
    if (typeof props![key] === 'boolean' && props![key]) {
      serviceIns.setAttribute(key, '');
      return;
    }
    if (typeof props![key] === 'string') {
      serviceIns.setAttribute(key, props![key] as string);
      return;
    }
    serviceIns.setAttribute(key, useProps(props![key]));
  });
  return serviceIns;
}
