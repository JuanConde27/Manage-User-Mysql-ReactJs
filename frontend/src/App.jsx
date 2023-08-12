import reactLogo from './assets/react.svg'
import './App.css'


//importar componentes
import Login from './users/Login'
import Register from './users/register'
import ShowUsers from './users/ShowUsers'
import EditUsers from './users/EditUsers'
import CreateUsers from './users/CreateUsers'
import ForgotPass from './users/forgotpass'
import ResetPass from './users/resetpass'
import CreateUsersPass from './users/CreateUsersPass'
import UpdatedPass from './users/updatedPass'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<ShowUsers />} />
        <Route path="/edituser/:id" element={<EditUsers />} />
        <Route path="/createuser" element={<CreateUsers />} />
        <Route path="/forgotpass" element={<ForgotPass />} />
        <Route path="/resetpass/:token" element={<ResetPass />} />
        <Route path="/createuserpass/:token" element={<CreateUsersPass />} />
        <Route path="/updatedpass/:id" element={<UpdatedPass />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
