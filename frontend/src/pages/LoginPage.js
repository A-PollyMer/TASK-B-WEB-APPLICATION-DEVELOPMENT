import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Authentication';

 function LoginPage() {

    //useState = boxes to store what user types
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    
    //Get login function from AuthContext
    const { login } = useContext(AuthContext);
    
    
    //useNavigate = to redirect
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page

        const loginData = {
            username: username,
            password: password
        };

        /*
        Send login data to backend
        Backend checks if user exists
        */

         axios
            .post("http://localhost:8080/api/users/login", loginData)
            .then((response) => {
                alert("Login successful!");
                
                // Save user to AuthContext and localStorage
                login(response.data);
                
                // Redirect to Admin Dashboard
                navigate("/admin");
            })
            .catch((error) => {
                alert("Invalid username or password");
            });
        };
    
    
    return (
         <div className="container mt-5">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>

      </form>
    </div>
    );
}

export default LoginPage;

