import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Profile.css'; // Import your CSS file for this component
import { API_BACKEND_URL } from './config';

function ProfilePage() {
    const navigate = useNavigate();

    const [admin, setAdmin] = useState(false);

    const [data, setData] = useState({
        username: "",
        fullname: "",
        email: "",
        problemsSolved: 0,
        problemsAttempted: 0,
        userType: "",
        photo: ""
    });

    useEffect(() => {
        const isLoggedIn = async () => {
            try {
                const response = await axios.get(`${API_BACKEND_URL}/api/v1/user/current-user`);
                // Assuming response.data.user contains user information
                if (response.data.data) {
                    fetchUser(); // Fetch user data based on authenticated user
                    setAdmin(response.data.data.admin);
                } else {
                    throw new Error('User data not available.');
                }
            } catch (error) {
                console.log(error);
                navigate('/');
            }
        };

        isLoggedIn();
    }, [navigate]);

    const logOutHandler = async () => {
        try {
          await axios.post(`${API_BACKEND_URL}/logout`);
          localStorage.clear(); // Optionally clear local storage or session storage
          navigate("/"); // Navigate to the home page or login page after logout
        } catch (error) {
          console.error('Failed to log out:', error);
        }
      };
    

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${API_BACKEND_URL}/api/v1/user/current-user`);
            const userData = response.data.data;
            if (userData) {
                setData({
                    username: userData.username,
                    fullname: userData.fullname,
                    email: userData.email,
                    userType: userData.admin ? "Admin" : "User",
                    photo: userData.photo // Set photo path from the API response
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [image, setImage] = useState(null); // State to hold the image file

    const handleImageUpload = (event) => {
        setImage(event.target.files[0]);
    };

    const handleUpdateImage = async () => {
        if (!image) {
            alert("Please select an image to upload.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("profileImage", image);

            // Send the image data to the server
            const response = await axios.post(`${API_BACKEND_URL}/api/v1/user/updateProfileImage`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            console.log("Image uploaded successfully:", response.data);
            // Optionally update the state or show a success message
        } catch (error) {
            console.error("Error uploading image:", error);
            // Handle errors (show error message, etc.)
        }
    };

    return (
        <div className="profile-page">
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
        <div className="profile-container">
            <div className="profile-left">
                <img
                    src={data.photo ? `${API_BACKEND_URL}/${data.photo}` : "https://www.w3schools.com/howto/img_avatar.png"}
                    alt="Avatar"
                    className="profile-image"
                />
                <input
                    type="file"
                    onChange={handleImageUpload}
                    className="image-upload"
                />
                <button
                    onClick={handleUpdateImage}
                    className="update-button"
                >
                    Update
                </button>
            </div>
            <div className="profile-right">
                <div className="profile-username">
                    {data.username}
                </div>
                <div className="profile-info">
                    <strong>Name:</strong> {data.fullname}
                </div>
                <div className="profile-info">
                    <strong>Email:</strong> {data.email}
                </div>
                <div className="profile-info">
                    <strong>User Type:</strong> {data.userType}
                </div>
            </div>
        </div>

        </div>
    );
}

export default ProfilePage;
