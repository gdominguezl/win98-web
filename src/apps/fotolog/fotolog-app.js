import { IFrameApplication } from '../../system/iframe-application.js';
import { ICONS } from '../../config/icons.js';
import { createMsnFrameWindow } from '../../shared/utils/msn-frame.js';

export class FotologApp extends IFrameApplication {
  static config = {
    id: "fotolog",
    title: "Fotolog",
    description: "Share a photo a day with your friends.",
    icon: ICONS.fotolog,
    category: "",
    width: 1024,
    height: 768,
    resizable: true,
    isSingleton: true,
  };

  constructor(config) {
    super(config);
  }

  _createWindow(gameConfig) {
    return createMsnFrameWindow(this, { path: "/fotolog", title: "Fotolog" });
  }

  _onLaunch() {
    this.win.focus();
  }
}
