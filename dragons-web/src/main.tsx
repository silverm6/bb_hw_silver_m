import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/index.tsx';

const container = document.getElementById('root');
if (container === null) {
  throw new Error('Root element #root not found');
}
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
