
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function Group() {
    const { groupId } = useParams();

    const [group, setGroup] = useState(null);
    const [registrationCode, setRegistrationCode] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchGroup();
    }, []);

    const fetchGroup = async () => {
        try {
            const response = await api.get(
                `/groups/${groupId}`
            );

            console.log("Group:", response.data);

            setGroup(response.data);

        } catch (error) {
            console.error("Failed to load group:", error);

            setMessage(
                error.response?.data?.detail ||
                "Failed to load group"
            );
        }
    };

    const handleAddMember = async () => {
        if (!registrationCode.trim()) {
            setMessage("Enter a registration code");
            return;
        }

        try {
            const formData = new FormData();

            formData.append(
                "registration_code",
                registrationCode
            );

            const response = await api.post(
                `/groups/${groupId}/members`,
                formData
            );

            console.log("Member added:", response.data);

            setMessage("Member added successfully!");

            setRegistrationCode("");

            // Reload group so the new member appears
            fetchGroup();

        } catch (error) {
            console.error("Failed to add member:", error);

            setMessage(
                error.response?.data?.detail ||
                "Failed to add member"
            );
        }
    };

    if (!group) {
        return (
            <div>
                <h1>Loading group...</h1>
                <p>{message}</p>
            </div>
        );
    }

    return (
        <div>
            <h1>{group.group_name}</h1>

            <p>
                Members: {group.members.length}
            </p>

            <hr />

            <h2>Members</h2>

            {group.members.length === 0 ? (
                <p>No members yet.</p>
            ) : (
                <ul>
                    {group.members.map((member) => (
                        <li key={member.user_id}>
                            {member.name}
                        </li>
                    ))}
                </ul>
            )}

            <hr />

            <h2>Add Member</h2>

            <input
                type="text"
                placeholder="Enter registration code"
                value={registrationCode}
                onChange={(e) =>
                    setRegistrationCode(e.target.value)
                }
            />

            <button onClick={handleAddMember}>
                Add Member
            </button>

            <p>{message}</p>

            <hr />

            <Link to={`/camera/${groupId}`}>
                <button>
                    📷 Click Photo
                </button>
            </Link>

            <br />
            <br />

            <Link to="/dashboard">
                <button>
                    ← Back to Dashboard
                </button>
            </Link>
        </div>
    );
}

export default Group;

