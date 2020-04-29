import { app, MenuItem } from 'electron';
import windowManager from 'main/window/';

export function getRootMenuItems(): MenuItem[] {
  return [
    new MenuItem({
      label: '关于',
      type: 'normal',
      role: 'about',
      click: onAbout,
    }),
    new MenuItem({
      label: '退出',
      type: 'normal',
      role: 'quit',
      click: onQuit,
    }),
  ];
}
function onAbout() {
  windowManager.open('about');
}
function onQuit() {
  app.quit();
}
