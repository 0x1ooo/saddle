import { BrowserWindow, screen } from 'electron';

/** Open the DevTools window by parent window's side
 * @param wnd Parent window that the DevTools attached to
 */
export function openDevTools(wnd: BrowserWindow) {
  const devWnd = new BrowserWindow({ parent: wnd });
  wnd.webContents.setDevToolsWebContents(devWnd.webContents);
  wnd.webContents.openDevTools({ mode: 'detach', activate: false });
  const disp = screen.getPrimaryDisplay();
  const screenSize = disp.workAreaSize;
  const wndSize = wnd.getBounds();
  console.log('screen size', screenSize);
  console.log('wnd size', wnd.getBounds());
  console.log('dev wnd size', devWnd.getBounds());
  const minDevWidth = 300;
  const devSize = devWnd.getBounds();
  devSize.width = Math.max(
    minDevWidth,
    Math.min(devSize.width, screenSize.width - wndSize.width)
  );
  devWnd.setSize(devSize.width, wndSize.height);
  const totalWidth = wndSize.width + devSize.width;
  const wndX = Math.max(0, screenSize.width - totalWidth) * 0.5;
  const wndY = wnd.getPosition()[1];
  wnd.setPosition(wndX, wndY);
  devWnd.setPosition(wndX + wndSize.width, wndY);
}
