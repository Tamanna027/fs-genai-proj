import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview";
import "../styles/Home.scss";

const MAX_JD_CHARS = 5000;

const Home = () => {
    const { loading, generateReport } = useInterview();

    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [fileName, setFileName] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    const resumeInputRef = useRef();
    const navigate = useNavigate();

    const handleFileChange = (file) => {
        if (file) setFileName(file.name);
    };

    const handleInputChange = (e) => {
        handleFileChange(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            resumeInputRef.current.files = e.dataTransfer.files;
            handleFileChange(file);
        }
    };

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0];
        const data = await generateReport({ jobDescription, selfDescription, resumeFile });
        navigate(`/interview/${data._id}`);
    };

    // --- Loading screen shown after submit ---
    if (loading) {
        return (
            <main className="loading-screen">
                <h1>Loading your interview plan...</h1>
            </main>
        );
    }

    return (
        <main className="home-page">

            {/* HEADER */}

            <div className="hero">
                <h1>
                    Create Your Custom
                    <span> Interview Plan</span>
                </h1>

                <p className="hero-description">
                    Let our AI analyze the job requirements and your unique
                    profile to build a winning strategy.
                </p>
            </div>


            {/* PLANNER CARD */}

            <div className="planner-card">

                {/* JOB DESCRIPTION */}

                <div className="planner-col jd-col">

                    <div className="col-header">
                        <span className="col-icon">💼</span>
                        <h3>Target Job Description</h3>
                        <span className="badge badge--required">REQUIRED</span>
                    </div>

                    <textarea
                        className="jd-textarea"
                        value={jobDescription}
                        maxLength={MAX_JD_CHARS}
                        onChange={(e) => setJobDescription(e.target.value)}
                        name="jobDescription"
                        id="jobDescription"
                        placeholder={
                            "Paste the full job description here...\n" +
                            "e.g. 'Senior Frontend Engineer at Google requires " +
                            "proficiency in React, TypeScript, and large-scale " +
                            "system design...'"
                        }
                    ></textarea>

                    <div className="char-counter">
                        {jobDescription.length} / {MAX_JD_CHARS} chars
                    </div>

                </div>


                <div className="planner-divider" />


                {/* PROFILE */}

                <div className="planner-col profile-col">

                    <div className="col-header">
                        <span className="col-icon">👤</span>
                        <h3>Your Profile</h3>
                    </div>

                    <div className="upload-block">

                        <div className="upload-block__label">
                            <span>Upload Resume</span>
                            <span className="badge badge--best">BEST RESULTS</span>
                        </div>

                        <label
                            className={`upload-dropzone${isDragging ? " dragging" : ""}`}
                            htmlFor="resume"
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                        >
                            <div className="upload-dropzone__icon">⬆</div>

                            <strong>
                                {fileName || "Click to upload or drag & drop"}
                            </strong>

                            <span>
                                {fileName ? "File selected" : "PDF or DOCX (Max 5MB)"}
                            </span>
                        </label>

                        <input
                            ref={resumeInputRef}
                            hidden
                            type="file"
                            name="resume"
                            id="resume"
                            accept=".pdf,.docx"
                            onChange={handleInputChange}
                        />

                    </div>

                    <div className="or-divider">
                        <span>OR</span>
                    </div>

                    <div className="self-desc-block">
                        <p className="self-desc-block__label">Quick Self-Description</p>

                        <textarea
                            value={selfDescription}
                            onChange={(e) => setSelfDescription(e.target.value)}
                            name="selfDescription"
                            id="selfDescription"
                            placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                        ></textarea>
                    </div>

                    <div className="info-note">
                        <span className="info-note__dot" />
                        Either a <strong>Resume</strong> or a{" "}
                        <strong>Self Description</strong> is required to
                        generate a personalized plan.
                    </div>

                </div>

            </div>


            {/* FOOTER ROW */}

            <div className="planner-footer">
                <p className="planner-footer__note">
                    AI-Powered Strategy Generation • Approx 30s
                </p>

                <button
                    className="generate-btn"
                    onClick={handleGenerateReport}
                >
                    <span className="star">★</span>
                    Generate My Interview Strategy
                </button>
            </div>

        </main>
    );
};

export default Home;