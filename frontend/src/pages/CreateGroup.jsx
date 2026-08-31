
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
            

        </div>
    );
}

export default CreateGroup;

