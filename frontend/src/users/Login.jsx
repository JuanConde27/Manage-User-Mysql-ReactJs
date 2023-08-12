import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import '../styles/login.css'

const url = 'http://localhost:3000/api/login';

// Logear un usuario

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Función para logear un usuario con autorización de token

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      // Verificar si están llenos los campos de email y password
      if (email === '' || password === '') {
        Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: false,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        }).fire({
          icon: 'error',
          title: 'Please fill all fields',
        });
        return;
      }

      const response = await axios.post(url, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (response.status === 200) {
        Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: false,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        }).fire({
          icon: 'success',
          title: 'Signed in successfully',
        }).then(() => {
          navigate('/users');
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: false,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        }).fire({
          icon: 'error',
          title: 'Invalid credentials',
        });
      }
    }
  };

  // Mostrar formulario de login de usuarios con estilos de bootstrap

  return (
    <div id="login-container">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div id="login-card" className="card card-body shadow p-5">
          <div className="login-card-logo">
            <img src="https://img.freepik.com/vector-gratis/vector-diseno-degradado-colorido-pajaro_343694-2506.jpg" alt="logo"/>
          </div>
            <h2 id="login-title" className="text-center">Login</h2>
            <br />
            <form onSubmit={loginUser}>
              <div className="form-group">
                <label htmlFor="email-input">Email</label>
                <input
                  type="email"
                  id="email-input"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="password-input">Password</label>
                <input
                  type="password"
                  id="password-input"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <br />
              <button type="submit" id="login-button" className="btn btn-primary btn-block">Login</button>
            </form>
            <p className="lead mt-3">Forgot your password? <Link to="/forgotpass">Click here</Link></p>
            <p className="lead mt-2">Don't have an account? <Link to="/register">Register</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
