import App from './App';
import '../universalstyles_3.css';
import { updateConsoleLog } from './logSaver';

updateConsoleLog();
// the following are to test the new logging
// console.log("A")
// console.log("47")
// console.log({abc: "def"})
// logLogs();

const root: HTMLElement | null = document.getElementById('root');
if (root !== null)
  root.append(<App/>);