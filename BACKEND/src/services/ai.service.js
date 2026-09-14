const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
  title: z.string().describe(
    "The job title for which this interview report is generated, extracted from the job description (e.g. 'Frontend Developer'). This field is mandatory and must never be left empty."
  ),

  matchScore: z.number().describe(
    "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
  ),

  technicalQuestions: z.array(z.object({
    question: z.string().describe("The technical question can be asked in the interview"),
    intention: z.string().describe("The intention of interviewer behind asking this question"),
    answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
  })).describe(
    "Technical questions that can be asked in the interview along with their intention and how to answer them"
  ),

  behavioralQuestions: z.array(z.object({
    question: z.string().describe("The technical question can be asked in the interview"),
    intention: z.string().describe("The intention of interviewer behind asking this question"),
    answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
  })).describe(
    "Behavioral questions that can be asked in the interview along with their intention and how to answer them"
  ),

  skillGaps: z.array(z.object({
    skill: z.string().describe("The skill which the candidate is lacking"),
    severity: z.enum(["low", "medium", "high"]).describe(
      "The severity of this skill gap, i.e. how important it is"
    )
  })).describe(
    "List of skill gaps in the candidate's profile along with their severity"
  ),

  preparationPlan: z.array(z.object({
    day: z.number().describe(
      "The day number in the preparation plan, starting from 1"
    ),
    focus: z.string().describe(
      "The main focus of this day in the preparation plan"
    ),
    tasks: z.array(z.string()).describe(
      "List of tasks to be done on this day"
    )
  })).describe(
    "A day-wise preparation plan for the candidate to follow in order to prepare for the interview"
  )
})

function extractFallbackTitle(jobDescription) {
    // Try common "Job Title: X" / "Title: X" patterns first
    const labeled = jobDescription.match(/(?:job\s*)?title[:\s]+([^\n]+)/i);
    if (labeled && labeled[1].trim()) {
        return labeled[1].trim();
    }
    // Otherwise fall back to the first non-empty line of the job description
    const firstLine = jobDescription.split("\n").map(l => l.trim()).find(Boolean);
    return firstLine ? firstLine.slice(0, 100) : "Untitled Position";
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
                    Resume:${resume}
                    Self Description:${selfDescription}
                    Job Description:${jobDescription}

                    IMPORTANT: Your JSON response MUST include a non-empty "title" field
                    containing the job title extracted from the job description above.
                    Never omit this field.`

    // IMPORTANT: $refStrategy "none" inlines the schema instead of using
    // $ref/definitions, which Gemini's structured output cannot resolve.
    // Without this, "required" fields can get silently dropped.
    const jsonSchema = zodToJsonSchema(interviewReportSchema, { $refStrategy: "none" });

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: jsonSchema
        }
    })

    let parsed;
    try {
        parsed = JSON.parse(response.text);
    } catch (err) {
        console.error("Failed to parse AI response as JSON. Raw response:", response.text);
        throw new Error("AI response was not valid JSON");
    }

    // Gemini's structured output doesn't always strictly enforce "required"
    // fields, so we log the raw response when title is missing (for
    // debugging) and fall back to extracting a title from the job
    // description instead of failing the whole request.
    if (!parsed.title || !parsed.title.trim()) {
        console.warn("AI response missing 'title'. Raw response:", response.text);
        parsed.title = extractFallbackTitle(jobDescription);
    }

    if (typeof parsed.matchScore !== "number") {
        console.warn("AI response missing valid 'matchScore'. Raw response:", response.text);
        parsed.matchScore = 0;
    }

    return parsed;
}

module.exports = generateInterviewReport