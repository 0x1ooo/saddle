import { LogLevel } from '@common/log';
import { getTrojanLogLevel, TrojanLogLevel } from '@model/trojan/define';

const levelMap = {
  [LogLevel.All]: TrojanLogLevel.All,
  [LogLevel.Trace]: TrojanLogLevel.Debug,
  [LogLevel.Debug]: TrojanLogLevel.Debug,
  [LogLevel.Info]: TrojanLogLevel.Info,
  [LogLevel.Warn]: TrojanLogLevel.Warning,
  [LogLevel.Error]: TrojanLogLevel.Error,
  [LogLevel.Fatal]: TrojanLogLevel.Fatal,
  [LogLevel.Mark]: TrojanLogLevel.Fatal,
  [LogLevel.Off]: TrojanLogLevel.None,
};

it('converts LogLevel into Trojan log_level', () => {
  Object.entries(levelMap).forEach(([ll, tl]) => {
    expect(getTrojanLogLevel(ll as LogLevel)).toBe(tl);
  });
});
