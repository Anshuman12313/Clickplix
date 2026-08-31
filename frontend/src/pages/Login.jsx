
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

            <style>{`

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;

                    font-family:
                        Inter,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;

                    background: #f7f7fb;

                    color: #17171c;
                }

                .login-page {
                    min-height: 100vh;

                    display: flex;
                    flex-direction: column;
                }


                /* =====================
                   NAVBAR
                ===================== */

                .navbar {

                    height: 72px;

                    padding: 0 55px;

                    display: flex;

                    align-items: center;

                    justify-content:
                        space-between;

                    background:
                        rgba(
                            255,
                            255,
                            255,
                            0.9
                        );

                    border-bottom:
                        1px solid #e8e8ed;
                }

                .brand {

                    display: flex;

                    align-items: center;

                    gap: 10px;

                    text-decoration: none;

                    color: #17171c;

                    font-size: 18px;

                    font-weight: 750;
                }

                .brand-mark {

                    width: 33px;
                    height: 33px;

                    border-radius: 9px;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    background: #111116;

                    color: white;

                    font-size: 15px;

                    font-weight: 800;
                }

                .register-link {

                    color: #888890;

                    font-size: 12px;
                }

                .register-link a {

                    margin-left: 6px;

                    color: #111116;

                    font-weight: 650;

                    text-decoration: none;
                }


                /* =====================
                   MAIN
                ===================== */

                .login-container {

                    width: 100%;

                    max-width: 1050px;

                    margin: auto;

                    padding:
                        70px 30px 60px;

                    display: grid;

                    grid-template-columns:
                        1fr 420px;

                    gap: 100px;

                    align-items: center;

                    flex: 1;
                }


                /* =====================
                   INTRO
                ===================== */

                .login-intro {

                    padding-bottom: 20px;
                }

                .eyebrow {

                    margin: 0 0 12px;

                    color: #92929a;

                    font-size: 10px;

                    font-weight: 750;

                    letter-spacing: 1.7px;
                }

                .login-intro h1 {

                    margin: 0;

                    font-size: 43px;

                    line-height: 1.07;

                    letter-spacing: -1.8px;
                }

                .intro-text {

                    max-width: 400px;

                    margin:
                        20px 0 38px;

                    color: #777780;

                    font-size: 13px;

                    line-height: 1.7;
                }


                /* FEATURES */

                .feature-list {

                    display: flex;

                    flex-direction: column;

                    gap: 21px;
                }

                .feature {

                    display: flex;

                    gap: 12px;

                    align-items:
                        flex-start;
                }

                .feature-icon {

                    width: 30px;
                    height: 30px;

                    flex-shrink: 0;

                    border:
                        1px solid #dedee5;

                    border-radius: 8px;

                    background: white;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    color: #66666e;

                    font-size: 11px;

                    font-weight: 800;
                }

                .feature strong {

                    display: block;

                    margin-top: 1px;

                    font-size: 12px;
                }

                .feature p {

                    margin: 4px 0 0;

                    color: #9999a1;

                    font-size: 10px;
                }


                /* =====================
                   LOGIN CARD
                ===================== */

                .login-card {

                    padding: 31px;

                    background: white;

                    border:
                        1px solid #e3e3e8;

                    border-radius: 16px;

                    box-shadow:
                        0 18px 50px
                        rgba(
                            20,
                            20,
                            30,
                            0.07
                        );
                }


                /* HEADER */

                .card-header {

                    display: flex;

                    align-items: center;

                    gap: 12px;

                    margin-bottom: 28px;
                }

                .login-logo {

                    width: 40px;
                    height: 40px;

                    border-radius: 11px;

                    background: #111116;

                    color: white;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    font-weight: 800;

                    font-size: 17px;
                }

                .card-header h2 {

                    margin: 0;

                    font-size: 19px;

                    letter-spacing: -0.4px;
                }

                .card-header p {

                    margin: 4px 0 0;

                    color: #9999a1;

                    font-size: 10px;
                }


                /* INPUTS */

                .input-group {

                    margin-bottom: 17px;
                }

                .input-group label {

                    display: block;

                    margin-bottom: 6px;

                    color: #55555d;

                    font-size: 11px;

                    font-weight: 600;
                }

                .input-group input {

                    width: 100%;

                    height: 44px;

                    padding:
                        0 13px;

                    border:
                        1px solid #dedee5;

                    border-radius: 8px;

                    outline: none;

                    background: #fbfbfc;

                    color: #17171c;

                    font-size: 12px;

                    transition:
                        border-color 0.15s,
                        box-shadow 0.15s,
                        background 0.15s;
                }

                .input-group input:focus {

                    border-color:
                        #111116;

                    background: white;

                    box-shadow:
                        0 0 0 3px
                        rgba(
                            20,
                            20,
                            25,
                            0.06
                        );
                }

                .input-group
                input::placeholder {

                    color: #b6b6bd;
                }


                /* MESSAGE */

                .message {

                    margin:
                        3px 0 15px;

                    padding:
                        10px 11px;

                    border-radius: 8px;

                    display: flex;

                    align-items:
                        flex-start;

                    gap: 8px;

                    font-size: 10px;
                }

                .message span {

                    width: 17px;
                    height: 17px;

                    flex-shrink: 0;

                    border-radius: 50%;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    font-size: 9px;

                    font-weight: 800;
                }

                .message p {

                    margin: 2px 0 0;

                    line-height: 1.4;
                }

                .message.error {

                    background: #fff1f1;

                    border:
                        1px solid #ffdada;

                    color: #a94343;
                }

                .message.error span {

                    background: #c65353;

                    color: white;
                }

                .message.success {

                    background: #eef9f2;

                    border:
                        1px solid #d8efdf;

                    color: #34744e;
                }

                .message.success span {

                    background: #3d8b5b;

                    color: white;
                }


                /* LOGIN BUTTON */

                .login-button {

                    width: 100%;

                    height: 45px;

                    border: none;

                    border-radius: 8px;

                    background: #111116;

                    color: white;

                    cursor: pointer;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    gap: 9px;

                    font-size: 11px;

                    font-weight: 650;

                    transition:
                        transform 0.15s,
                        background 0.15s;
                }

                .login-button:hover:not(:disabled) {

                    background: #25252c;

                    transform:
                        translateY(-1px);
                }

                .login-button:disabled {

                    opacity: 0.55;

                    cursor: not-allowed;
                }

                .login-button > span:last-child {

                    font-size: 15px;
                }


                /* LOADER */

                .loader {

                    width: 13px;
                    height: 13px;

                    border:
                        2px solid #777780;

                    border-top-color: white;

                    border-radius: 50%;

                    animation:
                        spin 0.7s linear infinite;
                }

                @keyframes spin {

                    to {
                        transform:
                            rotate(360deg);
                    }

                }


                /* DIVIDER */

                .divider {

                    display: flex;

                    align-items: center;

                    gap: 10px;

                    margin:
                        25px 0 18px;
                }

                .divider span {

                    flex: 1;

                    height: 1px;

                    background: #eeeeF2;
                }

                .divider p {

                    margin: 0;

                    color: #b0b0b7;

                    font-size: 8px;

                    font-weight: 700;
                }


                /* CREATE ACCOUNT */

                .create-account {

                    margin: 0;

                    text-align: center;

                    color: #9999a1;

                    font-size: 10px;
                }

                .create-account a {

                    margin-left: 5px;

                    color: #17171c;

                    font-weight: 650;

                    text-decoration: none;
                }


                /* FOOTER */

                footer {

                    width: 100%;

                    padding:
                        20px 55px;

                    display: flex;

                    justify-content:
                        space-between;

                    color: #aaaab1;

                    font-size: 9px;
                }


                /* =====================
                   TABLET
                ===================== */

                @media (max-width: 850px) {

                    .login-container {

                        grid-template-columns:
                            1fr;

                        max-width: 550px;

                        gap: 35px;

                        padding-top: 45px;
                    }

                    .login-intro {

                        text-align: center;

                        padding: 0;
                    }

                    .intro-text {

                        margin-left: auto;
                        margin-right: auto;
                    }

                    .feature-list {

                        display: none;
                    }

                }


                /* =====================
                   MOBILE
                ===================== */

                @media (max-width: 550px) {

                    .navbar {

                        padding:
                            0 18px;
                    }

                    .register-link {

                        font-size: 10px;
                    }

                    .login-container {

                        padding:
                            35px 15px 40px;
                    }

                    .login-intro h1 {

                        font-size: 31px;
                    }

                    .login-card {

                        padding: 22px;
                    }

                    footer {

                        padding:
                            18px;

                        font-size: 8px;
                    }

                }

            `}</style>

        </div>
    );
}

export default Login;

