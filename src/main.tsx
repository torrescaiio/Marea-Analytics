import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

const rootElement = createRoot(root);

try {
  rootElement.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  root.innerHTML = '<div style="padding: 20px; text-align: center;">Erro ao carregar o aplicativo. Por favor, recarregue a página.</div>';
}
