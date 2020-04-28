import { ProxyUICommand } from '../../@common/ipc-protocol/r2m';
import { proxyService } from './proxy';
import { Disable, Global, PAC } from './setting';

test('load proxy setting on command', async () => {
  const cmds = [
    [ProxyUICommand.Disable, new Disable()],
    [ProxyUICommand.Global, new Global('', 0)],
    [ProxyUICommand.PAC, new PAC('')],
  ];
  cmds.forEach(async (cmd) => {
    const setting = await proxyService.loadSetting(cmd[0]);
    expect(typeof setting).toEqual(typeof cmd[1]);
  });
});
