const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { GoogleGenAI } = require("@google/genai")

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

let aiClient = null

async function getAI() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing")
    }

    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  }

  return aiClient
}

/* --------------------------------
   Health Check
-------------------------------- */

app.get("/", (req, res) => {
  res.json({
    message: "AI Mentor backend is running",
  })
})

/* --------------------------------
   AI Chat
-------------------------------- */

app.post("/api/chat", async (req, res) => {
  try {
    const {
      message,
      userName,
      currentTopic,
      currentLesson,
      learningLevel,
      practiceScore,
      performanceContext,
      learningProgress,
      completedTopics,
      completedLessons,
      topicChallengeScore,
      levelInstruction,
    } = req.body

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      })
    }

    const client = await getAI()

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash-lite",

      contents: `
You are AI Mentor, a personalized AI tutor inside an Artificial Intelligence learning platform.

Your job is to teach the student, not simply provide answers.

==================================================
STUDENT PROFILE
==================================================

Student name:
${userName || "Student"}

Current learning level:
${learningLevel || "Beginner"}

Current topic:
${currentTopic || "Not currently selected"}

Current lesson:
${currentLesson || "Not currently selected"}

Practice score:
${practiceScore ?? 0}%

Performance context:
${performanceContext || "No performance information available"}

Learning progress:
${learningProgress || "No progress information available"}

Completed topics:
${completedTopics || "None"}

Completed lessons:
${completedLessons || "None"}

Current topic challenge score:
${
  topicChallengeScore !== null &&
  topicChallengeScore !== undefined
    ? `${topicChallengeScore}%`
    : "Not attempted"
}

==================================================
LEVEL-SPECIFIC TEACHING INSTRUCTIONS
==================================================

${levelInstruction || `
Match the explanation to the student's current learning level.

Beginner:
- Use simple English.
- Explain concepts step by step.
- Use basic examples.
- Do not assume prior AI knowledge.

Intermediate:
- Give moderately detailed technical explanations.
- Use practical examples.
- Connect related concepts.
- Include mathematical reasoning when useful.

Advanced:
- Give technically detailed explanations.
- Discuss deeper reasoning.
- Discuss algorithms, trade-offs, mathematical intuition, and practical applications when relevant.
`}

==================================================
CORE TEACHING RULES
==================================================

1. Stay focused on:
   - Artificial Intelligence
   - Machine Learning
   - Neural Networks
   - Generative AI

2. Match every explanation to the student's current learning level.

3. Do not teach Advanced material to a Beginner unless the student specifically asks for it.

4. Do not unnecessarily simplify Advanced questions.

5. Use the student's current topic and lesson whenever relevant.

6. Use completed lessons to understand what the student has already learned.

7. Avoid repeating concepts the student has already mastered unless repetition is useful for clarification.

8. If the student appears weak in a concept, explain it again using a different example.

9. If the student asks a problem-solving question:
   - First identify what the question is asking.
   - Explain the concept needed.
   - Show the reasoning step by step.
   - Then provide the answer.

10. For numerical questions:
    - Show the formula when appropriate.
    - Substitute the values.
    - Calculate step by step.
    - Clearly state the final answer.

11. For MCQ questions:
    - Explain why the correct option is correct.
    - Explain why the important wrong options are wrong when useful.

12. For Topic Challenge questions:
    - Do not immediately reveal the answer.
    - Guide the student through the reasoning first.
    - Reveal the answer after the explanation when necessary.

13. When the student asks what to learn next:
    - Consider the current topic.
    - Consider completed lessons.
    - Consider overall progress.
    - Consider practice performance.
    - Recommend the next appropriate learning step.

14. When the student asks about weak areas:
    - Use the available scores and progress.
    - Do not invent performance data that is not provided.

15. Do not claim that the student completed something unless the provided progress information supports it.

16. Do not provide unrelated content.

17. Avoid meaningless motivational statements.

18. Be clear, useful, and educational.

==================================================
ADAPTIVE LEARNING
==================================================

Use the student's performance to adjust the teaching style.

If practice performance is strong:
- Give slightly more challenging explanations or problems.
- Encourage deeper application.

If practice performance is moderate:
- Reinforce the concept.
- Give a practical example.
- Then provide a moderate practice question.

If practice performance is weak:
- Re-explain the relevant concept.
- Use a simpler example.
- Give a smaller practice problem before moving to a harder one.

Do not change the student's official learning level based only on the practice score.

The official learning level is the level supplied above.

==================================================
STUDENT QUESTION
==================================================

${message}

==================================================
RESPONSE STYLE
==================================================

- Use clear headings when helpful.
- Use short paragraphs.
- Use bullet points for steps.
- Use examples when they improve understanding.
- Keep the answer focused on the student's question.
- Do not unnecessarily repeat the student's profile.
`,

    })

    res.json({
      response: response.text,
    })
  } catch (error) {
    console.error("Chat error:", error)

    res.status(500).json({
      error: "Failed to generate AI response",
    })
  }
})

/* --------------------------------
   General AI Quiz
-------------------------------- */

app.post("/api/generate-quiz", async (req, res) => {
  try {
    const {
      topic,
      difficulty,
    } = req.body

    if (!topic) {
      return res.status(400).json({
        error: "Topic is required",
      })
    }

    const client = await getAI()

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash-lite",

      config: {
        responseMimeType: "application/json",
      },

      contents: `
You are creating a quiz for an Artificial Intelligence learning platform.

Topic:
${topic}

Difficulty:
${difficulty || "Beginner"}

Create exactly 5 multiple-choice questions.

Rules:
- Questions must be related to Artificial Intelligence.
- Match the requested difficulty.
- Each question must have exactly 4 options.
- Only one option must be correct.
- Avoid trick questions.
- Questions should test understanding rather than memorization only.
- Return ONLY valid JSON.

Return exactly:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "correctAnswer": "Correct option"
    }
  ]
}
`,
    })

    const quiz = JSON.parse(response.text)

    res.json(quiz)
  } catch (error) {
    console.error("Quiz generation error:", error)

    res.status(500).json({
      error: "Failed to generate quiz",
    })
  }
})

/* --------------------------------
   Lesson Quick Check
-------------------------------- */

app.post(
  "/api/generate-lesson-quiz",
  async (req, res) => {
    try {
      const {
        topic,
        lessonTitle,
        lessonContent,
        learningLevel,
      } = req.body

      if (
        !topic ||
        !lessonTitle ||
        !lessonContent
      ) {
        return res.status(400).json({
          error:
            "Topic, lesson title, and lesson content are required",
        })
      }

      const client = await getAI()

      const response =
        await client.models.generateContent({
          model:
            "gemini-3.5-flash-lite",

          config: {
            responseMimeType:
              "application/json",
          },

          contents: `
You are creating a Quick Check quiz for an AI learning platform.

Topic:
${topic}

Lesson:
${lessonTitle}

Lesson Content:
${lessonContent}

Student Learning Level:
${learningLevel || "Beginner"}

Create exactly 3 multiple-choice questions.

The questions must test different kinds of understanding where appropriate.

Possible question types:
- MCQ
- Conceptual
- Scenario/Application
- Numerical/Problem-solving

Rules:
- Questions MUST be based ONLY on the lesson content provided.
- Do not introduce unrelated concepts.
- Match the difficulty to the student's learning level.
- Beginner: basic understanding and simple application.
- Intermediate: deeper understanding and application.
- Advanced: reasoning, analysis, and conceptual application.
- Numerical questions may be used only when the lesson naturally supports calculations.
- Do not force numerical questions into lessons where calculations do not make sense.
- Scenario questions should use realistic AI-related situations.
- Conceptual questions should test understanding of the lesson.
- Each question must have exactly 4 options.
- Only one option must be correct.
- Do not make trick questions.
- Do not repeat questions.

Return ONLY valid JSON in this exact format:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "correctAnswer": "Correct option"
    }
  ]
}
`,
        })

      const quiz = JSON.parse(
        response.text
      )

      res.json(quiz)
    } catch (error) {
      console.error(
        "Lesson quiz generation error:",
        error
      )

      res.status(500).json({
        error:
          "Failed to generate lesson quiz",
      })
    }
  }
)

/* --------------------------------
   Topic Challenge
-------------------------------- */

app.post(
  "/api/generate-topic-challenge",
  async (req, res) => {
    try {
      const {
        topic,
        learningLevel,
        lessonContent,
      } = req.body

      if (!topic || !lessonContent) {
        return res.status(400).json({
          error:
            "Topic and lesson content are required",
        })
      }

      const client = await getAI()

      const response =
        await client.models.generateContent({
          model:
            "gemini-3.5-flash-lite",

          config: {
            responseMimeType:
              "application/json",
          },

          contents: `
You are creating a final Topic Challenge for an Artificial Intelligence learning platform.

Topic:
${topic}

Student Learning Level:
${learningLevel || "Beginner"}

Completed Lesson Content:
${lessonContent}

The student has completed the lessons above.

Create exactly 5 multiple-choice challenge questions.

The challenge should test the student's understanding of the COMPLETE topic.

Use a mixture of question styles when appropriate:
- Conceptual understanding
- Scenario/application
- Numerical/problem-solving when naturally applicable
- Reasoning
- Standard MCQ

Important rules:

1. Questions must be based ONLY on the supplied lesson content.
2. Do not introduce unrelated AI topics.
3. Match the student's learning level.
4. Beginner:
   - fundamental concepts
   - simple application
   - basic reasoning
5. Intermediate:
   - deeper concepts
   - application
   - comparison
   - reasoning
6. Advanced:
   - deeper reasoning
   - analysis
   - practical application
   - conceptual relationships
7. Numerical questions should only be included when the supplied lessons contain concepts that naturally support calculations.
8. Do not force numerical questions.
9. Each question must have exactly 4 options.
10. Only one option must be correct.
11. Do not create trick questions.
12. Do not repeat questions.
13. Questions should cover different parts of the topic.
14. The challenge should be harder than the individual lesson Quick Checks.
15. Include a short explanation for every correct answer.

Return ONLY valid JSON in exactly this format:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "correctAnswer": "Correct option",
      "explanation": "Why this answer is correct"
    }
  ]
}
`,
        })

      const challenge = JSON.parse(
        response.text
      )

      if (
        !challenge.questions ||
        !Array.isArray(
          challenge.questions
        )
      ) {
        throw new Error(
          "Invalid challenge generated by AI"
        )
      }

      res.json(challenge)
    } catch (error) {
      console.error(
        "Topic challenge generation error:",
        error
      )

      res.status(500).json({
        error:
          "Failed to generate topic challenge",
      })
    }
  }
)

/* --------------------------------
   AI Quiz Feedback
-------------------------------- */

app.post(
  "/api/quiz-feedback",
  async (req, res) => {
    try {
      const {
        topic,
        score,
        totalQuestions,
        userName,
      } = req.body

      if (
        !topic ||
        score === undefined
      ) {
        return res.status(400).json({
          error:
            "Topic and score are required",
        })
      }

      const client = await getAI()

      const response =
        await client.models.generateContent({
          model:
            "gemini-3.5-flash-lite",

          contents: `
You are an AI learning mentor.

Student:
${userName || "Student"}

Topic:
${topic}

Score:
${score}%

Total questions:
${totalQuestions || "Unknown"}

Give short, useful feedback.

Include:
- What the score indicates
- What the student should review
- One practical suggestion for improving

Do not exaggerate.
Do not use meaningless motivational statements.
Keep the feedback focused on learning Artificial Intelligence.
`,
        })

      res.json({
        feedback: response.text,
      })
    } catch (error) {
      console.error(
        "Feedback generation error:",
        error
      )

      res.status(500).json({
        error:
          "Failed to generate AI feedback",
      })
    }
  }
)

/* --------------------------------
   Start Server
-------------------------------- */

const PORT = 5000

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  )
})