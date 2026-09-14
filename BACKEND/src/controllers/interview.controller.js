const pdfParse = require("pdf-parse");

const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
    try {
        // Check whether resume was uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF is required"
            });
        }

        // Get text fields
        const { selfDescription, jobDescription } = req.body;

        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                message: "selfDescription and jobDescription are required"
            });
        }

        // Convert Node.js Buffer to Uint8Array
        const pdfData = new Uint8Array(req.file.buffer);

        // Parse PDF
        const resumeContent = await (
            new pdfParse.PDFParse(pdfData)
        ).getText();

        // Check extracted text
        if (!resumeContent.text || !resumeContent.text.trim()) {
            return res.status(400).json({
                message: "Could not extract text from the resume PDF"
            });
        }

        // Generate interview report using AI
        // ai.service.js now validates that `title` and `matchScore` are present
        // and throws a clear error here if the AI response is missing them,
        // instead of letting Mongoose fail later with a confusing message.
        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });

        // Save report in MongoDB
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        // Send response
        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Interview report generation error:", error);

        return res.status(500).json({
            message: "Failed to generate interview report",
            error: error.message
        });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (error) {
        console.error("Get interview report error:", error);
        return res.status(500).json({
            message: "Failed to fetch interview report",
            error: error.message
        });
    }
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReport = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        return res.status(200).json({
            message: "interview reports fetched",
            interviewReport
        });
    } catch (error) {
        console.error("Get all interview reports error:", error);
        return res.status(500).json({
            message: "Failed to fetch interview reports",
            error: error.message
        });
    }
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController };