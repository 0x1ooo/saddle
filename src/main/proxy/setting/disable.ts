import { IProxySetting } from 'main/proxy/setting/base';

export class Disable implements IProxySetting {
  readonly win32Args = ['off'];
}
