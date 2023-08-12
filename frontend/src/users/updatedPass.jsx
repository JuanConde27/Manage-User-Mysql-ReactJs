import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js'

//cambiar contraseña de usuario

const UpdatedPass = () => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const editUser = async (e) => {
        e.preventDefault();
        const user = { password };
        const token = localStorage.getItem('token');
        try {
            if (password === '' || newPassword === '') {
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
            if (password.length < 6 || newPassword.length < 6) {
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
                        title: 'Password must be at least 6 characters'
                    })
                return;
            }
            if (password !== newPassword) {
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
                        title: 'Passwords do not match'
                    })
                return;
            }
            const response = await axios.put(`${'http://localhost:3000/api/users/update-password'}/${id}`, user, {
                headers: {
                    Authorization: token
                }
            });
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
                  title: "Password updated",
                })
                .then(() => {
                  navigate("/users");
                });
            }
        }
        catch (error) {
            console.log(error);
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
              title: "Error updating password",
            });
        }
    }

    return (
      <div className="container">
        <div className="w-50 mx-auto">
          <div className="card card-body shadow p-5">
          <div className="login-card-logo">
            <img src="https://img.freepik.com/vector-gratis/vector-diseno-degradado-colorido-pajaro_343694-2506.jpg" alt="logo"/>
          </div>
            <h2 className="text-center mb-4">Change Password</h2>
            <form onSubmit={editUser}>
              <div className="form-group">
                <label>Enter your new password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <br></br>
              <div className="form-group">
                <label>Confirm your new password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <br></br>
              <button type="submit" className="btn btn-primary btn-block">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    );
};

export default UpdatedPass;