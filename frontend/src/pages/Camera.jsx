
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
            setMessage("Camera started");

        } catch (error) {
            console.error("Camera error:", error);

            setMessage(
                "Could not access camera"
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

                // Clear previous results
                setMatches([]);

                setMessage(
                    "Photo captured successfully!"
                );
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

            const formData =
                new FormData();

            formData.append(
                "file",
                photo,
                "click.jpg"
            );

            setMessage(
                "Finding people..."
            );

            setMatches([]);

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

            // =========================
            // GET BACKEND RESULTS
            // =========================

            const allResults =
                response.data.matches || [];

            console.log(
                "All results:",
                allResults
            );

            // Only keep people that were actually found
            const foundPeople =
                allResults.filter(
                    (person) =>
                        person.found === true
                );

            console.log(
                "Found people:",
                foundPeople
            );

            setMatches(foundPeople);

            // =========================
            // DISPLAY MESSAGE
            // =========================

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

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "Response:",
                error.response?.data
            );

            setMessage(
                error.response?.data?.detail ||
                "Failed to process photo"
            );
        }
    };

    // =========================
    // UI
    // =========================

    return (
        <div>

            <h1>
                📷 Click Photo
            </h1>

            <p>
                Group ID: {groupId}
            </p>

            <hr />

            {/* CAMERA */}

            <video
                ref={videoRef}
                autoPlay
                playsInline
                width="500"
            />

            <br />
            <br />

            <button
                onClick={startCamera}
            >
                Start Camera
            </button>

            {" "}

            <button
                onClick={takePhoto}
            >
                📷 Take Photo
            </button>

            {" "}

            <button
                onClick={stopCamera}
            >
                Stop Camera
            </button>

            <canvas
                ref={canvasRef}
                style={{
                    display: "none"
                }}
            />

            <hr />

            {/* CAPTURED PHOTO */}

            {photo && (

                <div>

                    <h2>
                        Photo Captured
                    </h2>

                    <img
                        src={URL.createObjectURL(photo)}
                        alt="Captured"
                        width="500"
                    />

                    <br />
                    <br />

                    <button
                        onClick={sendPhoto}
                    >
                        🔍 Find People
                    </button>

                </div>
            )}

            <hr />

            {/* STATUS MESSAGE */}

            <h3>
                {message}
            </h3>

            {/* =========================
                FOUND PEOPLE
            ========================= */}

            {matches.length > 0 && (

                <div>

                    <h2>
                        👥 People Found
                    </h2>

                    {matches.map(
                        (person, index) => (

                            <div
                                key={index}
                                style={{
                                    border: "1px solid gray",
                                    padding: "15px",
                                    marginBottom: "10px"
                                }}
                            >

                                <h3>
                                   👤 {person.name || `User ${person.user_id}`}
                                </h3>

                                <p>
                                    Similarity:{" "}
                                    <strong>
                                        {(
                                            person.similarity *
                                            100
                                        ).toFixed(2)}
                                        %
                                    </strong>
                                </p>

                                <p>
                                    ✅ Photo sent to Telegram
                                </p>

                            </div>

                        )
                    )}

                </div>
            )}

            {/* =========================
                NO PEOPLE FOUND
            ========================= */}

            {matches.length === 0 &&
                message ===
                    "No group members found in this photo." && (

                <div>

                    <h2>
                        😕 No Match
                    </h2>

                    <p>
                        None of the members
                        of this group were
                        detected in the photo.
                    </p>

                </div>
            )}

            <br />

            {/* BACK TO GROUP */}

            <Link
                to={`/groups/${groupId}`}
            >
                <button>
                    ← Back to Group
                </button>
            </Link>

        </div>
    );
}

export default Camera;

