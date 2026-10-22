import { IFrameApplication } from '../../system/iframe-application.js';
import { ICONS } from '../../config/icons.js';
import { createMsnFrameWindow } from '../../shared/utils/msn-frame.js';

export class MsnMessengerApp extends IFrameApplication {
  static config = {
    id: "msn-messenger",
    title: "MSN Messenger",
    description: "Chat with your contacts.",
    icon: ICONS["msn-messenger"],
    category: "",
    width: 529,
    height: 796,
    resizable: true,
    isSingleton: true,
  };

  constructor(config) {
    super(config);
  }

  _createWindow(gameConfig) {
    return createMsnFrameWindow(this, { path: "/", title: "MSN Messenger" });
  }

  _onLaunch() {
    this.win.focus();
  }
}
