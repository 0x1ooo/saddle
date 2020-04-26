import * as React from 'react';
import { hot } from 'react-hot-loader';

const App = () => (
  <div>
    <h1>Your Electron App!~~</h1>
  </div>
);

export default hot(module)(App) as () => JSX.Element;
