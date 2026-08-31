import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchGroups();
        fetchUser();
    }, []);

    // =========================
    // FETCH USER
    // =========================

    const fetchUser = async () => {
        try {
            const response = await api.get("/me");
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                navigate("/login");
            }
        }
    };

    // =========================
    // FETCH GROUPS
    // =========================

    const fetchGroups = async () => {
        try {
            const response = await api.get("/groups");
            setGroups(response.data.groups);
        } catch (error) {
            console.error("Failed to fetch groups:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            setMessage(
                error.response?.data?.detail ||
                "Could not load groups"
            );
        }
    };

    // =========================
    // COPY TELEGRAM CODE
    // =========================

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
            console.error(
                "Failed to copy code:",
                error
            );
        }
    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div className="dashboard">

            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="sidebar">

                {/* LOGO */}

<div className="logo">
    <Link to="/dashboard" className="logo-icon">
        C
    </Link>

    <span>
        ClickPlix
    </span>
</div>

                {/* NAVIGATION */}

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


                {/* =========================
                    SIDEBAR BOTTOM
                ========================= */}

                <div className="sidebar-bottom">

                    {/* =========================
                        CLICKABLE PROFILE CARD
                    ========================= */}

                    <Link
                        to="/profile"
                        className="user-mini"
                    >

                        <div className="avatar">

                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}

                        </div>


                        <div className="user-info">

                            <strong>
                                {user?.name || "Loading..."}
                            </strong>

                            <span>
                                {user?.email || ""}
                            </span>

                        </div>

                    </Link>


                    {/* =========================
                        LOGOUT BUTTON
                    ========================= */}

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >

                        <span>
                            ↪
                        </span>

                        Logout

                    </button>

                </div>

            </aside>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="main-content">

                {/* HEADER */}

                <header className="topbar">

                    <div>

                        <p className="eyebrow">
                            DASHBOARD
                        </p>

                        <h1>
                            Welcome back,{" "}
                            {user?.name
                                ?.split(" ")[0] ||
                                "there"} 👋
                        </h1>

                        <p className="subtitle">
                            Manage your groups and
                            share photos automatically.
                        </p>

                    </div>


                    <Link
                        to="/groups/create"
                        className="create-button"
                    >
                        + New Group
                    </Link>

                </header>


                {/* =========================
                    STATS
                ========================= */}

                <section className="stats-grid">

                    {/* GROUPS */}

                    <div className="stat-card">

                        <div className="stat-icon purple">
                            👥
                        </div>

                        <div>

                            <span>
                                Total Groups
                            </span>

                            <strong>
                                {groups.length}
                            </strong>

                        </div>

                    </div>


                    {/* PHOTO SHARING */}

                    <div className="stat-card">

                        <div className="stat-icon blue">
                            📷
                        </div>

                        <div>

                            <span>
                                Photo Sharing
                            </span>

                            <strong>
                                Active
                            </strong>

                        </div>

                    </div>


                    {/* TELEGRAM */}

                    <div className="stat-card">

                        <div className="stat-icon green">
                            ✈️
                        </div>

                        <div>

                            <span>
                                Telegram
                            </span>

                            <strong>
                                {user?.telegram_connected
                                    ? "Connected"
                                    : "Not Connected"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =========================
                    TELEGRAM
                ========================= */}

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
                                    ? "Your ClickPlix account is connected and ready to receive photos from your groups."
                                    : "Connect your Telegram account to automatically receive photos from your groups."}

                            </p>

                        </div>

                    </div>


                    {/* REGISTRATION CODE */}

                    {!user?.telegram_connected && (

                        <div className="registration-box">

                            <span>
                                Registration Code
                            </span>


                            <div className="code-row">

                                <strong>
                                    {user?.registration_code ||
                                        "------"}
                                </strong>


                                <button
                                    onClick={
                                        copyRegistrationCode
                                    }
                                    disabled={
                                        !user?.registration_code
                                    }
                                    className="copy-button"
                                >

                                    {copied
                                        ? "✓ Copied"
                                        : "Copy"}

                                </button>

                            </div>


                            <small>
                                Send this code to the
                                ClickPlix Telegram bot.
                            </small>

                        </div>

                    )}

                </section>


                {/* =========================
                    GROUP SECTION HEADER
                ========================= */}

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


                {/* =========================
                    GROUPS
                ========================= */}

                {groups.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            👥
                        </div>

                        <h3>
                            No groups yet
                        </h3>

                        <p>
                            Create your first group and
                            start automatically sharing
                            photos with your friends.
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


            {/* =========================
                PAGE STYLES
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


                /* =====================
                   DASHBOARD
                ===================== */

                .dashboard {
                    min-height: 100vh;

                    display: flex;

                    background: #f7f7fb;
                }


                /* =====================
                   SIDEBAR
                ===================== */

                .sidebar {
                    width: 250px;
                    min-height: 100vh;

                    background: #111116;
                    color: white;

                    padding: 28px 18px;

                    display: flex;
                    flex-direction: column;

                    position: fixed;

                    left: 0;
                    top: 0;
                    bottom: 0;
                }


                /* LOGO */

                .logo {
                    display: flex;
                    align-items: center;

                    gap: 11px;

                    padding: 0 12px;

                    margin-bottom: 50px;

                    font-size: 20px;
                    font-weight: 700;

                    letter-spacing: -0.5px;
                }


.logo-icon {
    width: 34px;
    height: 34px;

    border-radius: 10px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: white;
    color: #111116;

    font-weight: 800;

    text-decoration: none;
    cursor: pointer;
}


                /* =====================
                   NAVIGATION
                ===================== */

                .sidebar-nav {
                    display: flex;
                    flex-direction: column;

                    gap: 7px;
                }


                .nav-item {
                    text-decoration: none;

                    color: #92929c;

                    padding: 13px 14px;

                    border-radius: 10px;

                    display: flex;
                    align-items: center;

                    gap: 12px;

                    font-size: 14px;

                    transition: 0.2s;
                }


                .nav-item:hover {
                    color: white;
                    background: #1d1d24;
                }


                .nav-item.active {
                    background: #292932;
                    color: white;
                }


                .nav-item span {
                    font-size: 18px;
                }


                /* =====================
                   SIDEBAR BOTTOM
                ===================== */

                .sidebar-bottom {
                    margin-top: auto;
                }


                /* =====================
                   PROFILE CARD
                ===================== */

                .user-mini {
                    border-top: 1px solid #292930;

                    padding: 18px 8px 10px;

                    display: flex;

                    gap: 10px;

                    align-items: center;

                    text-decoration: none;

                    color: white;

                    cursor: pointer;

                    border-radius: 10px;

                    transition: 0.2s;
                }


                .user-mini:hover {
                    background: #1d1d24;
                }


                .avatar {
                    width: 36px;
                    height: 36px;

                    min-width: 36px;

                    border-radius: 50%;

                    background: #30303a;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    font-weight: 700;

                    color: white;
                }


                .user-info {
                    display: flex;

                    flex-direction: column;

                    min-width: 0;
                }


                .user-info strong {
                    font-size: 13px;

                    color: white;

                    white-space: nowrap;

                    overflow: hidden;

                    text-overflow: ellipsis;

                    max-width: 155px;
                }


                .user-info span {
                    font-size: 11px;

                    color: #777781;

                    white-space: nowrap;

                    overflow: hidden;

                    text-overflow: ellipsis;

                    max-width: 155px;
                }


                /* =====================
                   LOGOUT
                ===================== */

                .logout-button {
                    width: 100%;

                    margin-top: 8px;

                    padding: 11px 14px;

                    border: 1px solid #292930;

                    border-radius: 9px;

                    background: transparent;

                    color: #92929c;

                    display: flex;

                    align-items: center;

                    gap: 10px;

                    cursor: pointer;

                    font-size: 13px;

                    font-weight: 600;

                    transition: 0.2s;
                }


                .logout-button:hover {
                    background: #1d1d24;

                    color: white;
                }


                .logout-button span {
                    font-size: 17px;
                }


                /* =====================
                   MAIN
                ===================== */

                .main-content {
                    margin-left: 250px;

                    width: calc(100% - 250px);

                    max-width: 1400px;

                    padding: 45px 55px;
                }


                .topbar {
                    display: flex;

                    align-items: flex-end;

                    justify-content: space-between;

                    margin-bottom: 35px;
                }


                .eyebrow {
                    margin: 0 0 7px;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    color: #666670;
                }


                h1 {
                    margin: 0;

                    font-size: 34px;

                    letter-spacing: -1.2px;
                    color: #17171c;
                }


                .subtitle {
                    margin: 8px 0 0;
                    color: #55555f;
                    font-size: 14px;
                }


                /* =====================
                   BUTTON
                ===================== */

                .create-button {
                    display: inline-flex;

                    align-items: center;

                    justify-content: center;

                    text-decoration: none;

                    background: #111116;

                    color: white;

                    border: none;

                    padding: 12px 18px;

                    border-radius: 9px;

                    font-size: 13px;

                    font-weight: 600;

                    cursor: pointer;

                    transition: 0.2s;
                }


                .create-button:hover {
                    transform: translateY(-1px);

                    background: #292930;
                }


                /* =====================
                   STATS
                ===================== */

                .stats-grid {
                    display: grid;

                    grid-template-columns:
                        repeat(3, 1fr);

                    gap: 16px;

                    margin-bottom: 22px;
                }


                .stat-card {
                    background: white;

                    border: 1px solid #e9e9ee;

                    border-radius: 14px;

                    padding: 20px;

                    display: flex;

                    align-items: center;

                    gap: 15px;
                }


                .stat-icon {
                    width: 43px;
                    height: 43px;

                    border-radius: 11px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    font-size: 20px;
                }


                .purple {
                    background: #f0ebff;
                }


                .blue {
                    background: #e8f2ff;
                }


                .green {
                    background: #e8f8ef;
                }


                .stat-card div:last-child {
                    display: flex;

                    flex-direction: column;

                    gap: 4px;
                }


                .stat-card span {
                    font-size: 12px;

                    color: #858590;
                }


                .stat-card strong {
                    font-size: 18px;
                }


                /* =====================
                   TELEGRAM
                ===================== */

                .telegram-card {
                    background: #111116;

                    color: white;

                    border-radius: 16px;

                    padding: 25px;

                    display: flex;

                    justify-content: space-between;

                    align-items: center;

                    gap: 30px;

                    margin-bottom: 45px;
                }


                .telegram-left {
                    display: flex;

                    align-items: center;

                    gap: 18px;
                }


                .telegram-icon {
                    width: 50px;
                    height: 50px;

                    border-radius: 13px;

                    background: #27272f;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    font-size: 23px;
                }


                .card-label {
                    margin: 0 0 5px;

                    font-size: 10px;

                    letter-spacing: 1.4px;

                    color: #888892;

                    font-weight: 700;
                }


                .telegram-card h2 {
                    margin: 0;

                    font-size: 18px;
                }


                .telegram-card p {
                    margin: 6px 0 0;

                    font-size: 12px;

                    color: #9a9aa3;

                    max-width: 500px;
                }


                /* REGISTRATION BOX */

                .registration-box {
                    min-width: 270px;

                    background: #1b1b21;

                    border: 1px solid #2c2c34;

                    border-radius: 11px;

                    padding: 14px 16px;
                }


                .registration-box > span {
                    font-size: 10px;

                    color: #777780;

                    text-transform: uppercase;

                    letter-spacing: 1px;
                }


                .code-row {
                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    gap: 12px;

                    margin-top: 6px;
                }


                .code-row strong {
                    font-size: 20px;

                    letter-spacing: 3px;
                }


                .copy-button {
                    border: 0;

                    background: white;

                    color: #111116;

                    padding: 7px 11px;

                    border-radius: 7px;

                    cursor: pointer;

                    font-size: 11px;

                    font-weight: 600;

                    white-space: nowrap;
                }


                .copy-button:disabled {
                    cursor: not-allowed;

                    opacity: 0.5;
                }


                .registration-box small {
                    display: block;

                    color: #696970;

                    margin-top: 7px;

                    font-size: 10px;
                }


                /* =====================
                   SECTION
                ===================== */

                .section-header {
                    display: flex;

                    justify-content: space-between;

                    align-items: flex-end;

                    margin-bottom: 20px;
                }


                .section-header h2 {
                    margin: 0;

                    font-size: 24px;

                    letter-spacing: -0.6px;
                }


                .section-header a {
                    color: #55555f;

                    font-size: 12px;

                    text-decoration: none;
                }


                /* =====================
                   GROUPS
                ===================== */

                .groups-grid {
                    display: grid;

                    grid-template-columns:
                        repeat(3, 1fr);

                    gap: 16px;
                }


                .group-card {
                    background: white;

                    border: 1px solid #e9e9ee;

                    border-radius: 15px;

                    padding: 20px;

                    transition: 0.2s;
                }


                .group-card:hover {
                    transform: translateY(-2px);

                    box-shadow:
                        0 8px 30px
                        rgba(0,0,0,0.05);
                }


                .group-card-top {
                    position: relative;

                    display: flex;

                    justify-content: space-between;

                    margin-bottom: 18px;
                }


                .group-avatar {
                    width: 47px;
                    height: 47px;

                    border-radius: 12px;

                    background: #eeeeF2;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    font-size: 18px;

                    font-weight: 700;
                }


                .online-dot {
                    width: 8px;
                    height: 8px;

                    border-radius: 50%;

                    background: #55c47b;

                    margin-top: 4px;
                }


                .group-card h3 {
                    margin: 0;

                    font-size: 16px;
                }


                .members {
                    color: #898992;

                    font-size: 12px;

                    margin: 7px 0 20px;
                }


                .group-actions {
                    display: flex;

                    gap: 8px;
                }


                .secondary-button {
                    flex: 1;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    text-decoration: none;

                    color: #33333a;

                    background: #f3f3f6;

                    padding: 10px;

                    border-radius: 8px;

                    font-size: 12px;

                    font-weight: 600;
                }


                .camera-button {
                    width: 40px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    text-decoration: none;

                    color: white;

                    background: #111116;

                    border-radius: 8px;
                }


                /* =====================
                   EMPTY
                ===================== */

                .empty-state {
                    background: white;

                    border: 1px dashed #d8d8df;

                    border-radius: 15px;

                    padding: 55px 25px;

                    text-align: center;
                }


                .empty-icon {
                    font-size: 35px;

                    margin-bottom: 12px;
                }


                .empty-state h3 {
                    margin: 0;

                    font-size: 18px;
                }


                .empty-state p {
                    max-width: 430px;

                    margin: 8px auto 20px;

                    color: #858590;

                    font-size: 13px;

                    line-height: 1.6;
                }


                /* =====================
                   ERROR
                ===================== */

                .error-message {
                    background: #fff0f0;

                    color: #c23c3c;

                    border: 1px solid #ffd8d8;

                    padding: 12px 15px;

                    border-radius: 9px;

                    margin-bottom: 20px;

                    font-size: 13px;
                }


                /* =====================
                   RESPONSIVE
                ===================== */

                @media (max-width: 1000px) {

                    .stats-grid,
                    .groups-grid {

                        grid-template-columns:
                            repeat(2, 1fr);

                    }


                    .telegram-card {

                        flex-direction: column;

                        align-items: flex-start;

                    }


                    .registration-box {

                        width: 100%;

                    }

                }


                @media (max-width: 700px) {

                    .sidebar {

                        width: 65px;

                        padding: 20px 10px;

                    }


                    .logo span {

                        display: none;

                    }


                    .logo {

                        justify-content: center;

                        padding: 0;

                    }


                    .nav-item {

                        justify-content: center;

                        font-size: 0;

                    }


                    .nav-item span {

                        font-size: 20px;

                    }


                    .user-mini {

                        justify-content: center;

                        padding-left: 0;

                        padding-right: 0;

                    }


                    .user-info {

                        display: none;

                    }


                    .logout-button {

                        justify-content: center;

                        padding: 11px 0;

                        font-size: 0;

                    }


                    .logout-button span {

                        font-size: 20px;

                    }


                    .main-content {

                        margin-left: 65px;

                        width: calc(100% - 65px);

                        padding: 30px 20px;

                    }


                    .topbar {

                        align-items: flex-start;

                        flex-direction: column;

                        gap: 18px;

                    }


                    h1 {

                        font-size: 27px;

                    }


                    .stats-grid,
                    .groups-grid {

                        grid-template-columns: 1fr;

                    }


                    .telegram-left {

                        align-items: flex-start;

                    }

                }

            `}</style>

        </div>
    );
}

export default Dashboard;