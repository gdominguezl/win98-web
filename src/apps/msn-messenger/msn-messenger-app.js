import { IFrameApplication } from '../../system/iframe-application.js';
import { ICONS } from '../../config/icons.js';

const MSN_URL = import.meta.env.VITE_MSN_URL || "/";

export class MsnMessengerApp extends IFrameApplication {
  static config = {
    id: "msn-messenger",
    title: "MSN Messenger",
    description: "Chat with your contacts.",
    icon: ICONS["msn-messenger"],
    category: "",
    width: 380,
    height: 620,
    resizable: true,
    isSingleton: true,
  };

  constructor(config) {
    super(config);
  }

  _createWindow(gameConfig) {
    const win = new $Window({
      title: this.title,
      outerWidth: this.width,
      outerHeight: this.height,
      resizable: this.resizable,
      icons: this.icon,
    });

    const iframe = document.createElement("iframe");
    iframe.src = MSN_URL;
    iframe.title = "MSN Messenger";
    iframe.setAttribute("allow", "autoplay; fullscreen; clipboard-write");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    // Instead of appending, set the inner HTML to allow $Window.js to observe
    win.$content.html(iframe.outerHTML);

    // Get the actual iframe element that was added to the DOM
    this.iframe = win.$content.find("iframe")[0];
    this._setupIframeForInactivity(this.iframe);

    return win;
  }

  _onLaunch() {
    this.win.focus();
  }
}
