
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

    const fetchUser = async () => {
        try {
            const response = await api.get("/me");
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await api.get("/groups");
            setGroups(response.data.groups);
        } catch (error) {
            console.error("Failed to fetch groups:", error);

            setMessage(
                error.response?.data?.detail ||
                "Could not load groups"
            );
        }
    };

    const copyRegistrationCode = async () => {
        if (!user?.registration_code) return;

        try {
            await navigator.clipboard.writeText(
                user.registration_code
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy code:", error);
        }
    };

    return (
        <div className="dashboard">

            {/* SIDEBAR */}
            <aside className="sidebar">

                <div className="logo">
                    <div className="logo-icon">C</div>
                    <span>ClickPlix</span>
                </div>

                <nav className="sidebar-nav">

                    <Link
                        to="/dashboard"
                        className="nav-item active"
                    >
                        <span>⌂</span>
                        Dashboard
                    </Link>

                    <Link
                        to="/groups/create"
                        className="nav-item"
                    >
                        <span>＋</span>
                        Create Group
                    </Link>

                </nav>

                <div className="sidebar-bottom">

                    <div className="user-mini">

                        <div className="avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div>
                            <strong>
                                {user?.name || "Loading..."}
                            </strong>

                            <span>
                                {user?.email || ""}
                            </span>
                        </div>

                    </div>

                </div>

            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content">

                {/* HEADER */}
                <header className="topbar">

                    <div>
                        <p className="eyebrow">
                            DASHBOARD
                        </p>

                        <h1>
                            Welcome back,{" "}
                            {user?.name?.split(" ")[0] || "there"} 👋
                        </h1>

                        <p className="subtitle">
                            Manage your groups and share photos
                            automatically.
                        </p>
                    </div>

                    <Link
                        to="/groups/create"
                        className="create-button"
                    >
                        + New Group
                    </Link>

                </header>


                {/* STATS */}
                <section className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon purple">
                            👥
                        </div>

                        <div>
                            <span>Total Groups</span>
                            <strong>{groups.length}</strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon blue">
                            📷
                        </div>

                        <div>
                            <span>Photo Sharing</span>
                            <strong>Active</strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon green">
                            ✈️
                        </div>

                        <div>
                            <span>Telegram</span>

                            <strong>
                                {user?.telegram_connected
                                    ? "Connected"
                                    : "Not Connected"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* TELEGRAM */}
                <section className="telegram-card">

                    <div className="telegram-left">

                        <div className="telegram-icon">
                            ✈
                        </div>

                        <div>

                            <p className="card-label">
                                TELEGRAM
                            </p>

                            <h2>
                                {user?.telegram_connected
                                    ? "Telegram Connected"
                                    : "Connect your Telegram"}
                            </h2>

                            <p>
                                {user?.telegram_connected
                                    ? "Your ClickPlix account is connected and ready to receive photos."
                                    : "Connect your Telegram account to automatically receive photos from your groups."}
                            </p>

                        </div>

                    </div>


                    {!user?.telegram_connected && (

                        <div className="registration-box">

                            <span>
                                Registration Code
                            </span>

                            <div className="code-row">

                                <strong>
                                    {user?.registration_code || "------"}
                                </strong>

                                <button
                                    onClick={copyRegistrationCode}
                                    disabled={!user?.registration_code}
                                    className="copy-button"
                                >
                                    {copied
                                        ? "✓ Copied"
                                        : "Copy"}
                                </button>

                            </div>

                            <small>
                                Send this code to the ClickPlix
                                Telegram bot.
                            </small>

                        </div>

                    )}

                </section>


                {/* GROUPS HEADER */}
                <div className="section-header">

                    <div>
                        <p className="eyebrow">
                            YOUR COMMUNITY
                        </p>

                        <h2>
                            My Groups
                        </h2>
                    </div>

                    <Link to="/groups/create">
                        View all →
                    </Link>

                </div>


                {/* ERROR */}
                {message && (
                    <div className="error-message">
                        {message}
                    </div>
                )}


                {/* GROUPS */}
                {groups.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            👥
                        </div>

                        <h3>
                            No groups yet
                        </h3>

                        <p>
                            Create your first group and start
                            automatically sharing photos with
                            your friends.
                        </p>

                        <Link
                            to="/groups/create"
                            className="create-button"
                        >
                            + Create Your First Group
                        </Link>

                    </div>

                ) : (

                    <div className="groups-grid">

                        {groups.map((group) => (

                            <div
                                className="group-card"
                                key={group.group_id}
                            >

                                <div className="group-card-top">

                                    <div className="group-avatar">
                                        {group.group_name
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                    <span className="online-dot"></span>

                                </div>

                                <h3>
                                    {group.group_name}
                                </h3>

                                <p className="members">
                                    👥 {group.member_count}{" "}
                                    {group.member_count === 1
                                        ? "member"
                                        : "members"}
                                </p>

                                <div className="group-actions">

                                    <Link
                                        to={`/groups/${group.group_id}`}
                                        className="secondary-button"
                                    >
                                        Open Group
                                    </Link>

                                    <Link
                                        to={`/camera/${group.group_id}`}
                                        className="camera-button"
                                    >
                                        📷
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>


            {/* PAGE STYLES */}
            

        </div>
    );
}

export default Dashboard;

