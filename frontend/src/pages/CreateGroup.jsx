
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateGroup() {
    const [groupName, setGroupName] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    // Temporary user ID
    // Later this will come from authentication
    const ownerId = 8;

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            setMessage("Please enter a group name");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("name", groupName);
            formData.append("owner_id", ownerId);

            const response = await api.post(
                "/groups",
                formData
            );

            console.log("Group created:", response.data);

            setMessage("Group created successfully!");

            // Go back to dashboard
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (error) {
            console.error("Group creation failed:", error);

            setMessage(
                error.response?.data?.detail ||
                "Failed to create group"
            );
        }
    };

    return (
        <div>
            <h1>Create Group</h1>

            <label>Group Name</label>

            <br />

            <input
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
            />

            <br />
            <br />

            <button onClick={handleCreateGroup}>
                Create Group
            </button>

            <p>{message}</p>
        </div>
    );
}

export default CreateGroup;
