import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js'

const url = 'http://localhost:3000/api/forgot-password';

//enviar email para recuperar contraseña

const ForgotPass = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    //funcion para enviar email para recuperar contraseña

    const forgotPass = async (e) => {
        e.preventDefault();
        try {
            //verificar si estan llenos los campos de email
            if (email === '') {
                alert('Please fill all fields');
                return;
            }

            const response = await axios.post(url, {
                email
            });
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
                  title: "Email sent successfully to " + email,
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
                        title: "Email not found",
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
            <div className="card card-body shadow p-5">
              <div className="login-card-logo">
                <img
                  src="https://img.freepik.com/vector-gratis/vector-diseno-degradado-colorido-pajaro_343694-2506.jpg"
                  alt="logo"
                />
              </div>
              <h2 className="text-center">Forgot Password</h2>
              <br />
              <form onSubmit={forgotPass}>
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
                  Send Email
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}

export default ForgotPass;