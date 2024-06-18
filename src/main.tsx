import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {store,persistor} from './redux/app/store';
import { Provider } from 'react-redux';
import { AuthProvider } from './components/AuthComponent/authContext.tsx';
import { PersistGate } from 'redux-persist/integration/react';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AuthProvider>
      <App />
      </AuthProvider> 
    </PersistGate>
    </Provider>,
  </React.StrictMode>,
)
