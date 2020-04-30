/** Theme: Hot Steel
 *  Author: Wizcas 0x1ooo
 */

import { createMuiTheme } from '@material-ui/core';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';

const palette: PaletteOptions = {
  primary: { main: '#607D8B', contrastText: '#ffffff' },
  secondary: { main: '#FFC107', contrastText: '#2D363D' },
  background: {
    default: '#f5f5f6',
  },
};

const theme = createMuiTheme({
  palette,
});
export default theme;
