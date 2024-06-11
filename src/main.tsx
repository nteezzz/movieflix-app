import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import store from './redux/app/store';
import { Provider } from 'react-redux';
import { AuthProvider } from './components/AuthComponent/authContext.tsx';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
      <App />
      </AuthProvider> 
    </Provider>,
  </React.StrictMode>,
)
