import { IProxySetting } from 'main/proxy/setting/base';

export class PAC implements IProxySetting {
  constructor(readonly url: string) {}

  get win32Args(): string[] {
    return ['pac', this.url];
  }
}
