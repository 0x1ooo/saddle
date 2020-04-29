import { R2M } from '@common/ipc-protocol';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faTimes,
  faWindowMaximize,
  faWindowMinimize,
  faWindowRestore,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, styled as mStyle } from '@material-ui/core';
import { ipcRenderer, remote } from 'electron';
import assign from 'lodash/assign';
import React from 'react';
import { asset } from 'renderer/utils/assets-helper';
import styled from 'styled-components';

const DraggableBar = styled(Box)`
  -webkit-app-region: drag;
`;

interface WindowButtonProps {
  icon: IconProp;
  onClick: () => void;
}

const SharpButton = mStyle(styled(Button)`
  -webkit-app-region: no-drag;
`)({ borderRadius: 0 });

function WindowButton(props: WindowButtonProps) {
  return (
    <SharpButton onClick={props.onClick}>
      <FontAwesomeIcon icon={props.icon} />
    </SharpButton>
  );
}

export enum WindowButtonFlag {
  None = 0,
  Close = 1,
  Minimize = 2,
  Maximize = 4,
  All = Close | Minimize | Maximize,
  Toolbox = Close,
  NoMax = Close | Minimize,
}

export interface TitleBarOptions {
  noIcon?: boolean;
  noTitle?: boolean;
  buttonFlags?: number;
}

const defaultOptions: TitleBarOptions = {
  noIcon: false,
  noTitle: false,
  buttonFlags: WindowButtonFlag.All,
};

interface TitleBarState {
  options: TitleBarOptions;
  isMaximized: boolean;
}

export default class TitleBar extends React.PureComponent<
  TitleBarOptions,
  TitleBarState
> {
  private _resizeListener?: any;

  constructor(props: TitleBarOptions) {
    super(props);
    this.state = {
      options: assign(defaultOptions, props),
      isMaximized: remote.getCurrentWindow().isMaximized(),
    };
  }

  componentDidMount() {
    this._resizeListener = this._updateSizeState.bind(this);
    window.addEventListener('resize', this._resizeListener);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resizeListener);
  }

  render() {
    return (
      <DraggableBar display="flex" alignItems="stretch">
        {this.state.options.noIcon ? null : (
          <Box padding={0.5} display="flex">
            <img src={asset('/img/logo.svg')} width={32} alt="App Logo" />
          </Box>
        )}
        {this.state.options.noTitle ? null : (
          <Box alignItems="center" display="flex">
            {document.title}
          </Box>
        )}
        <Box flex="1 1 auto" />
        {this._hasButtonFlag(WindowButtonFlag.Minimize) ? (
          <WindowButton
            icon={faWindowMinimize}
            onClick={TitleBar._onMinimize}
          />
        ) : null}
        {this._hasButtonFlag(WindowButtonFlag.Maximize) ? (
          <WindowButton
            icon={this.state.isMaximized ? faWindowRestore : faWindowMaximize}
            onClick={TitleBar._onMaximize}
          />
        ) : null}
        {this._hasButtonFlag(WindowButtonFlag.Close) ? (
          <WindowButton icon={faTimes} onClick={TitleBar._onClose} />
        ) : null}
      </DraggableBar>
    );
  }

  private _updateSizeState() {
    this.setState((prev) => ({
      ...prev,
      isMaximized: remote.getCurrentWindow().isMaximized(),
    }));
  }

  private static _onClose() {
    ipcRenderer.send(R2M.WINDOW_CLOSE);
  }

  private static _onMinimize() {
    ipcRenderer.send(R2M.WINDOW_MINIMIZE);
  }

  private static _onMaximize() {
    ipcRenderer.send(R2M.WINDOW_MAXIMIZE);
  }

  private _hasButtonFlag(flag: WindowButtonFlag): boolean {
    if (!this.state || !this.state.options || !this.state.options.buttonFlags) {
      return false;
    }
    return (this.state.options.buttonFlags & flag) === flag;
  }
}
