import App from './App';
import '../../Utility/universalstyles_3.css';

const root: HTMLElement | null = document.getElementById('root');
if (root !== null)
  root.append(<App/>);