import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useInterview } from "../hooks/useInterview";
import "./Interview.scss";

// --- Sub-components

const QuestionCard = ({ item, index }) => (
    <div className="question-card">
        <div className="question-card__header">
            <span className="question-card__number">Q{index + 1}</span>
            <p className="question-card__question">{item.question}</p>
        </div>

        <span className="pill pill--intention">INTENTION</span>
        <p className="question-card__intention">{item.intention}</p>

        <span className="pill pill--answer">MODEL ANSWER</span>
        <p className="question-card__answer">{item.answer}</p>
    </div>
);

const RoadMapDay = ({ day }) => (
    <div className="roadmap-day">
        <div className="roadmap-day__header">
            <span className="roadmap-day__number">Day {day.day}</span>
            <h4 className="roadmap-day__focus">{day.focus}</h4>
        </div>

        <ul className="roadmap-day__tasks">
            {day.tasks.map((task, i) => (
                <li key={i}>{task}</li>
            ))}
        </ul>
    </div>
);

const SCORE_RADIUS = 46;
const SCORE_CIRCUMFERENCE = 2 * Math.PI * SCORE_RADIUS;

const ScoreRing = ({ score }) => {
    const safeScore = Math.max(0, Math.min(100, score || 0));
    const offset = SCORE_CIRCUMFERENCE - (safeScore / 100) * SCORE_CIRCUMFERENCE;

    const tier =
        safeScore >= 80 ? "high" :
        safeScore >= 60 ? "mid" : "low";

    const tierLabel =
        tier === "high" ? "Strong match for this role" :
        tier === "mid" ? "Decent match for this role" :
        "Limited match for this role";

    return (
        <div className={`score-ring score-ring--${tier}`}>
            <svg viewBox="0 0 110 110">
                <circle
                    className="score-ring__track"
                    cx="55"
                    cy="55"
                    r={SCORE_RADIUS}
                />
                <circle
                    className="score-ring__progress"
                    cx="55"
                    cy="55"
                    r={SCORE_RADIUS}
                    strokeDasharray={SCORE_CIRCUMFERENCE}
                    strokeDashoffset={offset}
                />
            </svg>

            <div className="score-ring__value">
                {safeScore}
                <span>%</span>
            </div>

            <p className="score-ring__caption">{tierLabel}</p>
        </div>
    );
};


// --- Main Component

const NAV_ITEMS = [
    { key: "technical", label: "Technical Questions", icon: "</>" },
    { key: "behavioral", label: "Behavioral Questions", icon: "💬" },
    { key: "roadmap", label: "Road Map", icon: "➤" },
];

const Interview = () => {
    const { interviewId } = useParams();
    const [activeNav, setActiveNav] = useState("technical");
    const { report, loading, getReportById } = useInterview();

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        }
    }, [interviewId]);

    if (loading || !report) {
        return (
            <div className="interview-page">
                <main className="interview-loading">
                    <p>Loading your interview report...</p>
                </main>
            </div>
        );
    }

    const sectionMeta = {
        technical: { title: "Technical Questions", count: report.technicalQuestions.length },
        behavioral: { title: "Behavioral Questions", count: report.behavioralQuestions.length },
        roadmap: { title: "Road Map", count: report.preparationPlan.length },
    };

    return (
        <div className="interview-page">
            <div className="interview-shell">

                {/* — Left Sidebar — */}
                <aside className="interview-sidebar">
                    <p className="sidebar-label">SECTIONS</p>

                    <ul className="sidebar-nav">
                        {NAV_ITEMS.map((item) => (
                            <li
                                key={item.key}
                                className={activeNav === item.key ? "active" : ""}
                                onClick={() => setActiveNav(item.key)}
                            >
                                <span className="sidebar-nav__icon">{item.icon}</span>
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </aside>


                {/* — Main Content — */}
                <main className="interview-main">

                    <div className="main-header">
                        <h2>{sectionMeta[activeNav].title}</h2>
                        {activeNav !== "roadmap" && (
                            <span className="count-badge">
                                {sectionMeta[activeNav].count} questions
                            </span>
                        )}
                    </div>

                    {activeNav === "technical" && (
                        <section className="interview-section">
                            {report.technicalQuestions.map((item, index) => (
                                <QuestionCard key={index} item={item} index={index} />
                            ))}
                        </section>
                    )}

                    {activeNav === "behavioral" && (
                        <section className="interview-section">
                            {report.behavioralQuestions.map((item, index) => (
                                <QuestionCard key={index} item={item} index={index} />
                            ))}
                        </section>
                    )}

                    {activeNav === "roadmap" && (
                        <section className="interview-section">
                            {report.preparationPlan.map((day, index) => (
                                <RoadMapDay key={index} day={day} />
                            ))}
                        </section>
                    )}

                </main>


                {/* — Right Summary — */}
                <aside className="interview-summary">

                    <p className="summary-label">MATCH SCORE</p>
                    <ScoreRing score={report.matchScore} />

                    <p className="summary-label summary-label--gaps">SKILL GAPS</p>
                    <div className="skill-gap-tags">
                        {report.skillGaps.map((gap, index) => (
                            <span
                                key={index}
                                className={`skill-tag skill-tag--${gap.severity}`}
                            >
                                {gap.skill}
                            </span>
                        ))}
                    </div>

                </aside>

            </div>
        </div>
    );
};

export default Interview;