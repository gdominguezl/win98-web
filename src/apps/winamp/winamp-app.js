import { IFrameApplication } from '../../system/iframe-application.js';
import { ICONS } from '../../config/icons.js';
import { createMsnFrameWindow } from '../../shared/utils/msn-frame.js';

export class WinampApp extends IFrameApplication {
  static config = {
    id: "winamp",
    title: "Winamp",
    description: "Listen to music with your friends.",
    icon: ICONS.webamp,
    category: "",
    innerWidth: 901,
    innerHeight: 592,
    resizable: true,
    isSingleton: true,
  };

  constructor(config) {
    super(config);
  }

  _createWindow(gameConfig) {
    return createMsnFrameWindow(this, { path: "/winamp", title: "Winamp" });
  }

  _onLaunch() {
    this.win.focus();
  }
}
