import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js'

const EditUsers = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoChanged, setPhotoChanged] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const getUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: token }
      };
      const response = await axios.get(`${'http://localhost:3000/api/users'}/${id}`, config);
      const user = response.data.user;
      setUsername(user.username);
      setEmail(user.email);
      setPassword(user.password);
      setPhoto(user.photo);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const handlePhotoChange = (e) => {
    setPhotoChanged(true);
    setPhoto(e.target.files[0]);
  };

  const editUser = async (e) => {
    e.preventDefault();
    const user = { username, email, password };

    if (photoChanged) {
      user.photo = photo;
    }

    const token = localStorage.getItem('token');
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
      //verificar email
      if (!/\S+@\S+\.\S+/.test(email)) {
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
      //verificar username
      if (username.length < 4) {
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
          title: 'Username must be at least 4 characters'
        })
        return;
      }
      //verificar photo 
      if (photoChanged) {
        if (photo.type !== 'image/jpeg' && photo.type !== 'image/png' && photo.type !== 'image/jpg') {
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
            title: 'Please select a valid image'
          })
          return;
        }
      }

      const response = await axios.put(`${'http://localhost:3000/api/users/uptade'}/${id}`, user, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        }
      });
      setUsername('');
      setEmail('');
      setPassword('');
      setPhoto('');

      if (response.status === 200) {
        const userUpdate = await axios.get(`${'http://localhost:3000/api/users'}/${id}`, {
          headers: {
            Authorization: token
          }
        });

        if (userUpdate.data.user.id === JSON.parse(localStorage.getItem('user')).id) {
          localStorage.setItem('user', JSON.stringify(userUpdate.data.user));
        }

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
          icon: 'success',
          title: 'User updated successfully!'
        }).then(() => {
          navigate('/users');
        })
      }
    } catch (error) {
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
        title: "Error updating user!",
      });
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
            <h3 className="text-center">Edit User</h3>
            <br />
            <form onSubmit={editUser}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
              <div className="form-group">
                <label>Photo</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handlePhotoChange}
                />
              </div>
              <br />
              <button type="submit" className="btn btn-primary btn-block">
                Confirm
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUsers;
