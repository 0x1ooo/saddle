import { M2R, R2M } from '@common/ipc-protocol';
import { ipcRenderer } from 'electron';
import React from 'react';
import { hot } from 'react-hot-loader';
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
  ipcRenderer.send(R2M.START_TROJAN);
}
function stop() {
  ipcRenderer.send(R2M.STOP_TROJAN);
}

ipcRenderer.on(M2R.TROJAN_BUSY, () => console.log('[trojan] busy'));
ipcRenderer.on(M2R.TROJAN_STARTED, () => console.log('[trojan] running'));
ipcRenderer.on(M2R.TROJAN_STOPPED, () => console.log('[trojan] stopped'));
ipcRenderer.on(M2R.TROJAN_ERROR, (_, err) => console.error('[trojan]', err));

export default hot(module)(App) as () => JSX.Element;
