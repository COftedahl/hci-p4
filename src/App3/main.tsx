import App from './App';

const root: HTMLElement | null = document.getElementById('root');
if (root !== null)
  root.append(<App/>);