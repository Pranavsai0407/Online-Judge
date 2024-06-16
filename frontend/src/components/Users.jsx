import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Users.css';  // Assuming you create a separate CSS file

function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/v1/user/userType");
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
                const response = await axios.get('http://localhost:5000/api/v1/user/getAllusers');
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };
        fetchUsers();
    }, []);

    const handleAdminChange = async (user) => {
        const newRole = user.admin ? 'user' : 'admin';  // Toggle role

        try {
            const response = await axios.put(`http://localhost:5000/api/v1/assignrole/assign-role/${user._id}`, { role: newRole });
            console.log(response.data.message);

            // Update the user's admin status in the state
            setUsers(users.map(u => u._id === user._id ? { ...u, admin: !u.admin } : u));
        } catch (error) {
            console.error('Error updating admin status', error);
        }
    };

    return (
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
    );
}

export default Users;
