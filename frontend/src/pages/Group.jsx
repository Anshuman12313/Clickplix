
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Group() {
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [registrationCode, setRegistrationCode] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [addingMember, setAddingMember] = useState(false);

    useEffect(() => {
        fetchGroup();
    }, [groupId]);

    const fetchGroup = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                `/groups/${groupId}`
            );

            console.log("Group:", response.data);

            setGroup(response.data);

        } catch (error) {
            console.error(
                "Failed to load group:",
                error
            );

            setMessage(
                error.response?.data?.detail ||
                "Failed to load group"
            );

        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async () => {
        if (!registrationCode.trim()) {
            setMessage("Enter a registration code");
            return;
        }

        try {
            setAddingMember(true);
            setMessage("");

            const formData = new FormData();

            formData.append(
                "registration_code",
                registrationCode.trim()
            );

            const response = await api.post(
                `/groups/${groupId}/members`,
                formData
            );

            console.log(
                "Member added:",
                response.data
            );

            setMessage(
                "Member added successfully!"
            );

            setRegistrationCode("");

            await fetchGroup();

        } catch (error) {
            console.error(
                "Failed to add member:",
                error
            );

            setMessage(
                error.response?.data?.detail ||
                "Failed to add member"
            );

        } finally {
            setAddingMember(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-page">
                <div className="loader"></div>
                <p>Loading group...</p>

                <style>{`

                    .loading-page {
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;

                        font-family:
                            Inter,
                            -apple-system,
                            BlinkMacSystemFont,
                            "Segoe UI",
                            sans-serif;

                        background: #f7f7fb;
                        color: #777780;
                    }

                    .loader {
                        width: 32px;
                        height: 32px;

                        border: 3px solid #e4e4e9;
                        border-top-color: #111116;

                        border-radius: 50%;

                        animation:
                            spin 0.8s linear infinite;

                        margin-bottom: 15px;
                    }

                    @keyframes spin {
                        to {
                            transform: rotate(360deg);
                        }
                    }

                `}</style>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="error-page">

                <div className="error-icon">
                    !
                </div>

                <h2>
                    Couldn't load this group
                </h2>

                <p>
                    {message || "Something went wrong."}
                </p>

                <button
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>

                <style>{`

                    .error-page {
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;

                        font-family:
                            Inter,
                            -apple-system,
                            BlinkMacSystemFont,
                            "Segoe UI",
                            sans-serif;

                        background: #f7f7fb;
                        text-align: center;
                    }

                    .error-icon {
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;

                        background: #fff0f0;
                        color: #c23d3d;

                        display: flex;
                        align-items: center;
                        justify-content: center;

                        font-weight: 700;
                        font-size: 20px;
                    }

                    .error-page h2 {
                        margin: 15px 0 5px;
                    }

                    .error-page p {
                        color: #858590;
                        font-size: 13px;
                    }

                    .error-page button {
                        margin-top: 15px;

                        padding: 11px 16px;
                        border: none;
                        border-radius: 8px;

                        background: #111116;
                        color: white;

                        cursor: pointer;
                    }

                `}</style>
            </div>
        );
    }

    return (
        <div className="group-page">

            {/* TOP NAV */}
            <header className="top-nav">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

                <div className="brand">

                    <div className="brand-icon">
                        C
                    </div>

                    <span>
                        ClickPlix
                    </span>

                </div>

                <div className="nav-space"></div>

            </header>


            {/* MAIN */}
            <main className="group-container">

                {/* GROUP HEADER */}
                <section className="group-header">

                    <div className="group-title">

                        <div className="large-group-icon">
                            {group.group_name
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <div>

                            <p className="eyebrow">
                                GROUP
                            </p>

                            <h1>
                                {group.group_name}
                            </h1>

                            <p className="member-count">
                                👥 {group.members.length}{" "}
                                {group.members.length === 1
                                    ? "member"
                                    : "members"}
                            </p>

                        </div>

                    </div>


                    <Link
                        to={`/camera/${groupId}`}
                        className="photo-button"
                    >
                        📷 Click Photo
                    </Link>

                </section>


                {/* MESSAGE */}
                {message && (

                    <div
                        className={
                            message.includes(
                                "successfully"
                            )
                                ? "message success"
                                : "message error"
                        }
                    >

                        <span>
                            {message.includes(
                                "successfully"
                            )
                                ? "✓"
                                : "!"}
                        </span>

                        {message}

                    </div>

                )}


                {/* CONTENT GRID */}
                <div className="content-grid">


                    {/* MEMBERS */}
                    <section className="members-section">

                        <div className="section-heading">

                            <div>

                                <p className="eyebrow">
                                    PEOPLE
                                </p>

                                <h2>
                                    Group Members
                                </h2>

                            </div>

                            <span className="count-badge">
                                {group.members.length}
                            </span>

                        </div>


                        {group.members.length === 0 ? (

                            <div className="empty-members">

                                <div className="empty-icon">
                                    👥
                                </div>

                                <h3>
                                    No members yet
                                </h3>

                                <p>
                                    Add your friends using
                                    their ClickPlix
                                    registration code.
                                </p>

                            </div>

                        ) : (

                            <div className="members-list">

                                {group.members.map(
                                    (member) => (

                                        <div
                                            className="member-card"
                                            key={member.user_id}
                                        >

                                            <div className="member-avatar">

                                                {member.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}

                                            </div>

                                            <div className="member-info">

                                                <strong>
                                                    {member.name}
                                                </strong>

                                                <span>
                                                    ClickPlix member
                                                </span>

                                            </div>

                                            <div className="member-status">
                                                ✓
                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>


                    {/* ADD MEMBER */}
                    <aside className="add-member-card">

                        <div className="add-icon">
                            +
                        </div>

                        <p className="eyebrow">
                            INVITE
                        </p>

                        <h2>
                            Add a member
                        </h2>

                        <p className="add-description">
                            Ask your friend for their
                            ClickPlix registration code
                            and enter it below.
                        </p>


                        <label>
                            Registration code
                        </label>

                        <input
                            type="text"
                            placeholder="e.g. VKH5MI"
                            value={registrationCode}
                            onChange={(e) => {
                                setRegistrationCode(
                                    e.target.value
                                );
                                setMessage("");
                            }}
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter"
                                ) {
                                    handleAddMember();
                                }
                            }}
                        />


                        <button
                            className="add-button"
                            onClick={handleAddMember}
                            disabled={
                                addingMember ||
                                !registrationCode.trim()
                            }
                        >
                            {addingMember
                                ? "Adding..."
                                : "Add Member →"}
                        </button>


                        <div className="info-box">

                            <span>
                                💡
                            </span>

                            <p>
                                Once added, ClickPlix
                                can automatically identify
                                this person in group photos.
                            </p>

                        </div>

                    </aside>

                </div>


                {/* BOTTOM CTA */}
                <section className="photo-cta">

                    <div>

                        <p className="eyebrow">
                            READY?
                        </p>

                        <h2>
                            Capture a group moment.
                        </h2>

                        <p>
                            Take a photo and let ClickPlix
                            handle the sharing.
                        </p>

                    </div>

                    <Link
                        to={`/camera/${groupId}`}
                        className="cta-button"
                    >
                        Open Camera →
                    </Link>

                </section>

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

                .group-page {
                    min-height: 100vh;
                    background: #f7f7fb;
                }

                /* NAV */

                .top-nav {
                    height: 72px;

                    padding: 0 45px;

                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    background: rgba(
                        255,
                        255,
                        255,
                        0.85
                    );

                    border-bottom:
                        1px solid #e8e8ed;

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

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background: #111116;
                    color: white;

                    font-weight: 800;
                }

                .back-button {
                    border: none;
                    background: transparent;

                    color: #66666f;

                    cursor: pointer;

                    font-size: 13px;
                }

                .back-button:hover {
                    color: #111116;
                }

                .nav-space {
                    width: 100px;
                }

                /* CONTAINER */

                .group-container {
                    max-width: 1150px;
                    margin: auto;

                    padding:
                        45px 25px 60px;
                }

                /* HEADER */

                .group-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    margin-bottom: 30px;
                }

                .group-title {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                }

                .large-group-icon {
                    width: 68px;
                    height: 68px;

                    border-radius: 18px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background: #111116;
                    color: white;

                    font-size: 25px;
                    font-weight: 700;
                }

                .eyebrow {
                    margin: 0 0 6px;

                    font-size: 10px;
                    font-weight: 700;

                    letter-spacing: 1.5px;

                    color: #898992;
                }

                .group-header h1 {
                    margin: 0;

                    font-size: 32px;
                    letter-spacing: -1px;
                }

                .member-count {
                    margin: 6px 0 0;

                    color: #888891;

                    font-size: 12px;
                }

                .photo-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    padding: 13px 20px;

                    border-radius: 9px;

                    background: #111116;
                    color: white;

                    text-decoration: none;

                    font-size: 13px;
                    font-weight: 600;

                    transition: 0.2s;
                }

                .photo-button:hover {
                    background: #292930;
                    transform: translateY(-1px);
                }

                /* MESSAGE */

                .message {
                    margin-bottom: 20px;

                    padding: 12px 15px;

                    border-radius: 9px;

                    display: flex;
                    align-items: center;
                    gap: 9px;

                    font-size: 12px;
                }

                .message span {
                    width: 19px;
                    height: 19px;

                    border-radius: 50%;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    font-weight: 700;
                }

                .success {
                    background: #ecf8f0;
                    color: #287347;
                    border: 1px solid #d4eedf;
                }

                .success span {
                    background: #287347;
                    color: white;
                }

                .error {
                    background: #fff0f0;
                    color: #b63d3d;
                    border: 1px solid #ffdada;
                }

                .error span {
                    background: #b63d3d;
                    color: white;
                }

                /* GRID */

                .content-grid {
                    display: grid;

                    grid-template-columns:
                        1.6fr 1fr;

                    gap: 20px;

                    align-items: start;
                }

                /* MEMBERS */

                .members-section {
                    background: white;

                    border: 1px solid #e6e6eb;

                    border-radius: 16px;

                    padding: 25px;
                }

                .section-heading {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    margin-bottom: 20px;
                }

                .section-heading h2 {
                    margin: 0;

                    font-size: 19px;

                    letter-spacing: -0.4px;
                }

                .count-badge {
                    min-width: 28px;
                    height: 28px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 8px;

                    background: #f1f1f4;

                    font-size: 12px;
                    font-weight: 700;
                }

                .members-list {
                    display: flex;
                    flex-direction: column;
                    gap: 9px;
                }

                .member-card {
                    display: flex;
                    align-items: center;

                    padding: 12px;

                    border: 1px solid #eeeeF1;

                    border-radius: 11px;

                    transition: 0.2s;
                }

                .member-card:hover {
                    background: #fafafd;
                }

                .member-avatar {
                    width: 42px;
                    height: 42px;

                    border-radius: 11px;

                    background: #ededf2;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    font-weight: 700;
                    font-size: 14px;

                    margin-right: 12px;
                }

                .member-info {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                }

                .member-info strong {
                    font-size: 13px;
                }

                .member-info span {
                    font-size: 10px;
                    color: #96969f;
                }

                .member-status {
                    margin-left: auto;

                    width: 24px;
                    height: 24px;

                    border-radius: 50%;

                    background: #ecf8f0;

                    color: #32905a;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    font-size: 11px;
                }

                /* EMPTY */

                .empty-members {
                    padding: 45px 20px;
                    text-align: center;

                    border: 1px dashed #dcdce3;
                    border-radius: 12px;
                }

                .empty-icon {
                    font-size: 30px;
                }

                .empty-members h3 {
                    margin: 10px 0 5px;
                    font-size: 15px;
                }

                .empty-members p {
                    margin: 0 auto;

                    max-width: 330px;

                    color: #898991;
                    font-size: 12px;
                    line-height: 1.6;
                }

                /* ADD MEMBER */

                .add-member-card {
                    background: #111116;
                    color: white;

                    border-radius: 16px;

                    padding: 25px;

                    position: sticky;
                    top: 25px;
                }

                .add-icon {
                    width: 43px;
                    height: 43px;

                    border-radius: 11px;

                    background: #28282f;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    font-size: 23px;

                    margin-bottom: 20px;
                }

                .add-member-card .eyebrow {
                    color: #777780;
                }

                .add-member-card h2 {
                    margin: 0;

                    font-size: 20px;
                }

                .add-description {
                    color: #909098;

                    font-size: 12px;
                    line-height: 1.6;

                    margin: 8px 0 22px;
                }

                .add-member-card label {
                    display: block;

                    font-size: 11px;
                    color: #a0a0a8;

                    margin-bottom: 7px;
                }

                .add-member-card input {
                    width: 100%;
                    height: 45px;

                    border-radius: 8px;

                    border: 1px solid #33333b;

                    background: #1b1b21;

                    color: white;

                    outline: none;

                    padding: 0 13px;

                    font-size: 13px;

                    letter-spacing: 1px;
                }

                .add-member-card input::placeholder {
                    color: #65656e;
                }

                .add-member-card input:focus {
                    border-color: #666670;
                }

                .add-button {
                    width: 100%;
                    height: 44px;

                    margin-top: 10px;

                    border: none;
                    border-radius: 8px;

                    background: white;
                    color: #111116;

                    font-size: 12px;
                    font-weight: 700;

                    cursor: pointer;
                }

                .add-button:hover:not(:disabled) {
                    background: #eeeeF2;
                }

                .add-button:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .info-box {
                    display: flex;
                    gap: 9px;

                    margin-top: 20px;

                    padding-top: 18px;

                    border-top: 1px solid #292930;
                }

                .info-box span {
                    font-size: 13px;
                }

                .info-box p {
                    margin: 0;

                    color: #73737d;

                    font-size: 10px;
                    line-height: 1.5;
                }

                /* CTA */

                .photo-cta {
                    margin-top: 20px;

                    padding: 25px;

                    border-radius: 16px;

                    background: #eaeaf0;

                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .photo-cta h2 {
                    margin: 0;

                    font-size: 19px;
                    letter-spacing: -0.4px;
                }

                .photo-cta p:not(.eyebrow) {
                    margin: 6px 0 0;

                    color: #777780;
                    font-size: 12px;
                }

                .cta-button {
                    text-decoration: none;

                    background: #111116;
                    color: white;

                    padding: 12px 18px;

                    border-radius: 8px;

                    font-size: 12px;
                    font-weight: 600;
                }

                /* RESPONSIVE */

                @media (max-width: 800px) {

                    .group-container {
                        padding: 30px 18px;
                    }

                    .group-header {
                        align-items: flex-start;
                        flex-direction: column;
                        gap: 20px;
                    }

                    .photo-button {
                        width: 100%;
                    }

                    .content-grid {
                        grid-template-columns: 1fr;
                    }

                    .add-member-card {
                        position: static;
                    }

                    .photo-cta {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 18px;
                    }

                    .cta-button {
                        width: 100%;
                        text-align: center;
                    }

                }

                @media (max-width: 500px) {

                    .top-nav {
                        padding: 0 18px;
                    }

                    .nav-space {
                        display: none;
                    }

                    .group-title {
                        gap: 12px;
                    }

                    .large-group-icon {
                        width: 55px;
                        height: 55px;
                        border-radius: 14px;
                    }

                    .group-header h1 {
                        font-size: 25px;
                    }

                    .members-section,
                    .add-member-card {
                        padding: 20px;
                    }

                }

            `}</style>

        </div>
    );
}

export default Group;

