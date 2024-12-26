import React from 'react';
import ReactDOM from 'react-dom/client'; // Notez le changement ici
import { Provider } from 'react-redux';
import store from './store'; // Importez votre store
import App from './App';
import './index.css';

// Créer un root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendre l'application
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);