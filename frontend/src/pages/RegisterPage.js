import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authentication";

function RegisterPage() {

    //memory state
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Get login function and navigate from context and router
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();

        const user = {
            username: username,
            email: email,
            password: password
        }

        axios.post("http://localhost:8080/api/users", user)
            .then((response)=> {
                console.log("User registered successfully");
                alert("User registered successfully");
                
                // Automatically log in the user after registration
                login(response.data);
                
                // Redirect to admin dashboard
                navigate("/admin");
            })
            .catch((error) => {
                console.error("There was an error registering the user!", error);
                alert("There was an error registering the user!");
            });
    }

    return (
    <div className="container mt-5">
      <h2>User Registration</h2>

      {/* Form */}
      <form onSubmit={handleSubmit}>

        <input
          className="form-control mb-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary">
          Register
        </button>

      </form>
    </div>
  );
}

export default RegisterPage;