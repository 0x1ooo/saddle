import { M2R, ProxyUICommand, R2M } from '@common/ipc-protocol';
import { ipcRenderer } from 'electron';
import React from 'react';
import { hot } from 'react-hot-loader';
import log from 'renderer/log';
import { asset } from 'renderer/utils/assets-helper';
import './app.scss';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={asset('/img/logo.svg')} className="App-logo" alt="logo" />
      <p>
        Ready to go!{' '}
        <span role="img" aria-label="cheers!">
          🍻️
        </span>
      </p>
      <p>
        Edit <code>src/App.tsx</code> and save to reload!
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
      <button type="button" onClick={start}>
        启动/重启
      </button>
      <button type="button" onClick={stop}>
        停止
      </button>
    </header>
  </div>
);

function start() {
  ipcRenderer.send(R2M.PROXY_COMMAND, ProxyUICommand.Global);
}
function stop() {
  ipcRenderer.send(R2M.PROXY_COMMAND, ProxyUICommand.Disable);
}

ipcRenderer.on(M2R.PROXY_BUSY, () => log.ui().info('[trojan] busy'));
ipcRenderer.on(M2R.PROXY_ENABLED, () => log.ui().info('[trojan] running'));
ipcRenderer.on(M2R.PROXY_DISABLED, () => log.ui().info('[trojan] stopped'));
ipcRenderer.on(M2R.PROXY_ERROR, (_, err) => log.ui().error('[trojan]', err));

export default hot(module)(App) as () => JSX.Element;
