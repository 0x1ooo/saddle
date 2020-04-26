import * as React from 'react';
import { hot } from 'react-hot-loader';
import asset from '../asset';
import './app.scss';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={asset('/img/logo.svg')} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload!
      </p>
      <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
        Learn React
      </a>
    </header>
  </div>
);

export default hot(module)(App) as () => JSX.Element;
