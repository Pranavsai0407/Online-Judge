import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Users.css';  // Assuming you create a separate CSS file
import { API_BACKEND_URL, API_COMPILER_URL} from './config';

function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await axios.post(`${API_BACKEND_URL}/api/v1/user/userType`);
                if (response.data.data.userType !== "admin") {
                    navigate('/HomePage');
                }
            } catch (error) {
                console.error("Error during authentication check", error);
                navigate('/');
            }
        };
        checkAdminStatus();
    }, [navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_BACKEND_URL}/api/v1/user/getAllusers`);
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };
        fetchUsers();
    }, []);

    const logOutHandler = async () => {
        try {
          await axios.post(`${API_BACKEND_URL}/logout`);
          localStorage.clear(); // Optionally clear local storage or session storage
          navigate("/"); // Navigate to the home page or login page after logout
        } catch (error) {
          console.error('Failed to log out:', error);
        }
      };
    

    const handleAdminChange = async (user) => {
        const newRole = user.admin ? 'user' : 'admin';  // Toggle role

        try {
            const response = await axios.put(`${API_BACKEND_URL}/api/v1/assignrole/assign-role/${user._id}`, { role: newRole });
            console.log(response.data.message);

            // Update the user's admin status in the state
            setUsers(users.map(u => u._id === user._id ? { ...u, admin: !u.admin } : u));
        } catch (error) {
            console.error('Error updating admin status', error);
        }
    };

    return (
        <div className="users-page">
        <header className="header">
        <nav className="navbar">
          <div className="logo">Online Judge</div>
          <ul className="nav-links">
            <li><a href="/HomePage">Home</a></li>
            <li><a href="/ProblemSet">Problems</a></li>
            <li><button onClick={logOutHandler}>Logout</button></li>
          </ul>
        </nav>
      </header>
     
        <div className="page-container">
            <div className="content-container">
                <h1 className="title">User Management</h1>
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Admin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <label className="switch">
                                            <input 
                                                type="checkbox" 
                                                checked={user.admin} 
                                                onChange={() => handleAdminChange(user)}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Users;
