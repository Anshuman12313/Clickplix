
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
                   NAVBAR
                ===================== */

                .navbar {

                    height: 72px;

                    padding: 0 55px;

                    display: flex;

                    align-items: center;

                    justify-content:
                        space-between;

                    background:
                        rgba(
                            255,
                            255,
                            255,
                            0.9
                        );

                    border-bottom:
                        1px solid #e8e8ed;
                }

                .brand {

                    display: flex;

                    align-items: center;

                    gap: 10px;

                    color: #17171c;

                    text-decoration: none;

                    font-size: 18px;

                    font-weight: 750;
                }

                .brand-mark {

                    width: 33px;
                    height: 33px;

                    border-radius: 9px;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    background: #111116;

                    color: white;

                    font-size: 15px;

                    font-weight: 800;
                }

                .nav-links {

                    display: flex;

                    align-items: center;

                    gap: 20px;
                }

                .nav-links > a {

                    color: #777780;

                    font-size: 11px;

                    font-weight: 600;

                    text-decoration: none;
                }

                .nav-links > a:hover {
                    color: #17171c;
                }

                .nav-button {

                    padding:
                        9px 15px;

                    border-radius: 7px;

                    background: #111116;

                    color: white !important;
                }


                /* =====================
                   HERO
                ===================== */

                .hero {

                    width: 100%;

                    max-width: 1200px;

                    margin: auto;

                    padding:
                        85px 35px 105px;

                    display: grid;

                    grid-template-columns:
                        0.85fr 1.15fr;

                    gap: 65px;

                    align-items: center;
                }


                /* HERO CONTENT */

                .hero-content {
                    padding-left: 10px;
                }

                .badge {

                    display: inline-flex;

                    align-items: center;

                    gap: 7px;

                    padding:
                        6px 9px;

                    border:
                        1px solid #dedee5;

                    border-radius: 20px;

                    background: white;

                    color: #777780;

                    font-size: 9px;

                    font-weight: 650;
                }

                .badge-dot {

                    width: 6px;
                    height: 6px;

                    border-radius: 50%;

                    background: #55555d;
                }

                .hero h1 {

                    margin:
                        20px 0 0;

                    font-size: 58px;

                    line-height: 0.98;

                    letter-spacing: -3px;
                }

                .hero h1 span {
                    color: #898990;
                }

                .hero-description {

                    max-width: 420px;

                    margin:
                        23px 0 28px;

                    color: #777780;

                    font-size: 13px;

                    line-height: 1.75;
                }


                /* ACTIONS */

                .hero-actions {

                    display: flex;

                    flex-direction: column;

                    align-items: flex-start;

                    gap: 10px;
                }

                .primary-button {

                    min-width: 205px;

                    height: 43px;

                    padding:
                        0 16px;

                    border-radius: 8px;

                    display: flex;

                    align-items: center;

                    justify-content:
                        space-between;

                    background: #111116;

                    color: white;

                    font-size: 10px;

                    font-weight: 650;

                    text-decoration: none;

                    transition:
                        transform 0.15s,
                        background 0.15s;
                }

                .primary-button:hover {

                    background: #29292f;

                    transform:
                        translateY(-1px);
                }

                .primary-button span {
                    font-size: 15px;
                }

                .secondary-button {

                    padding:
                        5px 0;

                    color: #777780;

                    font-size: 9px;

                    text-decoration: none;
                }

                .secondary-button:hover {
                    color: #17171c;
                }


                /* TRUST */

                .trust {

                    display: flex;

                    align-items: center;

                    gap: 10px;

                    margin-top: 40px;
                }

                .avatars {

                    display: flex;

                    padding-left: 6px;
                }

                .avatars div {

                    width: 25px;
                    height: 25px;

                    margin-left: -6px;

                    border:
                        2px solid #f7f7fb;

                    border-radius: 50%;

                    background: #e8e8ed;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    color: #66666e;

                    font-size: 8px;

                    font-weight: 750;
                }

                .trust strong {

                    display: block;

                    font-size: 9px;
                }

                .trust p {

                    margin: 2px 0 0;

                    color: #aaaab1;

                    font-size: 8px;
                }


                /* =====================
                   PRODUCT PREVIEW
                ===================== */

                .product-preview {

                    position: relative;

                    padding:
                        20px 10px 35px;
                }

                .preview-window {

                    overflow: hidden;

                    border:
                        1px solid #dedee5;

                    border-radius: 14px;

                    background: white;

                    box-shadow:
                        0 25px 65px
                        rgba(
                            20,
                            20,
                            30,
                            0.09
                        );

                    transform:
                        rotate(1deg);
                }


                /* TOP BAR */

                .preview-topbar {

                    height: 39px;

                    padding:
                        0 13px;

                    display: flex;

                    align-items: center;

                    justify-content:
                        space-between;

                    border-bottom:
                        1px solid #eeeeF2;
                }

                .preview-brand {

                    display: flex;

                    align-items: center;

                    gap: 6px;

                    font-size: 8px;

                    font-weight: 750;
                }

                .mini-logo {

                    width: 18px;
                    height: 18px;

                    border-radius: 5px;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    background: #111116;

                    color: white;

                    font-size: 8px;

                    font-weight: 800;
                }

                .window-dots {

                    display: flex;

                    gap: 4px;
                }

                .window-dots span {

                    width: 5px;
                    height: 5px;

                    border-radius: 50%;

                    background: #d6d6dc;
                }


                /* PREVIEW BODY */

                .preview-body {

                    min-height: 370px;

                    display: flex;
                }

                .preview-sidebar {

                    width: 105px;

                    padding:
                        25px 9px;

                    border-right:
                        1px solid #eeeeF2;

                    color: #a0a0a8;

                    font-size: 7px;
                }

                .preview-sidebar div {

                    padding:
                        8px 9px;

                    margin-bottom: 3px;

                    border-radius: 5px;
                }

                .preview-sidebar .side-active {

                    background: #f1f1f4;

                    color: #33333a;

                    font-weight: 700;
                }

                .preview-main {

                    flex: 1;

                    padding: 25px 25px;
                }


                /* PREVIEW HEADING */

                .preview-heading {

                    display: flex;

                    align-items: center;

                    justify-content:
                        space-between;

                    margin-bottom: 19px;
                }

                .preview-heading p {

                    margin: 0 0 4px;

                    color: #aaaab1;

                    font-size: 6px;

                    font-weight: 750;

                    letter-spacing: 1px;
                }

                .preview-heading h3 {

                    margin: 0;

                    font-size: 14px;

                    letter-spacing: -0.3px;
                }

                .preview-user {

                    width: 25px;
                    height: 25px;

                    border-radius: 50%;

                    background: #eeeeF2;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    font-size: 8px;

                    font-weight: 750;
                }


                /* TELEGRAM */

                .telegram-card {

                    padding:
                        10px;

                    border:
                        1px solid #e5e5e9;

                    border-radius: 7px;

                    display: flex;

                    align-items: center;

                    gap: 9px;

                    background: #fafafc;
                }

                .telegram-icon {

                    width: 25px;
                    height: 25px;

                    border-radius: 7px;

                    background: #e9e9ed;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    font-size: 11px;

                    font-weight: 750;
                }

                .telegram-card strong {

                    display: block;

                    font-size: 8px;
                }

                .telegram-card p {

                    margin: 3px 0 0;

                    color: #aaaab1;

                    font-size: 6px;
                }

                .connected {

                    margin-left: auto;

                    padding:
                        4px 6px;

                    border-radius: 4px;

                    background: #eeeeF2;

                    color: #66666e;

                    font-size: 6px;

                    font-weight: 700;
                }


                /* GROUPS */

                .preview-section-title {

                    display: flex;

                    justify-content:
                        space-between;

                    margin:
                        22px 0 9px;

                    color: #55555d;

                    font-size: 7px;

                    font-weight: 700;
                }

                .preview-section-title span:last-child {

                    color: #9999a1;

                    font-weight: 600;
                }

                .group-preview-grid {

                    display: grid;

                    grid-template-columns:
                        1fr 1fr;

                    gap: 8px;
                }

                .group-card {

                    padding: 8px;

                    border:
                        1px solid #e8e8ed;

                    border-radius: 7px;

                    display: flex;

                    align-items: center;

                    gap: 7px;
                }

                .group-image {

                    width: 27px;
                    height: 27px;

                    border-radius: 6px;

                    background: #dedee5;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    color: #66666e;

                    font-size: 8px;

                    font-weight: 750;
                }

                .group-image.second {
                    background: #eeeeF2;
                }

                .group-info {
                    flex: 1;
                }

                .group-info strong {

                    display: block;

                    font-size: 7px;
                }

                .group-info p {

                    margin: 2px 0 0;

                    color: #aaaab1;

                    font-size: 6px;
                }

                .arrow {

                    color: #9999a1;

                    font-size: 10px;
                }


                /* CAMERA */

                .camera-preview {

                    margin-top: 10px;

                    padding: 11px;

                    border-radius: 7px;

                    background: #111116;

                    color: white;

                    display: flex;

                    align-items: center;

                    gap: 8px;
                }

                .camera-circle {

                    width: 25px;
                    height: 25px;

                    border-radius: 7px;

                    background: #29292f;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    font-size: 13px;
                }

                .camera-preview strong {

                    display: block;

                    font-size: 7px;
                }

                .camera-preview p {

                    margin: 3px 0 0;

                    color: #aaaab1;

                    font-size: 5.5px;
                }

                .camera-preview > span {

                    margin-left: auto;

                    font-size: 12px;
                }


                /* FLOATING */

                .floating-card {

                    position: absolute;

                    right: -12px;
                    bottom: 5px;

                    padding:
                        10px 13px;

                    display: flex;

                    align-items: center;

                    gap: 8px;

                    background: white;

                    border:
                        1px solid #dedee5;

                    border-radius: 9px;

                    box-shadow:
                        0 12px 30px
                        rgba(
                            20,
                            20,
                            30,
                            0.10
                        );
                }

                .floating-icon {

                    width: 25px;
                    height: 25px;

                    border-radius: 7px;

                    background: #eeeeF2;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    font-size: 10px;

                    font-weight: 800;
                }

                .floating-card strong {

                    display: block;

                    font-size: 8px;
                }

                .floating-card p {

                    margin: 3px 0 0;

                    color: #9999a1;

                    font-size: 6px;
                }


                /* =====================
                   HOW SECTION
                ===================== */

                .how-section {

                    padding:
                        85px 35px;

                    border-top:
                        1px solid #e8e8ed;

                    background: white;
                }

                .how-header {

                    max-width: 1100px;

                    margin: auto;
                }

                .how-header p {

                    margin: 0 0 11px;

                    color: #aaaab1;

                    font-size: 9px;

                    font-weight: 750;

                    letter-spacing: 1.5px;
                }

                .how-header h2 {

                    margin: 0;

                    font-size: 36px;

                    line-height: 1.1;

                    letter-spacing: -1.3px;
                }

                .how-grid {

                    max-width: 1100px;

                    margin: 50px auto 0;

                    display: grid;

                    grid-template-columns:
                        repeat(4, 1fr);

                    gap: 1px;

                    border:
                        1px solid #e8e8ed;
                }

                .how-card {

                    min-height: 205px;

                    padding: 24px;

                    border-right:
                        1px solid #e8e8ed;

                    background: white;
                }

                .how-card:last-child {
                    border-right: none;
                }

                .how-card > span {

                    color: #aaaab1;

                    font-size: 9px;

                    font-weight: 750;
                }

                .how-card h3 {

                    margin:
                        35px 0 10px;

                    font-size: 13px;

                    letter-spacing: -0.2px;
                }

                .how-card p {

                    margin: 0;

                    color: #9999a1;

                    font-size: 9px;

                    line-height: 1.65;
                }


                /* =====================
                   FOOTER
                ===================== */

                footer {

                    min-height: 70px;

                    padding:
                        0 55px;

                    display: flex;

                    align-items: center;

                    justify-content:
                        space-between;

                    color: #aaaab1;

                    font-size: 8px;
                }

                .footer-brand {

                    display: flex;

                    align-items: center;

                    gap: 8px;

                    color: #55555d;

                    font-weight: 700;
                }

                .footer-brand .brand-mark {

                    width: 25px;
                    height: 25px;

                    border-radius: 7px;

                    font-size: 11px;
                }

                footer p {
                    margin: 0;
                }


                /* =====================
                   TABLET
                ===================== */

                @media (max-width: 900px) {

                    .hero {

                        grid-template-columns: 1fr;

                        max-width: 650px;

                        gap: 55px;

                        padding-top: 60px;
                    }

                    .hero-content {

                        text-align: center;

                        padding: 0;
                    }

                    .hero-description {

                        margin-left: auto;
                        margin-right: auto;
                    }

                    .hero-actions {

                        align-items: center;
                    }

                    .trust {

                        justify-content: center;
                    }

                    .how-grid {

                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                    .how-card:nth-child(2) {
                        border-right: none;
                    }

                    .how-card:nth-child(1),
                    .how-card:nth-child(2) {
                        border-bottom:
                            1px solid #e8e8ed;
                    }

                }


                /* =====================
                   MOBILE
                ===================== */

                @media (max-width: 550px) {

                    .navbar {

                        padding:
                            0 18px;
                    }

                    .nav-links {

                        gap: 10px;
                    }

                    .nav-links > a:first-child {
                        display: none;
                    }

                    .hero {

                        padding:
                            45px 18px 70px;
                    }

                    .hero h1 {

                        font-size: 43px;

                        letter-spacing: -2px;
                    }

                    .hero-description {

                        font-size: 12px;
                    }

                    .product-preview {

                        padding:
                            10px 0 35px;
                    }

                    .preview-sidebar {
                        display: none;
                    }

                    .preview-main {
                        padding:
                            20px 15px;
                    }

                    .group-preview-grid {
                        grid-template-columns: 1fr;
                    }

                    .how-section {

                        padding:
                            60px 18px;
                    }

                    .how-header h2 {

                        font-size: 30px;
                    }

                    .how-grid {

                        grid-template-columns: 1fr;
                    }

                    .how-card {

                        border-right: none;

                        border-bottom:
                            1px solid #e8e8ed;
                    }

                    .how-card:last-child {
                        border-bottom: none;
                    }

                    footer {

                        padding:
                            18px;

                        flex-direction: column;

                        gap: 10px;
                    }

                }

            `}</style>

        </div>
    );
}

export default Home;

