import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Profile() {
    const [user, setUser] = useState(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get("/me");
            console.log("PROFILE DATA:", response.data);
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);

            setMessage(
                error.response?.data?.detail ||
                "Failed to load profile"
            );
        } finally {
            setLoading(false);
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

    if (loading) {
        return (
            <div className="profile-loading">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="profile-page">

            {/* ================= SIDEBAR ================= */}

            <aside className="sidebar">

<div className="logo">
    <Link to="/dashboard" className="logo-icon">
        C
    </Link>
    <span>ClickPlix</span>
</div>

                <nav className="sidebar-nav">

                    <Link
                        to="/dashboard"
                        className="nav-item"
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

                    <Link
                        to="/profile"
                        className="nav-item active"
                    >
                        <span>◯</span>
                        Profile
                    </Link>

                </nav>

            </aside>


            {/* ================= MAIN ================= */}

            <main className="main-content">

                {/* HEADER */}

                <div className="topbar">

                    <div>

                        <p className="eyebrow">
                            ACCOUNT
                        </p>

                        <h1>
                            My Profile
                        </h1>

                        <p className="subtitle">
                            View your ClickPlix account information.
                        </p>

                    </div>

                    <Link
                        to="/dashboard"
                        className="back-button"
                    >
                        ← Dashboard
                    </Link>

                </div>


                {/* ERROR */}

                {message && (
                    <div className="error-message">
                        {message}
                    </div>
                )}


                {/* ================= PROFILE ================= */}

                {user && (

                    <section className="profile-card">

                        {/* PROFILE HEADER */}

                        <div className="profile-header">

                            <div className="large-avatar">
                                {user.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                            </div>

                            <div>

                                <h2>
                                    {user.name}
                                </h2>

                                <p>
                                    {user.email}
                                </p>

                            </div>

                        </div>


                        {/* ================= ACCOUNT INFO ================= */}

                        <div className="section">

                            <p className="section-label">
                                ACCOUNT INFORMATION
                            </p>

                            <div className="info-row">

                                <span>
                                    User ID
                                </span>

                                <strong>
                                    #{user.id}
                                </strong>

                            </div>


                            <div className="info-row">

                                <span>
                                    Full Name
                                </span>

                                <strong>
                                    {user.name}
                                </strong>

                            </div>


                            <div className="info-row">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {user.email}
                                </strong>

                            </div>

                        </div>


                        {/* ================= TELEGRAM ================= */}

                        <div className="section">

                            <p className="section-label">
                                TELEGRAM
                            </p>


                            <div className="telegram-status">

                                <div>

                                    <h3>
                                        Telegram
                                    </h3>

                                    <p>
                                        {user.telegram_connected
                                            ? "Your Telegram account is connected."
                                            : "Your Telegram account is not connected yet."}
                                    </p>

                                </div>


                                <span
                                    className={
                                        user.telegram_connected
                                            ? "status connected"
                                            : "status disconnected"
                                    }
                                >
                                    {user.telegram_connected
                                        ? "Connected"
                                        : "Not Connected"}
                                </span>

                            </div>


                            {/* ================= REGISTRATION CODE ================= */}

                            {user.registration_code ? (

                                <div className="registration-box">

                                    <div className="registration-header">

                                        <div>

                                            <span>
                                                Registration Code
                                            </span>

                                            <p>
                                                Use this code to add/connect
                                                this user through Telegram.
                                            </p>

                                        </div>

                                        <div className="code-status">
                                            Permanent
                                        </div>

                                    </div>


                                    <div className="code-row">

                                        <strong>
                                            {user.registration_code}
                                        </strong>

                                        <button
                                            onClick={
                                                copyRegistrationCode
                                            }
                                        >
                                            {copied
                                                ? "✓ Copied"
                                                : "Copy"}
                                        </button>

                                    </div>


                                    <small>
                                        Keep this code safe. You can use it
                                        when adding this user to a group.
                                    </small>

                                </div>

                            ) : (

                                <div className="no-code-box">

                                    <strong>
                                        Registration code not available
                                    </strong>

                                    <p>
                                        No registration code was returned
                                        by the server.
                                    </p>

                                </div>

                            )}

                        </div>

                    </section>

                )}

            </main>


            {/* ================= STYLES ================= */}

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


                .profile-page {
                    min-height: 100vh;

                    display: flex;

                    background: #f7f7fb;
                }


                /* ================= SIDEBAR ================= */

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


                .logo {
                    display: flex;

                    align-items: center;

                    gap: 11px;

                    padding: 0 12px;

                    margin-bottom: 50px;

                    font-size: 20px;

                    font-weight: 700;
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


                /* ================= MAIN ================= */

                .main-content {
                    margin-left: 250px;

                    width: calc(100% - 250px);

                    max-width: 1000px;

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

                    color: #858590;
                }


                h1 {
                    margin: 0;

                    font-size: 34px;

                    letter-spacing: -1.2px;
                }


                .subtitle {
                    margin: 8px 0 0;

                    color: #777780;

                    font-size: 14px;
                }


                .back-button {
                    text-decoration: none;

                    color: #33333a;

                    background: white;

                    border: 1px solid #e5e5ea;

                    padding: 11px 16px;

                    border-radius: 9px;

                    font-size: 12px;

                    font-weight: 600;
                }


                /* ================= PROFILE CARD ================= */

                .profile-card {
                    background: white;

                    border: 1px solid #e9e9ee;

                    border-radius: 16px;

                    overflow: hidden;
                }


                .profile-header {
                    padding: 30px;

                    display: flex;

                    align-items: center;

                    gap: 18px;

                    border-bottom: 1px solid #eeeeF2;
                }


                .large-avatar {
                    width: 65px;
                    height: 65px;

                    border-radius: 50%;

                    background: #111116;

                    color: white;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    font-size: 25px;

                    font-weight: 700;
                }


                .profile-header h2 {
                    margin: 0;

                    font-size: 22px;
                }


                .profile-header p {
                    margin: 5px 0 0;

                    color: #858590;

                    font-size: 13px;
                }


                /* ================= SECTION ================= */

                .section {
                    padding: 28px 30px;

                    border-bottom: 1px solid #eeeeF2;
                }


                .section:last-child {
                    border-bottom: none;
                }


                .section-label {
                    margin: 0 0 17px;

                    color: #858590;

                    font-size: 10px;

                    font-weight: 700;

                    letter-spacing: 1.4px;
                }


                .info-row {
                    display: flex;

                    justify-content: space-between;

                    align-items: center;

                    padding: 14px 0;

                    border-bottom: 1px solid #f1f1f4;
                }


                .info-row:last-child {
                    border-bottom: none;
                }


                .info-row span {
                    color: #858590;

                    font-size: 13px;
                }


                .info-row strong {
                    font-size: 13px;

                    text-align: right;
                }


                /* ================= TELEGRAM ================= */

                .telegram-status {
                    display: flex;

                    justify-content: space-between;

                    align-items: center;

                    gap: 20px;
                }


                .telegram-status h3 {
                    margin: 0;

                    font-size: 15px;
                }


                .telegram-status p {
                    margin: 5px 0 0;

                    color: #858590;

                    font-size: 12px;
                }


                .status {
                    padding: 7px 11px;

                    border-radius: 20px;

                    font-size: 11px;

                    font-weight: 600;

                    white-space: nowrap;
                }


                .connected {
                    background: #e8f8ef;

                    color: #34744e;
                }


                .disconnected {
                    background: #fff3e8;

                    color: #a8662d;
                }


                /* ================= REGISTRATION CODE ================= */

                .registration-box {
                    margin-top: 22px;

                    padding: 18px;

                    background: #f7f7fa;

                    border: 1px solid #e5e5ea;

                    border-radius: 11px;
                }


                .registration-header {
                    display: flex;

                    justify-content: space-between;

                    align-items: flex-start;

                    gap: 15px;
                }


                .registration-box > span,
                .registration-header span {
                    display: block;

                    color: #858590;

                    font-size: 10px;

                    text-transform: uppercase;

                    letter-spacing: 1px;

                    font-weight: 700;
                }


                .registration-header p {
                    margin: 5px 0 0;

                    color: #858590;

                    font-size: 11px;
                }


                .code-status {
                    background: #e8f8ef;

                    color: #34744e;

                    padding: 5px 9px;

                    border-radius: 15px;

                    font-size: 10px;

                    font-weight: 600;

                    white-space: nowrap;
                }


                .code-row {
                    margin-top: 14px;

                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    gap: 15px;
                }


                .code-row strong {
                    font-size: 24px;

                    letter-spacing: 4px;

                    font-family: monospace;
                }


                .code-row button {
                    border: none;

                    background: #111116;

                    color: white;

                    padding: 9px 14px;

                    border-radius: 7px;

                    cursor: pointer;

                    font-size: 11px;

                    font-weight: 600;
                }


                .code-row button:hover {
                    background: #292930;
                }


                .registration-box small {
                    display: block;

                    margin-top: 10px;

                    color: #858590;

                    font-size: 10px;

                    line-height: 1.5;
                }


                /* ================= NO CODE ================= */

                .no-code-box {
                    margin-top: 22px;

                    padding: 16px;

                    background: #fff8ed;

                    border: 1px solid #f1dfc4;

                    border-radius: 11px;
                }


                .no-code-box strong {
                    font-size: 12px;

                    color: #9a642d;
                }


                .no-code-box p {
                    margin: 5px 0 0;

                    font-size: 11px;

                    color: #9a642d;
                }


                /* ================= ERROR ================= */

                .error-message {
                    background: #fff0f0;

                    color: #c23c3c;

                    border: 1px solid #ffd8d8;

                    padding: 12px 15px;

                    border-radius: 9px;

                    margin-bottom: 20px;

                    font-size: 13px;
                }


                /* ================= LOADING ================= */

                .profile-loading {
                    min-height: 100vh;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    font-family:
                        Inter,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;

                    color: #777780;
                }


                /* ================= MOBILE ================= */

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
                        font-size: 0;

                        justify-content: center;
                    }


                    .nav-item span {
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


                    .profile-header {
                        padding: 22px;
                    }


                    .section {
                        padding: 22px;
                    }


                    .telegram-status {
                        align-items: flex-start;

                        flex-direction: column;
                    }


                    .registration-header {
                        flex-direction: column;
                    }


                    .code-row {
                        align-items: flex-start;

                        flex-direction: column;
                    }


                    .code-row button {
                        width: 100%;
                    }

                }

            `}</style>

        </div>
    );
}

export default Profile;