
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [frontFace, setFrontFace] = useState(null);
    const [leftFace, setLeftFace] = useState(null);
    const [rightFace, setRightFace] = useState(null);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async () => {
        setMessage("");

        if (!name.trim()) {
            setMessage("Please enter your name");
            return;
        }

        if (!email.trim()) {
            setMessage("Please enter your email");
            return;
        }

        if (!password) {
            setMessage("Please enter a password");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must contain at least 6 characters");
            return;
        }

        if (!frontFace || !leftFace || !rightFace) {
            setMessage(
                "Please upload all three face images"
            );
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);

            formData.append(
                "front_face",
                frontFace
            );

            formData.append(
                "left_face",
                leftFace
            );

            formData.append(
                "right_face",
                rightFace
            );

            const response = await api.post(
                "/users",
                formData
            );

            console.log(
                "Registration response:",
                response.data
            );

            setMessage(
                `Registration successful! Your registration code is: ${response.data.registration_code}`
            );

            setName("");
            setEmail("");
            setPassword("");

            setFrontFace(null);
            setLeftFace(null);
            setRightFace(null);

            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (error) {
            console.error(
                "Registration failed:",
                error
            );

            setMessage(
                error.response?.data?.detail ||
                "Registration failed"
            );

        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (
        event,
        setter
    ) => {
        const file =
            event.target.files?.[0];

        if (file) {
            setter(file);
        }
    };

    const removeImage = (setter) => {
        setter(null);
    };

    const ImageUpload = ({
        title,
        description,
        file,
        setter,
        icon
    }) => {
        return (
            <div className="upload-card">

                <div className="upload-header">

                    <div className="upload-icon">
                        {icon}
                    </div>

                    <div>
                        <h3>{title}</h3>
                        <p>{description}</p>
                    </div>

                </div>

                {file ? (

                    <div className="preview-container">

                        <img
                            src={URL.createObjectURL(file)}
                            alt={title}
                            className="face-preview"
                        />

                        <div className="file-info">

                            <span>
                                {file.name}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    removeImage(setter)
                                }
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                ) : (

                    <label className="upload-area">

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                handleFileChange(
                                    e,
                                    setter
                                )
                            }
                        />

                        <div className="upload-plus">
                            +
                        </div>

                        <strong>
                            Upload photo
                        </strong>

                        <span>
                            JPG, PNG or WEBP
                        </span>

                    </label>

                )}

            </div>
        );
    };

    return (
        <div className="register-page">

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

                <div className="login-link">
                    Already have an account?

                    <Link to="/login">
                        Log in
                    </Link>
                </div>

            </nav>


            {/* =========================
                CONTENT
            ========================= */}

            <main className="register-container">

                <div className="intro">

                    <p className="eyebrow">
                        GET STARTED
                    </p>

                    <h1>
                        Create your
                        <br />
                        ClickPlix account.
                    </h1>

                    <p className="intro-text">
                        Register your face once and let
                        ClickPlix automatically find you
                        in photos shared by your groups.
                    </p>

                    <div className="steps">

                        <div className="step">

                            <div className="step-number">
                                01
                            </div>

                            <div>
                                <strong>
                                    Create your account
                                </strong>

                                <p>
                                    Add your basic information.
                                </p>
                            </div>

                        </div>


                        <div className="step">

                            <div className="step-number">
                                02
                            </div>

                            <div>
                                <strong>
                                    Register your face
                                </strong>

                                <p>
                                    Upload three different angles.
                                </p>
                            </div>

                        </div>


                        <div className="step">

                            <div className="step-number">
                                03
                            </div>

                            <div>
                                <strong>
                                    Connect Telegram
                                </strong>

                                <p>
                                    Receive photos automatically.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>


                {/* =========================
                    FORM
                ========================= */}

                <section className="form-card">

                    <div className="form-header">

                        <h2>
                            Create account
                        </h2>

                        <p>
                            It only takes a minute.
                        </p>

                    </div>


                    {/* ACCOUNT DETAILS */}

                    <div className="section-title">
                        Account details
                    </div>

                    <div className="input-group">

                        <label>
                            Full name
                        </label>

                        <input
                            type="text"
                            placeholder="e.g. Anshuman Rajpoot"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />

                    </div>


                    <div className="input-group">

                        <label>
                            Email address
                        </label>

                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>


                    <div className="input-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                    </div>


                    {/* FACE REGISTRATION */}

                    <div className="face-section">

                        <div className="section-heading">

                            <div>
                                <div className="section-title">
                                    Face registration
                                </div>

                                <p>
                                    Upload three clear photos
                                    of your face.
                                </p>
                            </div>

                            <span className="required">
                                3 required
                            </span>

                        </div>


                        <div className="upload-grid">

                            <ImageUpload
                                title="Front"
                                description="Look straight"
                                file={frontFace}
                                setter={setFrontFace}
                                icon="F"
                            />

                            <ImageUpload
                                title="Left"
                                description="Turn left"
                                file={leftFace}
                                setter={setLeftFace}
                                icon="L"
                            />

                            <ImageUpload
                                title="Right"
                                description="Turn right"
                                file={rightFace}
                                setter={setRightFace}
                                icon="R"
                            />

                        </div>

                    </div>


                    {/* MESSAGE */}

                    {message && (

                        <div
                            className={
                                message.includes(
                                    "successful"
                                )
                                    ? "message success"
                                    : "message error"
                            }
                        >
                            <span>
                                {message.includes(
                                    "successful"
                                )
                                    ? "✓"
                                    : "!"}
                            </span>

                            <p>
                                {message}
                            </p>
                        </div>

                    )}


                    {/* REGISTER BUTTON */}

                    <button
                        className="register-button"
                        onClick={handleRegister}
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                <span className="loader"></span>
                                Creating account...
                            </>

                        ) : (

                            <>
                                Create account
                                <span>→</span>
                            </>

                        )}

                    </button>


                    <p className="terms">
                        By creating an account, you agree to
                        use ClickPlix responsibly and only
                        register your own face.
                    </p>

                </section>

            </main>


            {/* =========================
                STYLES
            ========================= */}

            

        </div>
    );
}

export default Register;

