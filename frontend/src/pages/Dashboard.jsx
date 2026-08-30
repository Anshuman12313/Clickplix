
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {

    const [groups, setGroups] = useState([]);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchGroups();
        fetchUser();
    }, []);

    // =========================
    // GET USER INFORMATION
    // =========================

    const fetchUser = async () => {

        try {

            const response = await api.get("/me");

            console.log("USER RESPONSE:", response.data);

            setUser(response.data);

        } catch (error) {

            console.error("Failed to fetch user:", error);

            console.log(
                "STATUS:",
                error.response?.status
            );

            console.log(
                "DATA:",
                error.response?.data
            );

        }
    };

    // =========================
    // GET GROUPS
    // =========================

    const fetchGroups = async () => {

        try {

            const response = await api.get("/groups");

            console.log("GROUP RESPONSE:", response.data);

            setGroups(response.data.groups);

        } catch (error) {

            console.error("Failed to fetch groups:", error);

            console.log(
                "STATUS:",
                error.response?.status
            );

            console.log(
                "DATA:",
                error.response?.data
            );

            setMessage(
                error.response?.data?.detail ||
                "Could not load groups"
            );
        }
    };

    // =========================
    // COPY REGISTRATION CODE
    // =========================

    const copyRegistrationCode = async () => {

        if (!user?.registration_code) {
            return;
        }

        try {

            await navigator.clipboard.writeText(
                user.registration_code
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (error) {

            console.error(
                "Failed to copy code:",
                error
            );

        }
    };

    return (
        <div>

            <h1>Clickplix Dashboard</h1>

            {/* ========================= */}
            {/* USER INFORMATION */}
            {/* ========================= */}

            {user && (
                <div>

                    <h2>
                        Welcome, {user.name}
                    </h2>

                    <p>
                        Email: {user.email}
                    </p>

                </div>
            )}

            <hr />

            {/* ========================= */}
            {/* TELEGRAM CONNECTION */}
            {/* ========================= */}

            <div>

                <h2>Telegram</h2>

                {user?.telegram_connected ? (

                    <div>

                        <h3>
                            ✓ Telegram Connected
                        </h3>

                        <p>
                            Your Telegram account is connected
                            to Clickplix.
                        </p>

                    </div>

                ) : (

                    <div>

                        <h3>
                            Connect Your Telegram
                        </h3>

                        <p>
                            Use the registration code below
                            to connect your Telegram account
                            with Clickplix.
                        </p>

                        <p>
                            <strong>
                                Registration Code:
                            </strong>
                        </p>

                        <h2>
                            {user?.registration_code || "Loading..."}
                        </h2>

                        <button
                            onClick={copyRegistrationCode}
                            disabled={!user?.registration_code}
                        >
                            {copied ? "✓ Copied!" : "Copy Code"}
                        </button>

                        <p>
                            Open the Clickplix Telegram bot
                            and send this registration code.
                        </p>

                    </div>

                )}

            </div>

            <hr />

            {/* ========================= */}
            {/* GROUPS */}
            {/* ========================= */}

            <h2>My Groups</h2>

            {message && (
                <p>{message}</p>
            )}

            {groups.length === 0 ? (

                <p>
                    You haven't created or joined any groups yet.
                </p>

            ) : (

                groups.map((group) => (

                    <div key={group.group_id}>

                        <h3>
                            {group.group_name}
                        </h3>

                        <p>
                            Members: {group.member_count}
                        </p>

                        <Link
                            to={`/groups/${group.group_id}`}
                        >
                            <button>
                                Open Group
                            </button>
                        </Link>

                        {" "}

                        <Link
                            to={`/camera/${group.group_id}`}
                        >
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

