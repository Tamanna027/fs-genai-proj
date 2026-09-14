const express = require("express");
const authMiddleware = require("../middlewares/auth.middlewares");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middlewares");

const interviewRouter = express.Router();

interviewRouter.post(
    "/",
    authMiddleware.authUser,
    upload.single("resume"),
    interviewController.generateInterviewReportController
);

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interviewId.
 * @access private
 */
interviewRouter.get(
    "/report/:interviewId",
    authMiddleware.authUser,
    interviewController.getInterviewReportByIdController
);

/**
 * @route GET /api/interview/report
 * @description Get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get(
    "/report",
    authMiddleware.authUser,
    interviewController.getAllInterviewReportsController
);

module.exports = interviewRouter;