import { IProxySetting } from 'main/proxy/setting/base';

export class Global implements IProxySetting {
  constructor(
    readonly host: string,
    readonly port: number,
    readonly noProxyFor?: string[]
  ) {}

  get win32Args(): string[] {
    const args = ['global', `${this.host}:${this.port}`];
    if (this.noProxyFor && this.noProxyFor.length > 0) {
      args.push(this.noProxyFor.join(';'));
    }
    return args;
  }
}
