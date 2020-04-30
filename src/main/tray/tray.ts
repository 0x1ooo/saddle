import { app, Menu, Tray } from 'electron';
import { getRootMenuItems } from 'main/tray/menu';
import windowManager from 'main/window/';
import os from 'os';
import path from 'path';

let tray: Tray | null = null;

export function initTray() {
  tray = new Tray(getIconPath());
  tray.setContextMenu(Menu.buildFromTemplate(getRootMenuItems()));
  tray.on('click', () => {
    windowManager.open('main');
  });
  tray.setToolTip(`${app.name} ${app.getVersion()}`);
}
export function disposeTray() {
  tray?.destroy();
}

function getIconPath(status = 0) {
  const ext = os.platform() === 'win32' ? '.ico' : '.png';
  const filename = 'saddle';
  // TODO: different icons for different status
  return path.join(__dirname, 'icon', `${filename}${ext}`);
}
