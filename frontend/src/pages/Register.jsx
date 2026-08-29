import { useState } from "react";
import api from "../services/api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [frontFace, setFrontFace] = useState(null);
    const [leftFace, setLeftFace] = useState(null);
    const [rightFace, setRightFace] = useState(null);

    const [message, setMessage] = useState("");

const handleRegister = async () => {
    console.log("Register button clicked");

    try {
        const formData = new FormData();

        formData.append("name", name);
        formData.append("email", email);
        formData.append("front_face", frontFace);
        formData.append("left_face", leftFace);
        formData.append("right_face", rightFace);

        console.log("Sending request...");
        console.log("API BASE URL:",import.meta.env.VITE_API_URL)
        const response = await api.post("/users", formData);

        console.log("REQUEST SUCCESS");
        console.log("STATUS:", response.status);
        console.log("DATA:", response.data);

        setMessage(
            `Registration successful! Code: ${response.data.registration_code}`
        );

    } 
catch (error) {
    console.log("========== ERROR ==========");

    console.log("Error object:", error);
    console.log("Error message:", error.message);
    console.log("Response:", error.response);
    console.log("Response status:", error.response?.status);
    console.log("Response data:", error.response?.data);

    setMessage("Registration failed. Check console.");
}
};

    return (
        <div>
            <h1>Register Person</h1>

            <div>
                <label>Name</label>
                <br />

                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <br />

            <div>
                <label>Email</label>
                <br />

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <br />

            <div>
                <label>Front Face</label>
                <br />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFrontFace(e.target.files[0])}
                />
            </div>

            <br />

            <div>
                <label>Left Face</label>
                <br />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLeftFace(e.target.files[0])}
                />
            </div>

            <br />

            <div>
                <label>Right Face</label>
                <br />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setRightFace(e.target.files[0])}
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