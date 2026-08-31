
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateGroup() {
    const [groupName, setGroupName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            setMessage("Please enter a group name");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const formData = new FormData();
            formData.append("name", groupName.trim());

            const response = await api.post(
                "/groups",
                formData
            );

            console.log("Group created:", response.data);

            setMessage("Group created successfully!");

            setTimeout(() => {
                navigate("/dashboard");
            }, 800);

        } catch (error) {
            console.error("Group creation failed:", error);

            setMessage(
                error.response?.data?.detail ||
                "Failed to create group"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-page">

            {/* TOP NAV */}
            <header className="top-nav">

                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

                <div className="brand">
                    <div className="brand-icon">C</div>
                    <span>ClickPlix</span>
                </div>

                <div className="nav-placeholder"></div>

            </header>


            {/* MAIN */}
            <main className="create-container">

                <div className="create-card">

                    {/* ICON */}
                    <div className="group-icon">
                        👥
                    </div>

                    <p className="eyebrow">
                        NEW GROUP
                    </p>

                    <h1>
                        Create a group
                    </h1>

                    <p className="description">
                        Bring your friends together and let
                        ClickPlix automatically share photos
                        with the right people.
                    </p>


                    {/* FORM */}
                    <div className="form-section">

                        <label htmlFor="groupName">
                            Group name
                        </label>

                        <input
                            id="groupName"
                            type="text"
                            placeholder="e.g. College Friends"
                            value={groupName}
                            onChange={(e) => {
                                setGroupName(e.target.value);
                                setMessage("");
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleCreateGroup();
                                }
                            }}
                            autoFocus
                        />

                        <span className="input-hint">
                            Choose a name that your group members
                            will recognize.
                        </span>

                    </div>


                    {/* MESSAGE */}
                    {message && (
                        <div
                            className={
                                message.includes("successfully")
                                    ? "message success"
                                    : "message error"
                            }
                        >
                            <span>
                                {message.includes("successfully")
                                    ? "✓"
                                    : "!"}
                            </span>

                            {message}
                        </div>
                    )}


                    {/* ACTIONS */}
                    <div className="actions">

                        <button
                            className="cancel-button"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            className="create-button"
                            onClick={handleCreateGroup}
                            disabled={
                                loading ||
                                !groupName.trim()
                            }
                        >
                            {loading
                                ? "Creating..."
                                : "Create Group →"}
                        </button>

                    </div>

                </div>


                {/* FOOTER TEXT */}
                <p className="bottom-text">
                    You can add members after creating the group.
                </p>

            </main>


            {/* STYLES */}
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

                .create-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(
                            circle at 50% 20%,
                            #ffffff 0%,
                            #f7f7fb 55%
                        );
                }

                /* NAV */

                .top-nav {
                    height: 72px;
                    padding: 0 45px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #e9e9ee;
                    background: rgba(255,255,255,0.8);
                    backdrop-filter: blur(10px);
                }

                .brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 18px;
                    font-weight: 700;
                }

                .brand-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 9px;
                    background: #111116;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                }

                .back-button {
                    border: none;
                    background: transparent;
                    color: #66666f;
                    cursor: pointer;
                    font-size: 13px;
                    padding: 8px 0;
                }

                .back-button:hover {
                    color: #111116;
                }

                .nav-placeholder {
                    width: 100px;
                }

                /* MAIN */

                .create-container {
                    min-height:
                        calc(100vh - 72px);

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;

                    padding: 40px 20px;
                }

                .create-card {
                    width: 100%;
                    max-width: 510px;

                    background: white;
                    border: 1px solid #e5e5eb;
                    border-radius: 20px;

                    padding: 42px;

                    box-shadow:
                        0 15px 50px rgba(20,20,30,0.06);
                }

                /* ICON */

                .group-icon {
                    width: 58px;
                    height: 58px;
                    border-radius: 16px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background: #f0ebff;
                    font-size: 27px;

                    margin-bottom: 25px;
                }

                .eyebrow {
                    margin: 0 0 7px;

                    color: #888891;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                }

                h1 {
                    margin: 0;

                    font-size: 32px;
                    letter-spacing: -1px;
                }

                .description {
                    margin: 10px 0 30px;

                    color: #777780;
                    font-size: 14px;
                    line-height: 1.65;
                }

                /* FORM */

                .form-section {
                    display: flex;
                    flex-direction: column;
                }

                .form-section label {
                    margin-bottom: 8px;

                    font-size: 13px;
                    font-weight: 600;
                }

                .form-section input {
                    width: 100%;
                    height: 50px;

                    padding: 0 15px;

                    border: 1px solid #dcdce3;
                    border-radius: 9px;

                    outline: none;

                    font-size: 14px;
                    color: #17171c;

                    transition: 0.2s;
                }

                .form-section input::placeholder {
                    color: #aaaab2;
                }

                .form-section input:focus {
                    border-color: #111116;

                    box-shadow:
                        0 0 0 3px
                        rgba(17,17,22,0.06);
                }

                .input-hint {
                    margin-top: 8px;

                    color: #9999a1;
                    font-size: 11px;
                }

                /* MESSAGE */

                .message {
                    margin-top: 18px;

                    display: flex;
                    align-items: center;
                    gap: 9px;

                    padding: 12px 14px;

                    border-radius: 9px;

                    font-size: 12px;
                }

                .message span {
                    width: 18px;
                    height: 18px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 50%;

                    font-weight: 700;
                }

                .success {
                    color: #287347;
                    background: #ecf8f0;
                    border: 1px solid #d5efdf;
                }

                .success span {
                    background: #287347;
                    color: white;
                }

                .error {
                    color: #b63d3d;
                    background: #fff0f0;
                    border: 1px solid #ffdada;
                }

                .error span {
                    background: #b63d3d;
                    color: white;
                }

                /* ACTIONS */

                .actions {
                    display: flex;
                    gap: 10px;

                    margin-top: 30px;
                }

                .actions button {
                    height: 45px;

                    border-radius: 9px;

                    font-size: 13px;
                    font-weight: 600;

                    cursor: pointer;

                    transition: 0.2s;
                }

                .cancel-button {
                    flex: 1;

                    border: 1px solid #dedee5;
                    background: white;
                    color: #55555e;
                }

                .cancel-button:hover {
                    background: #f7f7f9;
                }

                .create-button {
                    flex: 1.5;

                    border: none;
                    background: #111116;
                    color: white;
                }

                .create-button:hover:not(:disabled) {
                    background: #292930;
                    transform: translateY(-1px);
                }

                .create-button:disabled {
                    opacity: 0.45;
                    cursor: not-allowed;
                }

                .bottom-text {
                    margin-top: 18px;

                    color: #9999a1;
                    font-size: 11px;
                    text-align: center;
                }

                /* MOBILE */

                @media (max-width: 600px) {

                    .top-nav {
                        padding: 0 20px;
                    }

                    .nav-placeholder {
                        display: none;
                    }

                    .create-card {
                        padding: 30px 24px;
                    }

                    h1 {
                        font-size: 27px;
                    }

                }

            `}</style>

        </div>
    );
}

export default CreateGroup;

