
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const formData = new URLSearchParams();

            // FastAPI OAuth2PasswordRequestForm
            // expects "username", even though we use email
            formData.append("username", email);
            formData.append("password", password);

            const response = await api.post(
                "/login",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    }
                }
            );

            console.log(
                "Login response:",
                response.data
            );

            // Remove old authentication data
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");

            // Store new JWT
            localStorage.setItem(
                "access_token",
                response.data.access_token
            );

            // Store user information
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            console.log(
                "Token saved:",
                localStorage.getItem("access_token")
            );

            setMessage("Login successful!");

            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Login failed:",
                error.response?.data || error
            );

            setMessage(
                error.response?.data?.detail ||
                "Invalid email or password"
            );
        }
    };

    return (
        <div>

            <h1>Login</h1>

            <form onSubmit={handleLogin}>

                <label>Email</label>
                <br />

                <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    placeholder="Enter email"
                    required
                />

                <br />
                <br />

                <label>Password</label>
                <br />

                <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    placeholder="Enter password"
                    required
                />

                <br />
                <br />

                <button type="submit">
                    Login
                </button>

            </form>

            <p>{message}</p>

        </div>
    );
}

export default Login;

