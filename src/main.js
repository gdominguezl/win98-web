import "./shared/styles/cursors.css";
import "./shared/styles/file-picker.css";
import "./shared/styles/main.css";
import "./shared/styles/splash.css";
import "./shell/shutdown-screen.css";

import { initializeOS } from './system/os-init.js';
import { startCtTimer } from './apps/improving-ct-october/timer.js';

initializeOS();
startCtTimer();
