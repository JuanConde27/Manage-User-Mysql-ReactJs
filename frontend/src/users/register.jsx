import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import '../styles/register.css'

const url = 'http://localhost:3000/api/register';

// Crear un usuario

const Register = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    const user = { username, email, password, photo };
    console.log(user);

    if (username === '' || email === '' || password === '' || photo === null) {
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
        title: 'All fields are required',
      });
      return;
    }

    if (photo.size > 2000000) {
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
        title: 'The image must be less than 2MB',
      });
      return;
    }

    if (photo.type !== 'image/jpeg' && photo.type !== 'image/png') {
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
        title: 'The image must be JPG or PNG',
      });
      return;
    }

    // Verificar si el email es válido
    const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    if (!emailValid) {
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
        title: 'Invalid email',
      });
      return;
    }

    // Verificar si la contraseña es válida
    const passwordValid = password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm);
    if (!passwordValid) {
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
        title: 'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number',
      });
      return;
    }

    // Verificar el nombre de usuario
    const usernameValid = username.match(/^[a-zA-Z0-9]+$/);
    if (!usernameValid) {
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
        title: 'Username must contain only letters and numbers',
      });
      return;
    }

    // Crear usuario

    try {
      const response = await axios.post('http://localhost:3000/api/register', user, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setName('');
      setEmail('');
      setPassword('');
      setPhoto('');

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
          title: 'User created successfully',
        }).then(() => {
          navigate('/');
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
          title: 'User already exists',
        });
      }
      if (error.response.status === 500) {
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
          title: 'Internal server error',
        });
      }
      if (error.response.status === 401) {
        alert('You are not authorized to create users');
      }
    }
  };

  // Mostrar formulario de registro de usuarios con estilos de bootstrap

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div id="register-card" className="card card-body shadow p-5">
          <div className="login-card-logo">
            <img src="https://img.freepik.com/vector-gratis/vector-diseno-degradado-colorido-pajaro_343694-2506.jpg" alt="logo"/>
          </div>
            <h2 id="register-title" className="text-center">Register</h2>
            <br />
            <form onSubmit={registerUser}>
              <div className="form-group">
                <label id="name-label">Name</label>
                <input
                  type="text"
                  id="name-input"
                  className="form-control"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label id="email-label">Email</label>
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
                <label id="password-label">Password</label>
                <input
                  type="password"
                  id="password-input"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label id="photo-label">Photo</label>
                <input
                  type="file"
                  id="photo-input"
                  className="form-control"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </div>
              <br />
              <button type="submit" id="register-button" className="btn btn-primary btn-block">Register</button>
            </form>
            <p className="lead mt-4">Already have an account? <Link to="/">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
