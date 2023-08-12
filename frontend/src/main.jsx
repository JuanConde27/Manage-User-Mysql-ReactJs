import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

//importar bootrap
import 'bootstrap/dist/css/bootstrap.min.css';
//importar sweetalert2
import 'sweetalert2/src/sweetalert2.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
