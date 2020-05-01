import { AppHub } from 'main/hub/app';
import exampleConfig from './app.example.config.json';

let hub: AppHub;
beforeEach(() => {
  hub = new AppHub();
});
it('load AppConfig from raw JSON correctly', async () => {
  const raw = JSON.stringify(exampleConfig);
  hub.loadConfig(raw);
  expect(hub.appConfig).toEqual(exampleConfig);
});
