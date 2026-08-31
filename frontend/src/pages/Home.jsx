
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home-page">

            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="navbar">

                <Link
                    to="/"
                    className="brand"
                >
                    <div className="brand-mark">
                        C
                    </div>

                    <span>
                        ClickPlix
                    </span>
                </Link>

                <div className="nav-links">

                    <Link to="/login">
                        Log in
                    </Link>

                    <Link
                        to="/register"
                        className="nav-button"
                    >
                        Get started
                    </Link>

                </div>

            </nav>


            {/* =========================
                HERO
            ========================= */}

            <main className="hero">

                <section className="hero-content">

                    <div className="badge">
                        <span className="badge-dot"></span>
                        Smart photo sharing
                    </div>


                    <h1>
                        Your photos.
                        <br />

                        <span>
                            Your people.
                        </span>
                    </h1>


                    <p className="hero-description">
                        ClickPlix uses face recognition to
                        automatically find your friends in
                        group photos and send their photos
                        straight to them.
                    </p>


                    <div className="hero-actions">

                        <Link
                            to="/register"
                            className="primary-button"
                        >
                            Create your account
                            <span>→</span>
                        </Link>

                        <Link
                            to="/login"
                            className="secondary-button"
                        >
                            I already have an account
                        </Link>

                    </div>


                    <div className="trust">

                        <div className="avatars">

                            <div>A</div>
                            <div>R</div>
                            <div>S</div>
                            <div>+</div>

                        </div>

                        <div>

                            <strong>
                                Built for your groups
                            </strong>

                            <p>
                                Capture once. Share automatically.
                            </p>

                        </div>

                    </div>

                </section>


                {/* =========================
                    PRODUCT PREVIEW
                ========================= */}

                <section className="product-preview">

                    <div className="preview-window">

                        {/* TOP BAR */}

                        <div className="preview-topbar">

                            <div className="preview-brand">

                                <div className="mini-logo">
                                    C
                                </div>

                                <span>
                                    ClickPlix
                                </span>

                            </div>

                            <div className="window-dots">

                                <span></span>
                                <span></span>
                                <span></span>

                            </div>

                        </div>


                        {/* DASHBOARD */}

                        <div className="preview-body">

                            <div className="preview-sidebar">

                                <div className="side-active">
                                    Dashboard
                                </div>

                                <div>
                                    Groups
                                </div>

                                <div>
                                    Camera
                                </div>

                            </div>


                            <div className="preview-main">

                                <div className="preview-heading">

                                    <div>

                                        <p>
                                            DASHBOARD
                                        </p>

                                        <h3>
                                            Good evening, Anshuman
                                        </h3>

                                    </div>

                                    <div className="preview-user">
                                        A
                                    </div>

                                </div>


                                {/* TELEGRAM CARD */}

                                <div className="telegram-card">

                                    <div className="telegram-icon">
                                        →
                                    </div>

                                    <div>

                                        <strong>
                                            Telegram connected
                                        </strong>

                                        <p>
                                            Photos will be delivered
                                            automatically.
                                        </p>

                                    </div>

                                    <span className="connected">
                                        Connected
                                    </span>

                                </div>


                                {/* GROUPS */}

                                <div className="preview-section-title">

                                    <span>
                                        Your groups
                                    </span>

                                    <span>
                                        + New group
                                    </span>

                                </div>


                                <div className="group-preview-grid">

                                    <div className="group-card">

                                        <div className="group-image">
                                            <span>F</span>
                                        </div>

                                        <div className="group-info">

                                            <strong>
                                                Friends
                                            </strong>

                                            <p>
                                                6 members
                                            </p>

                                        </div>

                                        <span className="arrow">
                                            →
                                        </span>

                                    </div>


                                    <div className="group-card">

                                        <div className="group-image second">
                                            <span>W</span>
                                        </div>

                                        <div className="group-info">

                                            <strong>
                                                Weekend Trip
                                            </strong>

                                            <p>
                                                4 members
                                            </p>

                                        </div>

                                        <span className="arrow">
                                            →
                                        </span>

                                    </div>

                                </div>


                                {/* CAMERA ACTION */}

                                <div className="camera-preview">

                                    <div className="camera-circle">
                                        +
                                    </div>

                                    <div>

                                        <strong>
                                            Capture a group moment
                                        </strong>

                                        <p>
                                            Click a photo and let
                                            ClickPlix find your people.
                                        </p>

                                    </div>

                                    <span>
                                        →
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="floating-card">

                        <div className="floating-icon">
                            ✓
                        </div>

                        <div>

                            <strong>
                                3 people found
                            </strong>

                            <p>
                                Photos sent to Telegram
                            </p>

                        </div>

                    </div>

                </section>

            </main>


            {/* =========================
                HOW IT WORKS
            ========================= */}

            <section className="how-section">

                <div className="how-header">

                    <p>
                        HOW IT WORKS
                    </p>

                    <h2>
                        From camera to
                        <br />
                        the right people.
                    </h2>

                </div>


                <div className="how-grid">

                    <div className="how-card">

                        <span>
                            01
                        </span>

                        <h3>
                            Create a group
                        </h3>

                        <p>
                            Create a private group and
                            invite your friends using their
                            ClickPlix registration codes.
                        </p>

                    </div>


                    <div className="how-card">

                        <span>
                            02
                        </span>

                        <h3>
                            Take a photo
                        </h3>

                        <p>
                            Capture a group moment directly
                            from the ClickPlix camera.
                        </p>

                    </div>


                    <div className="how-card">

                        <span>
                            03
                        </span>

                        <h3>
                            We find your people
                        </h3>

                        <p>
                            ClickPlix recognizes the registered
                            faces in the photo automatically.
                        </p>

                    </div>


                    <div className="how-card">

                        <span>
                            04
                        </span>

                        <h3>
                            Photo delivered
                        </h3>

                        <p>
                            Matching photos are automatically
                            sent to each person's Telegram.
                        </p>

                    </div>

                </div>

            </section>


            {/* =========================
                FOOTER
            ========================= */}

            <footer>

                <div className="footer-brand">

                    <div className="brand-mark">
                        C
                    </div>

                    <span>
                        ClickPlix
                    </span>

                </div>

                <p>
                    Capture. Recognize. Share.
                </p>

                <span>
                    © 2026 ClickPlix
                </span>

            </footer>


            {/* =========================
                STYLES
            ========================= */}

            

        </div>
    );
}

export default Home;

