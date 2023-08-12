import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';

//cambiar contraseña

const CreateUsersPass = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [photo, setPhoto] = useState(null);
    const navigate = useNavigate();
    const { token } = useParams();

    //funcion para cambiar contraseña

    const resetPass = async (e) => {
        e.preventDefault();
        try {
            //verificar si estan llenos los campos de password y passwordConfirm
            if (password === '' || passwordConfirm === '') {
                Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: false,
                    didOpen: (toast) => {
                        toast.addEventListener("mouseenter", Swal.stopTimer);
                        toast.addEventListener("mouseleave", Swal.resumeTimer);
                    }
                })
                    .fire({
                        icon: "error",
                        title: "Please fill all fields",
                    })
                return;
            }

            //verificar si los campos de password y passwordConfirm son iguales
            if (password !== passwordConfirm) {
                Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: false,
                    didOpen: (toast) => {
                        toast.addEventListener("mouseenter", Swal.stopTimer);
                        toast.addEventListener("mouseleave", Swal.resumeTimer);
                    }
                })
                    .fire({
                        icon: "error",
                        title: "Passwords do not match",
                    })
                return;
            }

            //verificar que la contraseña sea valida con regex
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
            if (!regex.test(password)) {
                Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: false,
                    didOpen: (toast) => {
                        toast.addEventListener("mouseenter", Swal.stopTimer);
                        toast.addEventListener("mouseleave", Swal.resumeTimer);
                    }
                })
                    .fire({
                        icon: "error",
                        title: "Password must be at least 6 characters, contain at least one uppercase letter, one lowercase letter and one number",
                    })
                return;
            }

            //enviar datos de password y token al backend
            const response = await axios.post(`http://localhost:3000/api/register_users_password/${token}`, {
                password,
                photo
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
            }});
            console.log(response.data);
            if (response.status === 200) {
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
                })
                    .fire({
                        icon: "success",
                        title: "Account created successfully, please tell new user to verify their email",
                    })
                    .then(() => {
                        navigate("/");
                    });
            }
        } catch (error) {
            console.log(error);
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
                    }
                })
                    .fire({
                        icon: "error",
                        title: error.response.data.message,
                    })
                    .then(() => {
                        navigate("/");
                    }
                    );
            }
        }
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card card-body">
              <div className="login-card-logo">
                <img
                  src="https://img.freepik.com/vector-gratis/vector-diseno-degradado-colorido-pajaro_343694-2506.jpg"
                  alt="logo"
                />
              </div>
              <h2 className="text-center">Active your acount</h2>
              <br />
              <form onSubmit={resetPass}>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <br />
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  />
                </div>
                <br />
                <div className="form-control">
                  <label>Photo</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Active Account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}

export default CreateUsersPass
