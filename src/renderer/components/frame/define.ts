/** The flags that controls the apperance of a window's title bar.
 * Note that flags can be bitwise operated, and these flags are given as presets:
 * - `FrameFlag.Main`
 * - `FrameFlag.Tool`
 */
export enum FrameFlag {
  /** An empty title bar */
  None = 0,
  /** Show the app icon */
  Icon = 1 << 0,
  /** Show the window title */
  Title = 1 << 1,
  /** Show the close window button */
  Close = 1 << 2,
  /** Show the minimize window button */
  Minimize = 1 << 3,
  /** Show the maximize/restore window button */
  Maximize = 1 << 4,
  /** Preset: the title bar style for a main window */
  Main = Icon | Title | Close | Minimize | Maximize,
  /** Preset: the title bar style for a tool window,
   * i.e. it hides the icon and can't be minimize/maximize.
   */
  Tool = Title | Close,
}
