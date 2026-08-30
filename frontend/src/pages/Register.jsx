
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [frontFace, setFrontFace] = useState(null);
    const [leftFace, setLeftFace] = useState(null);
    const [rightFace, setRightFace] = useState(null);

    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {

        console.log("Register button clicked");

        // Basic validation
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

        if (!frontFace || !leftFace || !rightFace) {
            setMessage(
                "Please upload all three face images"
            );
            return;
        }

        try {

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

            console.log("Sending registration request...");

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

            // Clear fields
            setName("");
            setEmail("");
            setPassword("");

            setFrontFace(null);
            setLeftFace(null);
            setRightFace(null);

            // Optional: go to login after registration
            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (error) {

            console.log("========== ERROR ==========");

            console.log(
                "Error object:",
                error
            );

            console.log(
                "Error message:",
                error.message
            );

            console.log(
                "Response:",
                error.response
            );

            console.log(
                "Response status:",
                error.response?.status
            );

            console.log(
                "Response data:",
                error.response?.data
            );

            setMessage(
                error.response?.data?.detail ||
                "Registration failed"
            );
        }
    };

    return (
        <div>

            <h1>Register Person</h1>

            {/* =========================
                NAME
            ========================= */}

            <div>
                <label>Name</label>
                <br />

                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />
            </div>

            <br />

            {/* =========================
                EMAIL
            ========================= */}

            <div>
                <label>Email</label>
                <br />

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />
            </div>

            <br />

            {/* =========================
                PASSWORD
            ========================= */}

            <div>
                <label>Password</label>
                <br />

                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />
            </div>

            <br />

            {/* =========================
                FRONT FACE
            ========================= */}

            <div>
                <label>Front Face</label>
                <br />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setFrontFace(
                            e.target.files[0]
                        )
                    }
                />
            </div>

            <br />

            {/* =========================
                LEFT FACE
            ========================= */}

            <div>
                <label>Left Face</label>
                <br />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setLeftFace(
                            e.target.files[0]
                        )
                    }
                />
            </div>

            <br />

            {/* =========================
                RIGHT FACE
            ========================= */}

            <div>
                <label>Right Face</label>
                <br />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setRightFace(
                            e.target.files[0]
                        )
                    }
                />
            </div>

            <br />

            <button onClick={handleRegister}>
                Register
            </button>

            <p>{message}</p>

        </div>
    );
}

export default Register;
