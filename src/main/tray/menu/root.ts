import { app, MenuItem } from 'electron';

export function getRootMenuItems(): MenuItem[] {
  return [
    new MenuItem({
      label: '退出',
      type: 'normal',
      role: 'quit',
      click: () => onQuit(),
    }),
  ];
}

function onQuit() {
  console.log('on quit');
  app.quit();
}
