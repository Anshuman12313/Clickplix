
import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function Camera() {
    const { groupId } = useParams();

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [stream, setStream] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [message, setMessage] = useState("");
    const [matches, setMatches] = useState([]);
    const [processing, setProcessing] = useState(false);

    // environment = rear camera
    // user = front camera
    const [facingMode, setFacingMode] = useState("environment");

    // =========================================================
    // START CAMERA
    // =========================================================

    const startCamera = async (mode = facingMode) => {
        try {
            setMessage("");

            // Stop previous stream first
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }

            /*
             * Prefer the requested camera.
             *
             * "environment" = rear camera
             * "user"        = front camera
             *
             * ideal allows the browser to fall back if the
             * requested camera is not available.
             */
            const mediaStream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: {
                            ideal: mode
                        }
                    },
                    audio: false
                });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;

                // Make sure the video actually starts
                await videoRef.current.play().catch(() => {});
            }

            setStream(mediaStream);

        } catch (error) {
            console.error("Camera error:", error);

            /*
             * Some browsers/devices may not support facingMode
             * properly. Try the default camera as a fallback.
             */
            try {
                const fallbackStream =
                    await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false
                    });

                if (videoRef.current) {
                    videoRef.current.srcObject =
                        fallbackStream;

                    await videoRef.current
                        .play()
                        .catch(() => {});
                }

                setStream(fallbackStream);
                setMessage("");

            } catch (fallbackError) {
                console.error(
                    "Fallback camera error:",
                    fallbackError
                );

                setMessage(
                    "Could not access camera. Please allow camera permission."
                );
            }
        }
    };

    // =========================================================
    // STOP CAMERA
    // =========================================================

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(
                (track) => track.stop()
            );

            setStream(null);
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    // =========================================================
    // SWITCH CAMERA
    // =========================================================

    const switchCamera = async () => {
        const newMode =
            facingMode === "environment"
                ? "user"
                : "environment";

        setFacingMode(newMode);

        await startCamera(newMode);
    };

    // =========================================================
    // TAKE PHOTO
    // =========================================================

    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video) {
            setMessage(
                "Camera is not available"
            );
            return;
        }

        if (
            video.videoWidth === 0 ||
            video.videoHeight === 0
        ) {
            setMessage(
                "Camera is not ready yet"
            );
            return;
        }

        /*
         * IMPORTANT:
         *
         * We intentionally DO NOT mirror the canvas.
         *
         * CSS mirroring only affects the preview.
         * The actual camera frame is copied normally.
         *
         * This prevents the saved photo from being
         * horizontally reversed.
         */

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context =
            canvas.getContext("2d");

        context.save();

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        context.restore();

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    setMessage(
                        "Failed to capture photo"
                    );
                    return;
                }

                setPhoto(blob);
                setMatches([]);
                setMessage("");

                // Stop camera after taking photo
                if (stream) {
                    stream
                        .getTracks()
                        .forEach(
                            (track) => track.stop()
                        );

                    setStream(null);
                }

                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
            },
            "image/jpeg",
            0.92
        );
    };

    // =========================================================
    // SEND PHOTO
    // =========================================================

    const sendPhoto = async () => {
        if (!photo) {
            setMessage(
                "Take a photo first"
            );
            return;
        }

        try {
            setProcessing(true);
            setMessage("");
            setMatches([]);

            const formData =
                new FormData();

            formData.append(
                "file",
                photo,
                "click.jpg"
            );

            console.log(
                "Sending photo for group:",
                groupId
            );

            const response =
                await api.post(
                    `/groups/${groupId}/click`,
                    formData
                );

            console.log(
                "Recognition result:",
                response.data
            );

            const allResults =
                response.data.matches || [];

            const foundPeople =
                allResults.filter(
                    (person) =>
                        person.found === true
                );

            setMatches(foundPeople);

            if (foundPeople.length === 0) {
                setMessage(
                    "No group members found in this photo."
                );
            } else {
                setMessage(
                    `Found ${foundPeople.length} group member(s)!`
                );
            }

        } catch (error) {
            console.error(
                "Photo processing failed:",
                error
            );

            setMessage(
                error.response?.data?.detail ||
                "Failed to process photo"
            );

        } finally {
            setProcessing(false);
        }
    };

    // =========================================================
    // RETAKE
    // =========================================================

    const retakePhoto = () => {
        setPhoto(null);
        setMatches([]);
        setMessage("");
    };

    // =========================================================
    // CLEANUP CAMERA WHEN COMPONENT UNMOUNTS
    // =========================================================

    useEffect(() => {
        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach(
                        (track) => track.stop()
                    );
            }
        };
    }, []);

    const isSuccess =
        matches.length > 0 &&
        !processing;

    const isNoMatch =
        message ===
        "No group members found in this photo.";

    return (
        <div className="camera-page">

            {/* =================================================
                NAVBAR
            ================================================= */}

            <header className="camera-nav">

                <Link
                    to={`/groups/${groupId}`}
                    className="back-link"
                >
                    ← Back to Group
                </Link>

                <div className="brand">

                    <div className="brand-icon">
                        C
                    </div>

                    <span>
                        ClickPlix
                    </span>

                </div>

                <div className="nav-label">
                    PHOTO RECOGNITION
                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="camera-container">

                {/* HEADER */}

                <div className="page-heading">

                    <div>

                        <p className="eyebrow">
                            CAMERA
                        </p>

                        <h1>
                            Capture a moment.
                        </h1>

                        <p>
                            Click a photo and ClickPlix will
                            identify group members and send
                            it to them automatically.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    CAMERA CARD
                ================================================= */}

                <section className="camera-card">

                    {!photo ? (

                        <>

                            {/* VIDEO */}

                            <div className="video-wrapper">

                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className={
                                        facingMode === "user"
                                            ? "front-camera"
                                            : "rear-camera"
                                    }
                                />

                                {!stream && (

                                    <div className="camera-placeholder">

                                        <div className="camera-placeholder-icon">
                                            📷
                                        </div>

                                        <h3>
                                            Camera is off
                                        </h3>

                                        <p>
                                            Start the camera to
                                            capture your photo.
                                        </p>

                                    </div>

                                )}

                                {stream && (

                                    <div className="camera-overlay">

                                        <div className="corner top-left"></div>

                                        <div className="corner top-right"></div>

                                        <div className="corner bottom-left"></div>

                                        <div className="corner bottom-right"></div>

                                        <div className="live-indicator">

                                            <span></span>

                                            LIVE

                                        </div>

                                        <div className="camera-mode">

                                            {facingMode === "environment"
                                                ? "REAR CAMERA"
                                                : "FRONT CAMERA"}

                                        </div>

                                    </div>

                                )}

                            </div>


                            {/* CAMERA CONTROLS */}

                            <div className="camera-controls">

                                <button
                                    className="control-button secondary"
                                    onClick={startCamera}
                                    disabled={!!stream}
                                >
                                    ▶ Start Camera
                                </button>


                                <button
                                    className="capture-button"
                                    onClick={takePhoto}
                                    disabled={!stream}
                                    aria-label="Take photo"
                                >

                                    <span className="capture-ring">

                                        <span></span>

                                    </span>

                                </button>


                                <button
                                    className="control-button secondary"
                                    onClick={switchCamera}
                                    disabled={!stream}
                                >
                                    🔄 Switch Camera
                                </button>


                                <button
                                    className="control-button secondary"
                                    onClick={stopCamera}
                                    disabled={!stream}
                                >
                                    ■ Stop
                                </button>

                            </div>

                        </>

                    ) : (

                        <>

                            {/* PHOTO PREVIEW */}

                            <div className="photo-wrapper">

                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt="Captured"
                                />

                                <div className="preview-badge">
                                    ✓ Photo captured
                                </div>

                            </div>


                            {/* PHOTO ACTIONS */}

                            <div className="preview-actions">

                                <button
                                    className="retake-button"
                                    onClick={retakePhoto}
                                    disabled={processing}
                                >
                                    ↻ Retake
                                </button>

                                <button
                                    className="find-button"
                                    onClick={sendPhoto}
                                    disabled={processing}
                                >

                                    {processing ? (

                                        <>
                                            <span className="small-loader"></span>
                                            Finding people...
                                        </>

                                    ) : (

                                        <>
                                            ✦ Find People
                                        </>

                                    )}

                                </button>

                            </div>

                        </>

                    )}


                    <canvas
                        ref={canvasRef}
                        style={{
                            display: "none"
                        }}
                    />

                </section>


                {/* =================================================
                    PROCESSING
                ================================================= */}

                {processing && (

                    <section className="processing-card">

                        <div className="processing-animation">

                            <div></div>
                            <div></div>
                            <div></div>

                        </div>

                        <div>

                            <strong>
                                Looking for your friends...
                            </strong>

                            <p>
                                ClickPlix is comparing faces
                                with your group members.
                            </p>

                        </div>

                    </section>

                )}


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {isSuccess && (

                    <section className="results-section">

                        <div className="results-header">

                            <div>

                                <p className="eyebrow">
                                    RECOGNITION COMPLETE
                                </p>

                                <h2>
                                    People found 🎉
                                </h2>

                            </div>

                            <div className="found-count">
                                {matches.length}
                            </div>

                        </div>


                        <div className="matches-grid">

                            {matches.map(
                                (person, index) => (

                                    <div
                                        className="match-card"
                                        key={index}
                                    >

                                        <div className="match-avatar">

                                            {person.name
                                                ?.charAt(0)
                                                ?.toUpperCase() ||
                                                "U"}

                                        </div>

                                        <div className="match-info">

                                            <strong>
                                                {person.name ||
                                                    `User ${person.user_id}`}
                                            </strong>

                                            <span>
                                                Face matched
                                            </span>

                                        </div>

                                        <div className="match-details">

                                            <div className="similarity">

                                                {(
                                                    person.similarity *
                                                    100
                                                ).toFixed(1)}
                                                %

                                            </div>

                                            <div className="sent">
                                                ✓ Sent
                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>


                        <div className="success-banner">

                            <span>
                                ✓
                            </span>

                            <div>

                                <strong>
                                    Photos delivered
                                </strong>

                                <p>
                                    The photo has been sent
                                    to the matched members
                                    through Telegram.
                                </p>

                            </div>

                        </div>

                    </section>

                )}


                {/* =================================================
                    NO MATCH
                ================================================= */}

                {isNoMatch &&
                    !processing && (

                    <section className="no-match-card">

                        <div className="no-match-icon">
                            ?
                        </div>

                        <div>

                            <p className="eyebrow">
                                RECOGNITION COMPLETE
                            </p>

                            <h2>
                                Nobody found
                            </h2>

                            <p>
                                None of the members in this
                                group were detected in the photo.
                                Try another photo.
                            </p>

                        </div>

                        <button
                            onClick={retakePhoto}
                        >
                            ↻ Try Again
                        </button>

                    </section>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {message &&
                    !processing &&
                    !isNoMatch &&
                    !isSuccess && (

                    <div className="error-message">

                        <span>
                            !
                        </span>

                        {message}

                    </div>

                )}

            </main>


            {/* =================================================
                STYLES
            ================================================= */}

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

                .camera-page {
                    min-height: 100vh;
                    background: #f7f7fb;
                }


                /* =========================
                   NAVBAR
                ========================= */

                .camera-nav {
                    height: 72px;

                    padding: 0 45px;

                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    background: rgba(
                        255,
                        255,
                        255,
                        0.88
                    );

                    border-bottom:
                        1px solid #e8e8ed;

                    backdrop-filter:
                        blur(10px);
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

                .back-link {
                    text-decoration: none;
                    color: #66666f;
                    font-size: 13px;
                }

                .back-link:hover {
                    color: #111116;
                }

                .nav-label {
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 1.3px;
                    color: #9999a1;
                }


                /* =========================
                   MAIN
                ========================= */

                .camera-container {
                    width: 100%;
                    max-width: 1050px;

                    margin: auto;

                    padding:
                        45px 25px 70px;
                }

                .page-heading {
                    margin-bottom: 25px;
                }

                .eyebrow {
                    margin: 0 0 7px;

                    color: #898992;

                    font-size: 10px;
                    font-weight: 700;

                    letter-spacing: 1.5px;
                }

                .page-heading h1 {
                    margin: 0;

                    font-size: 32px;
                    letter-spacing: -1px;
                }

                .page-heading p:not(.eyebrow) {
                    margin: 8px 0 0;

                    color: #7e7e87;

                    font-size: 13px;
                    line-height: 1.6;

                    max-width: 570px;
                }


                /* =========================
                   CAMERA CARD
                ========================= */

                .camera-card {
                    overflow: hidden;

                    background: #111116;

                    border-radius: 18px;

                    box-shadow:
                        0 18px 55px
                        rgba(
                            15,
                            15,
                            20,
                            0.12
                        );
                }

                .video-wrapper {
                    position: relative;

                    width: 100%;
                    height: 540px;

                    background: #08080b;

                    overflow: hidden;
                }

                .video-wrapper video {
                    width: 100%;
                    height: 100%;

                    object-fit: cover;

                    display: block;
                }

                /*
                 * FRONT CAMERA
                 *
                 * Mirror only the LIVE preview.
                 * This does NOT affect the captured canvas image.
                 */

                .video-wrapper video.front-camera {
                    transform: scaleX(-1);
                }

                .video-wrapper video.rear-camera {
                    transform: none;
                }


                /* =========================
                   PLACEHOLDER
                ========================= */

                .camera-placeholder {
                    position: absolute;

                    inset: 0;

                    display: flex;
                    flex-direction: column;

                    align-items: center;
                    justify-content: center;

                    text-align: center;

                    color: white;
                }

                .camera-placeholder-icon {
                    width: 64px;
                    height: 64px;

                    border-radius: 18px;

                    background: #222229;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    font-size: 28px;

                    margin-bottom: 15px;
                }

                .camera-placeholder h3 {
                    margin: 0;

                    font-size: 17px;
                }

                .camera-placeholder p {
                    margin: 7px 0 0;

                    color: #777780;

                    font-size: 12px;
                }


                /* =========================
                   CAMERA OVERLAY
                ========================= */

                .camera-overlay {
                    position: absolute;

                    inset: 0;

                    pointer-events: none;
                }

                .corner {
                    position: absolute;

                    width: 35px;
                    height: 35px;

                    border-color:
                        rgba(
                            255,
                            255,
                            255,
                            0.8
                        );

                    border-style: solid;
                }

                .top-left {
                    top: 25px;
                    left: 25px;

                    border-width:
                        2px 0 0 2px;
                }

                .top-right {
                    top: 25px;
                    right: 25px;

                    border-width:
                        2px 2px 0 0;
                }

                .bottom-left {
                    bottom: 25px;
                    left: 25px;

                    border-width:
                        0 0 2px 2px;
                }

                .bottom-right {
                    bottom: 25px;
                    right: 25px;

                    border-width:
                        0 2px 2px 0;
                }

                .live-indicator {
                    position: absolute;

                    top: 22px;
                    left: 50%;

                    transform:
                        translateX(-50%);

                    display: flex;
                    align-items: center;

                    gap: 6px;

                    padding:
                        6px 10px;

                    border-radius: 20px;

                    background:
                        rgba(
                            0,
                            0,
                            0,
                            0.5
                        );

                    color: white;

                    font-size: 9px;
                    font-weight: 700;

                    letter-spacing: 1px;
                }

                .live-indicator span {
                    width: 6px;
                    height: 6px;

                    border-radius: 50%;

                    background: #ff5757;
                }

                .camera-mode {
                    position: absolute;

                    bottom: 18px;
                    left: 50%;

                    transform:
                        translateX(-50%);

                    padding:
                        6px 10px;

                    border-radius: 20px;

                    background:
                        rgba(
                            0,
                            0,
                            0,
                            0.55
                        );

                    color: white;

                    font-size: 8px;
                    font-weight: 700;

                    letter-spacing: 1px;

                    white-space: nowrap;
                }


                /* =========================
                   CAMERA CONTROLS
                ========================= */

                .camera-controls {
                    min-height: 105px;

                    padding: 15px 20px;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    gap: 18px;

                    background: #111116;
                }

                .control-button {
                    border:
                        1px solid #303038;

                    background: #1c1c23;

                    color: #aaaab2;

                    min-height: 38px;

                    padding:
                        0 14px;

                    border-radius: 8px;

                    font-size: 11px;

                    cursor: pointer;

                    white-space: nowrap;
                }

                .control-button:hover:not(:disabled) {
                    color: white;
                    background: #292930;
                }

                .control-button:disabled {
                    opacity: 0.35;
                    cursor: not-allowed;
                }

                .capture-button {
                    width: 64px;
                    height: 64px;

                    flex-shrink: 0;

                    border-radius: 50%;

                    border:
                        3px solid white;

                    background: transparent;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    cursor: pointer;
                }

                .capture-button:disabled {
                    opacity: 0.35;
                    cursor: not-allowed;
                }

                .capture-ring {
                    width: 50px;
                    height: 50px;

                    border-radius: 50%;

                    background: white;

                    display: flex;

                    align-items: center;
                    justify-content: center;
                }

                .capture-ring span {
                    width: 42px;
                    height: 42px;

                    border-radius: 50%;

                    background: white;
                }


                /* =========================
                   PHOTO PREVIEW
                ========================= */

                .photo-wrapper {
                    position: relative;

                    width: 100%;
                    height: 540px;

                    background: #08080b;
                }

                .photo-wrapper img {
                    width: 100%;
                    height: 100%;

                    object-fit: contain;

                    display: block;
                }

                .preview-badge {
                    position: absolute;

                    top: 18px;
                    right: 18px;

                    padding:
                        8px 11px;

                    border-radius: 20px;

                    background:
                        rgba(
                            20,
                            20,
                            25,
                            0.75
                        );

                    color: white;

                    font-size: 10px;
                    font-weight: 600;
                }

                .preview-actions {
                    min-height: 100px;

                    padding:
                        0 25px;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    gap: 10px;
                }

                .retake-button,
                .find-button {
                    height: 44px;

                    border-radius: 8px;

                    padding:
                        0 20px;

                    font-size: 12px;
                    font-weight: 600;

                    cursor: pointer;
                }

                .retake-button {
                    background: #202027;

                    border:
                        1px solid #33333b;

                    color: #b0b0b7;
                }

                .find-button {
                    background: white;

                    color: #111116;

                    border: none;

                    min-width: 150px;
                }

                .find-button:disabled,
                .retake-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .small-loader {
                    display: inline-block;

                    width: 12px;
                    height: 12px;

                    border:
                        2px solid #cfcfd4;

                    border-top-color:
                        #111116;

                    border-radius: 50%;

                    animation:
                        spin 0.7s linear infinite;

                    margin-right: 7px;

                    vertical-align: -2px;
                }

                @keyframes spin {
                    to {
                        transform:
                            rotate(360deg);
                    }
                }


                /* =========================
                   PROCESSING
                ========================= */

                .processing-card {
                    margin-top: 18px;

                    padding: 20px;

                    background: white;

                    border:
                        1px solid #e6e6eb;

                    border-radius: 14px;

                    display: flex;

                    align-items: center;

                    gap: 15px;
                }

                .processing-animation {
                    width: 45px;
                    height: 45px;

                    border-radius: 12px;

                    background: #f0ebff;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    gap: 3px;
                }

                .processing-animation div {
                    width: 4px;
                    height: 14px;

                    border-radius: 5px;

                    background: #6d58c9;

                    animation:
                        pulse 0.8s infinite
                        alternate;
                }

                .processing-animation div:nth-child(2) {
                    animation-delay:
                        0.2s;
                }

                .processing-animation div:nth-child(3) {
                    animation-delay:
                        0.4s;
                }

                @keyframes pulse {
                    from {
                        transform:
                            scaleY(0.5);
                    }

                    to {
                        transform:
                            scaleY(1.2);
                    }
                }

                .processing-card strong {
                    font-size: 13px;
                }

                .processing-card p {
                    margin: 4px 0 0;

                    color: #898991;

                    font-size: 11px;
                }


                /* =========================
                   RESULTS
                ========================= */

                .results-section {
                    margin-top: 25px;
                }

                .results-header {
                    display: flex;

                    align-items: center;
                    justify-content: space-between;

                    margin-bottom: 15px;
                }

                .results-header h2 {
                    margin: 0;

                    font-size: 22px;

                    letter-spacing: -0.5px;
                }

                .found-count {
                    width: 34px;
                    height: 34px;

                    border-radius: 9px;

                    background: #111116;

                    color: white;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    font-size: 12px;
                    font-weight: 700;
                }

                .matches-grid {
                    display: flex;

                    flex-direction: column;

                    gap: 9px;
                }

                .match-card {
                    background: white;

                    border:
                        1px solid #e6e6eb;

                    border-radius: 12px;

                    padding: 14px;

                    display: flex;

                    align-items: center;
                }

                .match-avatar {
                    width: 43px;
                    height: 43px;

                    border-radius: 11px;

                    background: #eeeeF2;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    font-size: 14px;
                    font-weight: 700;

                    margin-right: 12px;
                }

                .match-info {
                    display: flex;

                    flex-direction: column;

                    gap: 3px;
                }

                .match-info strong {
                    font-size: 13px;
                }

                .match-info span {
                    font-size: 10px;

                    color: #92929a;
                }

                .match-details {
                    margin-left: auto;

                    display: flex;

                    align-items: center;

                    gap: 18px;
                }

                .similarity {
                    font-size: 12px;

                    font-weight: 700;
                }

                .sent {
                    padding:
                        6px 9px;

                    border-radius: 6px;

                    background: #eaf7ef;

                    color: #348358;

                    font-size: 10px;

                    font-weight: 700;
                }


                /* =========================
                   SUCCESS
                ========================= */

                .success-banner {
                    margin-top: 12px;

                    padding: 15px;

                    display: flex;

                    gap: 12px;

                    border-radius: 11px;

                    background: #ecf8f0;

                    border:
                        1px solid #d5eedf;
                }

                .success-banner > span {
                    width: 25px;
                    height: 25px;

                    border-radius: 50%;

                    background: #348358;

                    color: white;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    font-size: 12px;
                }

                .success-banner strong {
                    font-size: 12px;

                    color: #287347;
                }

                .success-banner p {
                    margin: 3px 0 0;

                    color: #59906f;

                    font-size: 10px;
                }


                /* =========================
                   NO MATCH
                ========================= */

                .no-match-card {
                    margin-top: 25px;

                    padding: 28px;

                    background: white;

                    border:
                        1px solid #e6e6eb;

                    border-radius: 15px;

                    display: flex;

                    align-items: center;

                    gap: 15px;
                }

                .no-match-icon {
                    width: 45px;
                    height: 45px;

                    flex-shrink: 0;

                    border-radius: 12px;

                    background: #f1f1f4;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    font-size: 20px;

                    font-weight: 700;
                }

                .no-match-card h2 {
                    margin: 0;

                    font-size: 17px;
                }

                .no-match-card p:not(.eyebrow) {
                    margin: 5px 0 0;

                    color: #85858e;

                    font-size: 11px;
                }

                .no-match-card button {
                    margin-left: auto;

                    border: none;

                    background: #111116;

                    color: white;

                    padding:
                        10px 14px;

                    border-radius: 8px;

                    font-size: 11px;

                    font-weight: 600;

                    cursor: pointer;
                }


                /* =========================
                   ERROR
                ========================= */

                .error-message {
                    margin-top: 18px;

                    padding:
                        13px 15px;

                    border-radius: 9px;

                    background: #fff0f0;

                    border:
                        1px solid #ffdada;

                    color: #b63d3d;

                    font-size: 12px;

                    display: flex;

                    align-items: center;

                    gap: 9px;
                }

                .error-message span {
                    width: 19px;
                    height: 19px;

                    border-radius: 50%;

                    background: #b63d3d;

                    color: white;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    font-weight: 700;
                }


                /* =========================
                   MOBILE
                ========================= */

                @media (max-width: 700px) {

                    .camera-nav {
                        padding: 0 18px;
                    }

                    .nav-label {
                        display: none;
                    }

                    .camera-container {
                        padding:
                            30px 15px 50px;
                    }

                    .page-heading h1 {
                        font-size: 27px;
                    }

                    .video-wrapper,
                    .photo-wrapper {
                        height: 430px;
                    }

                    .camera-controls {
                        min-height: auto;

                        padding:
                            18px 12px;

                        display: grid;

                        grid-template-columns:
                            1fr 64px 1fr;

                        gap: 12px;
                    }

                    .camera-controls
                    .control-button {
                        width: 100%;

                        padding:
                            0 8px;

                        font-size: 10px;
                    }

                    /*
                     * Put switch camera underneath
                     * on small screens.
                     */

                    .camera-controls
                    .control-button:nth-of-type(2) {
                        grid-column:
                            1 / 2;
                    }

                    .camera-controls
                    .control-button:nth-of-type(3) {
                        grid-column:
                            3 / 4;
                    }

                    .camera-controls
                    .capture-button {
                        grid-column:
                            2 / 3;

                        grid-row:
                            1 / 2;
                    }

                    .no-match-card {
                        align-items:
                            flex-start;

                        flex-wrap: wrap;
                    }

                    .no-match-card button {
                        margin-left: 60px;
                    }

                    .match-details {
                        gap: 8px;
                    }

                }


                /* =========================
                   VERY SMALL PHONES
                ========================= */

                @media (max-width: 420px) {

                    .camera-nav {
                        height: 62px;
                    }

                    .brand {
                        font-size: 15px;
                    }

                    .brand-icon {
                        width: 28px;
                        height: 28px;
                    }

                    .back-link {
                        font-size: 11px;
                    }

                    .video-wrapper,
                    .photo-wrapper {
                        height: 380px;
                    }

                    .camera-controls {
                        grid-template-columns:
                            1fr 58px 1fr;

                        gap: 8px;
                    }

                    .capture-button {
                        width: 58px;
                        height: 58px;
                    }

                    .capture-ring {
                        width: 44px;
                        height: 44px;
                    }

                    .capture-ring span {
                        width: 37px;
                        height: 37px;
                    }

                    .control-button {
                        font-size: 9px;
                    }

                }

            `}</style>

        </div>
    );
}

export default Camera;

