import App from './App';
import '../universalstyles_3.css';
import { updateConsoleLog } from './logSaver';

updateConsoleLog();

const root: HTMLElement | null = document.getElementById('root');
if (root !== null)
  root.append(<App/>);