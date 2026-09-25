import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// reset antd importe une seule fois et EN PREMIER : index.css et Bootstrap (BarNav) passent
// apres et gardent la priorite, le reset ne change donc pas le rendu des autres pages
import 'antd/dist/reset.css'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import{ Provider} from 'react-redux';
import { ConfigProvider } from 'antd';
import store from './JS/store/store.js';
import { antdTheme } from './styles/antdTheme.js';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ConfigProvider theme={antdTheme}>
          <App />
        </ConfigProvider>
      </Provider>
    </BrowserRouter>

  </StrictMode>,
)
