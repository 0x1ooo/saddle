import { R2M } from '@common/ipc-protocol';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faTimes,
  faWindowMaximize,
  faWindowMinimize,
  faWindowRestore,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, IconButton, styled, withTheme } from '@material-ui/core';
import { ipcRenderer, remote } from 'electron';
import defaults from 'lodash/defaults';
import React from 'react';
import { FrameFlag } from 'renderer/components/frame/define';
import { asset } from 'renderer/utils/assets-helper';

interface WindowButtonProps {
  icon: IconProp;
  onClick: () => void;
}

const SharpButton = styled(IconButton)({ borderRadius: 0, fontSize: 16 });

function WindowButton(props: WindowButtonProps) {
  return (
    <SharpButton
      onClick={props.onClick}
      color="primary"
      className="window-interact"
    >
      <FontAwesomeIcon icon={props.icon} />
    </SharpButton>
  );
}

export interface TitleBarOptions {
  frameFlags?: number;
}

const defaultOptions: TitleBarOptions = {
  frameFlags: FrameFlag.Main,
};

interface TitleBarState {
  options: TitleBarOptions;
  isMaximized: boolean;
}

/** The title bar of an app window which intends to replace the native app bar. */
class TitleBar extends React.PureComponent<TitleBarOptions, TitleBarState> {
  private _resizeListener?: any;

  constructor(props: TitleBarOptions) {
    super(props);
    this.state = {
      options: defaults({}, props, defaultOptions),
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
      <Box display="flex" alignItems="stretch" paddingX={1}>
        {this._hasFrameFlag(FrameFlag.Icon) ? (
          <Box marginRight={0.5} display="flex">
            <img src={asset('/img/logo.svg')} width={32} alt="App Logo" />
          </Box>
        ) : null}
        {this._hasFrameFlag(FrameFlag.Title) ? (
          <Box alignItems="center" display="flex">
            {document.title}
          </Box>
        ) : null}
        <Box flex="1 1 auto" />
        {this._hasFrameFlag(FrameFlag.Minimize) ? (
          <WindowButton
            icon={faWindowMinimize}
            onClick={TitleBar._onMinimize}
          />
        ) : null}
        {this._hasFrameFlag(FrameFlag.Maximize) ? (
          <WindowButton
            icon={this.state.isMaximized ? faWindowRestore : faWindowMaximize}
            onClick={TitleBar._onMaximize}
          />
        ) : null}
        {this._hasFrameFlag(FrameFlag.Close) ? (
          <WindowButton icon={faTimes} onClick={TitleBar._onClose} />
        ) : null}
      </Box>
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

  private _hasFrameFlag(flag: FrameFlag): boolean {
    if (!this.state || !this.state.options || !this.state.options.frameFlags) {
      return false;
    }
    return (this.state.options.frameFlags & flag) === flag;
  }
}

export default withTheme(TitleBar);
