
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const [groups, setGroups] = useState([]);
    const [message, setMessage] = useState("");

    // For now, we are using a fixed user ID.
    // Later, authentication will give us the real logged-in user.
    const userId = 8;

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await api.get(`/users/${userId}/groups`);

            setGroups(response.data.groups);
        } catch (error) {
            console.error("Failed to fetch groups:", error);
            setMessage("Could not load groups");
        }
    };

    return (
        <div>
            <h1>Clickplix Dashboard</h1>

            <h2>My Groups</h2>

            {message && <p>{message}</p>}

            {groups.length === 0 ? (
                <p>You haven't created any groups yet.</p>
            ) : (
                groups.map((group) => (
                    <div key={group.group_id}>
                        <h3>{group.group_name}</h3>

                        <p>
                            Members: {group.member_count}
                        </p>

                        <Link to={`/groups/${group.group_id}`}>
                            <button>
                                Open Group
                            </button>
                        </Link>

                        <Link to={`/camera/${group.group_id}`}>
                            <button>
                                📷 Click Photo
                            </button>
                        </Link>
                    </div>
                ))
            )}

            <br />

            <Link to="/groups/create">
                <button>
                    + Create Group
                </button>
            </Link>
        </div>
    );
}

export default Dashboard;

