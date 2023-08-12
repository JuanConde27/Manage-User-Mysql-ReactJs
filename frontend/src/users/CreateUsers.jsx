import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js'
//crear usuarios

const CreateUsers = () => {
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();;

    const registerUser = async (e) => {
        e.preventDefault();
        const user = { username, email };
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: token }
        };
        try {
            if (username === '' || email === '') {
                Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: false,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    }).fire({
                        icon: 'error',
                        title: 'Please fill all fields'
                    })
                return;
            }
    
            //veficar si el email es valido
            const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
            if (!emailValid) {
                Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: false,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    }).fire({
                        icon: 'error',
                        title: 'Please enter a valid email'
                    })
                return;
            }
    
            //verificar el nombre de usuario 
            const usernameValid = username.match(/^[a-zA-Z0-9]+$/);
            if (!usernameValid) {
                Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: false,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    }).fire({
                        icon: 'error',
                        title: 'Username must be alphanumeric'
                    })
                return;
            }
            
            const response = await axios.post('http://localhost:3000/api/register_users', user, config);
            setName('');
            setEmail('');

            if (response.status === 200) {
                Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    }).fire({
                        icon: 'success',
                        title: 'User created successfully'
                    }).then(() => {
                        navigate('/users');
                    }
                )
            }
        } catch (error) {
            console.log(error);
            if (error.response.status === 401) {
                alert('You are not authorized to create users');
            }

            if (error.response.status === 400) {
                Swal.mixin({
                  toast: true,
                  position: "top-end",
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: false,
                  didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                  },
                }).fire({
                  icon: "error",
                  title: "User already exists",
                });
            }

            if (error.response.status === 500) {
                Swal.mixin({
                  toast: true,
                  position: "top-end",
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: false,
                  didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                  },
                }).fire({
                  icon: "error",
                  title: "Internal server error",
                });
            }
        }
    }

    //mostrar formulario de registro de usuarios con estilos de bootstrap

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card card-body shadow p-5">
              <div className="login-card-logo">
                <img
                  src="https://img.freepik.com/vector-gratis/vector-diseno-degradado-colorido-pajaro_343694-2506.jpg"
                  alt="logo"
                />
              </div>
              <h3 className="text-center">Register user</h3>
              <form onSubmit={registerUser}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <br />
                <button type="submit" className="btn btn-primary btn-block">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}

export default CreateUsers;