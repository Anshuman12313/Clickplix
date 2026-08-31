
import { useRef, useState } from "react";
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

    // =========================
    // START CAMERA
    // =========================

    const startCamera = async () => {
        try {
            const mediaStream =
                await navigator.mediaDevices.getUserMedia({
                    video: true
                });

            videoRef.current.srcObject = mediaStream;

            setStream(mediaStream);
            setMessage("");

        } catch (error) {
            console.error("Camera error:", error);

            setMessage(
                "Could not access camera. Please allow camera permission."
            );
        }
    };

    // =========================
    // STOP CAMERA
    // =========================

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

    // =========================
    // TAKE PHOTO
    // =========================

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

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context =
            canvas.getContext("2d");

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

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

            },
            "image/jpeg"
        );
    };

    // =========================
    // SEND PHOTO
    // =========================

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

    // =========================
    // RETAKE
    // =========================

    const retakePhoto = () => {
        setPhoto(null);
        setMatches([]);
        setMessage("");
    };

    const isSuccess =
        matches.length > 0 &&
        !processing;

    const isNoMatch =
        message ===
        "No group members found in this photo.";

    return (
        <div className="camera-page">

            {/* NAVBAR */}

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


            {/* MAIN */}

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


                {/* CAMERA AREA */}

                <section className="camera-card">

                    {!photo ? (

                        <>

                            {/* VIDEO */}

                            <div className="video-wrapper">

                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
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
                                >
                                    <span className="capture-ring">
                                        <span></span>
                                    </span>
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


                {/* PROCESSING */}

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


                {/* SUCCESS */}

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


                {/* NO MATCH */}

                {isNoMatch && !processing && (

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


                {/* ERROR */}

                {message &&
                    !processing &&
                    !isNoMatch &&
                    !isSuccess && (

                    <div className="error-message">

                        <span>!</span>

                        {message}

                    </div>

                )}

            </main>


            {/* STYLES */}

            

        </div>
    );
}

export default Camera;

