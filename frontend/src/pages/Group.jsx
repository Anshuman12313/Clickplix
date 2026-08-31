
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
            

        </div>
    );
}

export default Group;

