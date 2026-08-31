
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");

        if (!email.trim()) {
            setMessage("Please enter your email");
            return;
        }

        if (!password) {
            setMessage("Please enter your password");
            return;
        }

        try {

            setLoading(true);

            const formData =
                new URLSearchParams();

            // FastAPI OAuth2PasswordRequestForm
            // expects "username"
            formData.append(
                "username",
                email
            );

            formData.append(
                "password",
                password
            );

            const response =
                await api.post(
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
            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "user"
            );

            // Store JWT
            localStorage.setItem(
                "access_token",
                response.data.access_token
            );

            // Store user information
            localStorage.setItem(
                "user",
                JSON.stringify(
                    response.data.user
                )
            );

            setMessage(
                "Login successful!"
            );

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

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="login-page">

            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="navbar">

                <Link
                    to="/"
                    className="brand"
                >

                    <div className="brand-mark">
                        C
                    </div>

                    <span>
                        ClickPlix
                    </span>

                </Link>


                <div className="register-link">

                    Don't have an account?

                    <Link to="/register">
                        Create one
                    </Link>

                </div>

            </nav>


            {/* =========================
                MAIN
            ========================= */}

            <main className="login-container">

                {/* LEFT SIDE */}

                <section className="login-intro">

                    <p className="eyebrow">
                        WELCOME BACK
                    </p>

                    <h1>
                        Your moments.
                        <br />
                        Your people.
                    </h1>

                    <p className="intro-text">
                        Sign in to ClickPlix and continue
                        sharing moments with the people
                        who matter.
                    </p>


                    <div className="feature-list">

                        <div className="feature">

                            <div className="feature-icon">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    Automatic recognition
                                </strong>

                                <p>
                                    Find your friends in
                                    every group photo.
                                </p>

                            </div>

                        </div>


                        <div className="feature">

                            <div className="feature-icon">
                                →
                            </div>

                            <div>

                                <strong>
                                    Instant delivery
                                </strong>

                                <p>
                                    Matched photos go
                                    straight to Telegram.
                                </p>

                            </div>

                        </div>


                        <div className="feature">

                            <div className="feature-icon">
                                +
                            </div>

                            <div>

                                <strong>
                                    Private groups
                                </strong>

                                <p>
                                    Share photos only
                                    with your people.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* LOGIN CARD */}

                <section className="login-card">

                    <div className="card-header">

                        <div className="login-logo">
                            C
                        </div>

                        <div>

                            <h2>
                                Welcome back
                            </h2>

                            <p>
                                Log in to your account
                            </p>

                        </div>

                    </div>


                    <form
                        onSubmit={handleLogin}
                    >

                        {/* EMAIL */}

                        <div className="input-group">

                            <label>
                                Email address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="input-group">

                            <div className="password-label">

                                <label>
                                    Password
                                </label>

                            </div>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />

                        </div>


                        {/* ERROR / SUCCESS */}

                        {message && (

                            <div
                                className={
                                    message ===
                                    "Login successful!"
                                        ? "message success"
                                        : "message error"
                                }
                            >

                                <span>
                                    {message ===
                                    "Login successful!"
                                        ? "✓"
                                        : "!"}
                                </span>

                                <p>
                                    {message}
                                </p>

                            </div>

                        )}


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="loader"></span>
                                    Signing in...
                                </>

                            ) : (

                                <>
                                    Sign in
                                    <span>→</span>
                                </>

                            )}

                        </button>

                    </form>


                    <div className="divider">
                        <span></span>
                        <p>OR</p>
                        <span></span>
                    </div>


                    <p className="create-account">

                        New to ClickPlix?

                        <Link to="/register">
                            Create an account
                        </Link>

                    </p>

                </section>

            </main>


            {/* =========================
                FOOTER
            ========================= */}

            <footer>

                <span>
                    © 2026 ClickPlix
                </span>

                <span>
                    Capture. Recognize. Share.
                </span>

            </footer>


            {/* =========================
                STYLES
            ========================= */}

            

        </div>
    );
}

export default Login;

