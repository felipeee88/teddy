import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Router } from './app/routes/router';
import './shared/styles/theme.css';
import './shared/styles/global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <Router />
  </StrictMode>
);
