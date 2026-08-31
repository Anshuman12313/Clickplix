
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

                .register-page {
                    min-height: 100vh;
                }

                /* NAVBAR */

                .navbar {
                    height: 72px;

                    padding: 0 55px;

                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    background:
                        rgba(255,255,255,0.9);

                    border-bottom:
                        1px solid #e8e8ed;
                }

                .brand {
                    display: flex;
                    align-items: center;

                    gap: 10px;

                    text-decoration: none;
                    color: #17171c;

                    font-weight: 750;
                    font-size: 18px;
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

                .login-link {
                    color: #888890;

                    font-size: 12px;
                }

                .login-link a {
                    margin-left: 6px;

                    color: #111116;

                    font-weight: 650;

                    text-decoration: none;
                }

                /* MAIN */

                .register-container {
                    width: 100%;
                    max-width: 1150px;

                    margin: auto;

                    padding:
                        65px 30px 90px;

                    display: grid;

                    grid-template-columns:
                        0.85fr 1.15fr;

                    gap: 80px;

                    align-items: start;
                }

                /* INTRO */

                .intro {
                    padding-top: 20px;
                }

                .eyebrow {
                    margin: 0 0 12px;

                    font-size: 10px;

                    font-weight: 750;

                    letter-spacing: 1.7px;

                    color: #92929a;
                }

                .intro h1 {
                    margin: 0;

                    font-size: 42px;

                    line-height: 1.08;

                    letter-spacing: -1.8px;
                }

                .intro-text {
                    max-width: 420px;

                    margin:
                        20px 0 40px;

                    color: #777780;

                    font-size: 13px;

                    line-height: 1.7;
                }

                /* STEPS */

                .steps {
                    display: flex;
                    flex-direction: column;

                    gap: 24px;
                }

                .step {
                    display: flex;
                    align-items: flex-start;

                    gap: 14px;
                }

                .step-number {
                    width: 34px;
                    height: 34px;

                    flex-shrink: 0;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border:
                        1px solid #dedee5;

                    border-radius: 9px;

                    font-size: 9px;

                    font-weight: 750;

                    color: #777780;

                    background: white;
                }

                .step strong {
                    display: block;

                    margin-top: 1px;

                    font-size: 12px;
                }

                .step p {
                    margin: 4px 0 0;

                    font-size: 10px;

                    color: #9999a1;
                }

                /* FORM */

                .form-card {
                    padding: 30px;

                    background: white;

                    border:
                        1px solid #e4e4e9;

                    border-radius: 16px;

                    box-shadow:
                        0 16px 45px
                        rgba(20,20,30,0.06);
                }

                .form-header {
                    margin-bottom: 27px;
                }

                .form-header h2 {
                    margin: 0;

                    font-size: 20px;

                    letter-spacing: -0.5px;
                }

                .form-header p {
                    margin: 5px 0 0;

                    color: #9999a1;

                    font-size: 11px;
                }

                .section-title {
                    margin-bottom: 11px;

                    font-size: 10px;

                    font-weight: 750;

                    letter-spacing: 0.8px;

                    text-transform: uppercase;

                    color: #707078;
                }

                .input-group {
                    margin-bottom: 15px;
                }

                .input-group label {
                    display: block;

                    margin-bottom: 6px;

                    font-size: 11px;

                    font-weight: 600;

                    color: #55555d;
                }

                .input-group input {
                    width: 100%;

                    height: 43px;

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
                        box-shadow 0.15s;
                }

                .input-group input:focus {
                    border-color: #111116;

                    background: white;

                    box-shadow:
                        0 0 0 3px
                        rgba(20,20,25,0.06);
                }

                .input-group input::placeholder {
                    color: #b5b5bc;
                }

                /* FACE */

                .face-section {
                    margin-top: 28px;

                    padding-top: 24px;

                    border-top:
                        1px solid #eeeeF2;
                }

                .section-heading {
                    display: flex;
                    justify-content: space-between;

                    align-items: flex-start;

                    margin-bottom: 13px;
                }

                .section-heading p {
                    margin: -5px 0 0;

                    color: #9999a1;

                    font-size: 10px;
                }

                .required {
                    padding:
                        5px 8px;

                    border-radius: 6px;

                    background: #f1f1f4;

                    color: #777780;

                    font-size: 9px;

                    font-weight: 700;
                }

                .upload-grid {
                    display: grid;

                    grid-template-columns:
                        repeat(3, 1fr);

                    gap: 9px;
                }

                .upload-card {
                    padding: 10px;

                    border:
                        1px solid #e3e3e8;

                    border-radius: 10px;

                    background: #fafafc;
                }

                .upload-header {
                    display: flex;

                    align-items: center;

                    gap: 8px;

                    margin-bottom: 9px;
                }

                .upload-icon {
                    width: 25px;
                    height: 25px;

                    border-radius: 7px;

                    background: #eeeeF2;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    font-size: 9px;

                    font-weight: 800;

                    color: #66666e;
                }

                .upload-header h3 {
                    margin: 0;

                    font-size: 10px;
                }

                .upload-header p {
                    margin: 2px 0 0;

                    font-size: 8px;

                    color: #9999a1;
                }

                .upload-area {
                    height: 135px;

                    border:
                        1px dashed #d5d5dc;

                    border-radius: 8px;

                    display: flex;

                    flex-direction: column;

                    align-items: center;

                    justify-content: center;

                    cursor: pointer;

                    background: white;

                    transition:
                        border-color 0.15s,
                        background 0.15s;
                }

                .upload-area:hover {
                    border-color: #9999a1;

                    background: #fafafa;
                }

                .upload-area input {
                    display: none;
                }

                .upload-plus {
                    width: 27px;
                    height: 27px;

                    border-radius: 50%;

                    background: #f0f0f3;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    font-size: 17px;

                    color: #777780;

                    margin-bottom: 7px;
                }

                .upload-area strong {
                    font-size: 9px;

                    color: #55555d;
                }

                .upload-area span {
                    margin-top: 3px;

                    font-size: 7px;

                    color: #aaaaaf;
                }

                /* PREVIEW */

                .preview-container {
                    height: 135px;

                    overflow: hidden;

                    border-radius: 8px;

                    background: #111116;

                    position: relative;
                }

                .face-preview {
                    width: 100%;
                    height: 100%;

                    object-fit: cover;
                }

                .file-info {
                    position: absolute;

                    left: 5px;
                    right: 5px;
                    bottom: 5px;

                    padding:
                        5px 6px;

                    border-radius: 5px;

                    background:
                        rgba(0,0,0,0.7);

                    display: flex;

                    align-items: center;
                    justify-content: space-between;

                    gap: 5px;
                }

                .file-info span {
                    overflow: hidden;

                    white-space: nowrap;

                    text-overflow: ellipsis;

                    color: white;

                    font-size: 7px;
                }

                .file-info button {
                    border: none;

                    background: transparent;

                    color: #ffaaaa;

                    font-size: 7px;

                    cursor: pointer;
                }

                /* MESSAGE */

                .message {
                    margin-top: 17px;

                    padding:
                        11px 12px;

                    border-radius: 8px;

                    display: flex;

                    gap: 8px;

                    align-items: flex-start;

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
                        1px solid #ffdcdc;

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

                /* BUTTON */

                .register-button {
                    width: 100%;

                    height: 46px;

                    margin-top: 18px;

                    border: none;

                    border-radius: 8px;

                    background: #111116;

                    color: white;

                    font-size: 11px;

                    font-weight: 650;

                    cursor: pointer;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    gap: 9px;

                    transition:
                        transform 0.15s,
                        background 0.15s;
                }

                .register-button:hover:not(:disabled) {
                    background: #25252c;

                    transform:
                        translateY(-1px);
                }

                .register-button:disabled {
                    opacity: 0.55;

                    cursor: not-allowed;
                }

                .register-button span {
                    font-size: 15px;
                }

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
                        transform: rotate(360deg);
                    }
                }

                .terms {
                    margin: 13px 15px 0;

                    text-align: center;

                    color: #aaaab1;

                    font-size: 8px;

                    line-height: 1.5;
                }

                /* MOBILE */

                @media (max-width: 850px) {

                    .register-container {
                        grid-template-columns: 1fr;

                        max-width: 600px;

                        gap: 35px;

                        padding-top: 40px;
                    }

                    .intro {
                        padding-top: 0;
                    }

                    .intro h1 {
                        font-size: 34px;
                    }

                    .steps {
                        display: none;
                    }

                }

                @media (max-width: 550px) {

                    .navbar {
                        padding: 0 18px;
                    }

                    .register-container {
                        padding:
                            30px 15px 60px;
                    }

                    .form-card {
                        padding: 20px;
                    }

                    .upload-grid {
                        grid-template-columns: 1fr;
                    }

                    .upload-area,
                    .preview-container {
                        height: 160px;
                    }

                    .intro h1 {
                        font-size: 30px;
                    }

                }

            `}</style>

        </div>
    );
}

export default Register;

