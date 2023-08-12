import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faTrash, faPenToSquare, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import '../styles/showuser.css';

const url = "http://localhost:3000/api/users";

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(3);

  const getUsers = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: token }
    };
    try {
      const response = await axios.get(url, config);
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = async (id) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: token },
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          await axios.delete(
            `${"http://localhost:3000/api/users/delete"}/${id}`,
            config
          );
          Swal.fire("Deleted!", "User has been deleted.", "success");
          getUsers();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "User is safe :)", "error");
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You are not authorized to delete this user",
          });
        }
      }
    });
  };

  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const results = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.id.toString().includes(searchTerm)
    );
    setSearchResults(results);
  }, [searchTerm]);

  useEffect(() => {
    setUsers(searchResults);
  }, [searchResults]);

  useEffect(() => {
    if (searchTerm === "") {
      getUsers();
    }
  }, [searchTerm]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const user = localStorage.getItem('user');
  const username = JSON.parse(user).username;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;

    // Calcula el número de páginas totales
    const totalPages = Math.ceil(users.length / usersPerPage);

    // Calcula la página inicial y final para mostrar
    let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    // Ajusta el número de páginas si el final se sale del rango
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    // Genera los números de página para mostrar en la paginación
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button id = "btn-page"
          key={i}
          onClick={() => setCurrentPage(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="container">
      <h1 className="text-center welcome-text">¡Welcome {username}!</h1>
      <br />
      <img src={JSON.parse(user).photo} alt="user" className="rounded-circle user-photo" />
      <br />
      <div className="button-container">
        <Link to={`/updatedpass/${JSON.parse(user).id}`} className="btn btn-primary">
          <i className="fas fa-angle-double-left"></i> Change Password
        </Link>
        <Link to="/createuser" className="btn btn-primary">
          <i className="fas fa-angle-double-left"></i> Create New User
        </Link>
      </div>
      <br />
      <div className="card shadow p-5">
        <div className="card-header">
          <h1 className="card-title"> My Users </h1>
          <br />
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search users"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead className="text-primary">
                <tr>
                  <th>Photo</th>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td><img src={user.photo} alt="user" className="rounded-circle" width="50" height="50" /></td>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <Link to={`/edituser/${user.id}`} className="btn btn-warning mt-2 mb-2">
                        <i className="fas fa-angle-double-right"></i><FontAwesomeIcon icon={faPenToSquare} />
                      </Link>
                      <span> </span>
                      <button onClick={() => deleteUser(user.id)} className="btn btn-danger mt-2 mb-2" id="btn-danger">
                        <i className="fas fa-angle-double-right"></i><FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button id="btn-prev"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Back
              </button>
              {renderPageNumbers()}
              <button id="btn-next"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={indexOfLastUser >= users.length}
              >
                Next
              </button>
            </div>
            <button onClick={logout} id="logout" className="btn btn-danger"><FontAwesomeIcon icon={faRightFromBracket} /> Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUsers;
