import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// MongoDB URI
let rawMongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio_inquiries";
if (!rawMongoUri.startsWith("mongodb://") && !rawMongoUri.startsWith("mongodb+srv://")) {
  rawMongoUri = `mongodb://${rawMongoUri.replace(/^\/+/, "")}`;
}
const MONGO_URI = rawMongoUri;

// Mongoose Schema & Model for Inquiries
interface IInquiry {
  senderName: string;
  senderEmail: string;
  company?: string;
  roleType: string;
  message: string;
  emailSent: boolean;
  emailError?: string;
  ip?: string;
  createdAt: Date;
}

const InquirySchema = new mongoose.Schema<IInquiry>(
  {
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    company: { type: String, default: "" },
    roleType: { type: String, required: true },
    message: { type: String, required: true },
    emailSent: { type: Boolean, default: false },
    emailError: { type: String },
    ip: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Inquiry = mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

// In-memory fallback cache so submissions are never lost even if MongoDB local daemon isn't booted
const fallbackStorage: any[] = [];

// Connect to MongoDB gracefully
let isMongoConnected = false;
let mongoConnectionError = "";

async function initMongoDB() {
  try {
    // 2-second timeout to avoid blocking server boot if local mongod is not yet running
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    isMongoConnected = true;
    mongoConnectionError = "";
    console.log(`[MongoDB] Connected successfully to ${MONGO_URI}`);
  } catch (err: any) {
    isMongoConnected = false;
    mongoConnectionError = err.message || "Failed to connect to MongoDB";
    console.warn(`[MongoDB Warning] Could not connect to ${MONGO_URI}: ${mongoConnectionError}. System will use resilient in-memory & dual-dispatch mode.`);
  }
}

initMongoDB();

// Reconnection watcher
mongoose.connection.on("disconnected", () => {
  isMongoConnected = false;
  console.log("[MongoDB] Disconnected.");
});
mongoose.connection.on("connected", () => {
  isMongoConnected = true;
  mongoConnectionError = "";
  console.log("[MongoDB] Connected.");
});

// Configure Nodemailer transporter if SMTP credentials are provided
let mailTransporter: any = null;

function getMailTransporter() {
  if (mailTransporter) return mailTransporter;

  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (user && pass) {
    mailTransporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || "gmail",
      auth: { user, pass },
    });
  }
  return mailTransporter;
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Health & Database Status
app.get("/api/db-status", async (req, res) => {
  const readyState = mongoose.connection.readyState;
  let storedCount = 0;
  if (readyState === 1) {
    try {
      storedCount = await Inquiry.countDocuments();
    } catch {
      storedCount = fallbackStorage.length;
    }
  } else {
    storedCount = fallbackStorage.length;
  }

  res.json({
    connected: readyState === 1,
    readyState, // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    database: "portfolio_inquiries",
    targetEmail: "priyadrshanbaral@gmail.com",
    error: readyState === 1 ? null : mongoConnectionError || "MongoDB service connecting...",
    inquiriesCount: storedCount,
    smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
    timestamp: new Date().toISOString(),
  });
});

// 2. Fetch Recent Inquiries (For inspection / transparency)
app.get("/api/inquiries", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const records = await Inquiry.find().sort({ createdAt: -1 }).limit(20);
      return res.json({ success: true, source: "mongodb", data: records });
    }
    return res.json({ success: true, source: "cache", data: fallbackStorage.slice(-20).reverse() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message, data: fallbackStorage });
  }
});

// 2b. Exact Profile Photo Upload Handler
app.post("/api/upload-avatar", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: "imageBase64 is required" });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const targetFile = path.join(publicDir, "priyadarshan.jpg");
    fs.writeFileSync(targetFile, buffer);

    // Also update public/profile.jpg for backwards compatibility
    const targetFile2 = path.join(publicDir, "profile.jpg");
    fs.writeFileSync(targetFile2, buffer);

    // If dist exists, copy over
    const distDir = path.join(process.cwd(), "dist");
    if (fs.existsSync(distDir)) {
      try {
        fs.writeFileSync(path.join(distDir, "priyadarshan.jpg"), buffer);
        fs.writeFileSync(path.join(distDir, "profile.jpg"), buffer);
      } catch (distErr) {
        // ignore
      }
    }

    console.log("[Avatar Upload] Exact photo successfully saved to public/priyadarshan.jpg");
    return res.json({
      success: true,
      message: "Exact photo saved successfully!",
      url: `/priyadarshan.jpg?t=${Date.now()}`,
    });
  } catch (err: any) {
    console.error("[Avatar Upload Error]", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2c. Advanced Gemini AI Assistant Chat Endpoint
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (genAIClient) return genAIClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  genAIClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  return genAIClient;
}

const ASSISTANT_SYSTEM_PROMPT = `
You are the AI Portfolio Assistant & Career Concierge for Priyadarshan Baral, a motivated and skilled MERN Stack Full Stack Developer based in Bhubaneswar, Odisha, India.
Your goal is to provide concise, friendly, articulate, and recruiter-focused answers to recruiters, hiring managers, and engineers evaluating Priyadarshan.

KEY PROFILE FACTS:
- Candidate Name: Priyadarshan Baral
- Primary Role: MERN Stack Full Stack Developer (React.js, Node.js, Express.js, MongoDB)
- Immediate Availability: Yes, he is an Immediate Joiner open for Junior / Fresher Full Stack Developer roles (Remote, Hybrid, or On-site in Bhubaneswar / Bangalore / Hyderabad / Pune / Pan-India).
- Email: priyadrshanbaral@gmail.com
- Phone: +91 89840 54385
- LinkedIn: https://linkedin.com/in/priyadarshan-baral
- GitHub: https://github.com/priyadarshanbaral

CORE TECHNICAL COMPETENCIES:
- Languages: JavaScript (ES6+), HTML5, CSS3
- Frontend Architecture: React.js, React Hooks (useState, useEffect, useMemo, useRef), State Management, Responsive Web Design, Tailwind CSS, Three.js 3D WebGL, Modern UI/UX.
- Backend Architecture: Node.js, Express.js, RESTful API design, CRUD Operations, Custom Middlewares, CORS, Error Handling, JWT auth concepts.
- Databases: MongoDB, Mongoose ODM, Schema validation, Relational indexing, Aggregations.
- Tooling & Version Control: Git, GitHub, VS Code, Postman API testing, Vite, npm.

FEATURED PROJECTS:
1. Library Management System (Full MERN Stack):
   - Comprehensive web application for academic libraries & resource centers.
   - Features book issue/return tracking, patron records, real-time catalog search, automated overdue fines calculation, and RESTful API endpoints with Mongoose.
   - Note: There is an interactive live simulator right on this portfolio's Projects section!
2. Online Shopping Website (Frontend / E-Commerce):
   - Responsive web store with dynamic category filtering, interactive shopping cart, promo discount vouchers, and simulated checkout/order invoice generation.
3. Banking Website (Front-End Simulation):
   - Accessible digital banking portal with balance monitoring, transfer limits validation, and debit card security freeze state toggle.

EXPERIENCE:
- Full Stack Developer Intern at Evatril Private Limited (September 2026 – Present, Bhubaneswar, Odisha):
  - Selected into the Tech Team as a Full Stack Developer Intern; builds production web modules across client and server layers.
  - Works within a 3-month initial internship period reporting to the Tech Head, Tridip Maharana, following company coding standards, source-code confidentiality policies, and structured performance reviews.
- MERN Stack Developer Intern at Vidyavistara Institute (January 2026 – August 2026, Bhubaneswar, Odisha):
  - Built full-stack applications with React.js frontends and Express/Node.js REST APIs with MongoDB data models.
  - Collaborated via Git version control and Agile-style task tracking.
  - Collaborates using Git version control and Agile task workflows.
  - Debugs frontend and backend issues to enhance production reliability.

EDUCATION:
- B.Tech in Computer Science: NM Institute of Engineering and Technology, Bhubaneswar (2023 – 2027 Ongoing, CGPA: 7.85 up to 6th semester).
- 12th Science: Godavarish Higher Secondary School, Banpur (2021 – 2023, 65%).
- 10th Matriculation: Godavarish Vidyapitha, Banpur (2020 – 2021, 73%).

CERTIFICATIONS:
- Web Development Certification (Vidyavistara Institute)
- Artificial Intelligence (IBM SkillsBuild)
- AI Tools Workshop (be10X)
- DSA & MERN Workshop (MyAnatomy)

INTERACTION INSTRUCTIONS:
- Keep answers professional, concise, punchy, and confident (typically 2-4 sentences or tight bullet points).
- Emphasize his readiness to write clean, maintainable code from day one.
- If asked about hiring or interviews, mention his immediate availability, suggest dropping a note via the Contact section below or writing to priyadrshanbaral@gmail.com.
`;

// Contextual fallback responder when Gemini API key is absent or during network failures
function getContextualFallback(userQuery: string): { reply: string; suggestions: string[] } {
  const q = userQuery.toLowerCase();

  if (q.includes("fit") || q.includes("why hire") || q.includes("strength") || q.includes("evaluat") || q.includes("recommend")) {
    return {
      reply: "### Why Priyadarshan is an Outstanding Candidate:\n\n• **End-to-End MERN Mastery:** Proven hands-on capability building full-stack applications with React, Node.js, Express, and MongoDB.\n• **Two Engineering Internships:** Currently a Full Stack Developer Intern at Evatril Private Limited, following a MERN Stack internship at Vidyavistara Institute with production Git workflows and Agile sprints.\n• **Strong CS Fundamentals:** 7.85 CGPA in B.Tech Computer Science (up to 6th semester) with IBM SkillsBuild AI and MyAnatomy DSA certifications.\n• **Immediate Joiner:** Ready to join immediately with zero notice period for junior/fresher roles.",
      suggestions: ["What projects has he built?", "What are his interview topics?", "How do I contact him?"],
    };
  }

  if (q.includes("interview") || q.includes("question") || q.includes("quiz") || q.includes("test")) {
    return {
      reply: "### Suggested Technical Interview Topics for Priyadarshan:\n\n1. **React State & Lifecycle:** Explain hooks (`useState`, `useEffect`, `useMemo`, `useRef`), Virtual DOM reconciliation, and component composition.\n2. **REST API Architecture:** Building scalable Express.js routers, custom validation middlewares, error handling, and JWT authentication.\n3. **MongoDB Data Modeling:** Schema design in Mongoose, embedding vs. referencing, relational indexing, and aggregation pipelines.\n4. **Code Quality & Git:** Branching strategies, code reviews, Postman API testing, and responsive CSS with Tailwind.",
      suggestions: ["What are his top projects?", "Tell me about his internship", "Schedule an interview"],
    };
  }

  if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("react") || q.includes("node") || q.includes("mongo")) {
    return {
      reply: "Priyadarshan specializes in the **MERN Stack**:\n\n• **Frontend:** React.js, JavaScript (ES6+), Tailwind CSS, Three.js WebGL, and Responsive UI design.\n• **Backend:** Node.js, Express.js, RESTful API architecture, and custom middleware.\n• **Database:** MongoDB & Mongoose ODM (data modeling, schema validation, indexing).\n• **Tools:** Git, GitHub, VS Code, and Postman.\n\nHe is ready to contribute across the entire web stack from day one!",
      suggestions: ["Tell me about his projects", "What is his work experience?", "Is he available immediately?"],
    };
  }

  if (q.includes("project") || q.includes("library") || q.includes("shop") || q.includes("bank") || q.includes("whiteboard")) {
    return {
      reply: "Priyadarshan has developed 3 standout projects with live simulators on this portfolio:\n\n1. **Library Management System (MERN Stack):** Full CRUD for book issue/return, member accounts, search, and automated fine calculation.\n2. **Online Shopping Website:** Responsive e-commerce store with dynamic catalog filtering, cart state, and checkout simulation.\n3. **Banking Website Simulation:** Retail banking dashboard with transfer validation and debit card freeze toggles.\n\nYou can test all 3 interactive simulators in the **Projects** section!",
      suggestions: ["How can I contact him?", "What are his certifications?", "Tell me about his education"],
    };
  }

  if (q.includes("experience") || q.includes("intern") || q.includes("work") || q.includes("company") || q.includes("evatril") || q.includes("vidyavistara")) {
    return {
      reply: "Priyadarshan is currently a **Full Stack Developer Intern at Evatril Private Limited** (September 2026 – Present) in Bhubaneswar, where he was selected into the Tech Team and builds production web modules across client and server layers. He previously completed a **MERN Stack Developer Internship at Vidyavistara Institute** (January 2026 – August 2026), developing full-stack features with React, Node/Express REST APIs, and MongoDB while collaborating via Git in Agile cycles.",
      suggestions: ["What are his top skills?", "View his education", "Schedule an interview"],
    };
  }

  if (q.includes("education") || q.includes("college") || q.includes("degree") || q.includes("btech") || q.includes("cgpa")) {
    return {
      reply: "Priyadarshan is pursuing his **B.Tech in Computer Science** at **NM Institute of Engineering and Technology**, Bhubaneswar (2023 – 2027), holding a solid **CGPA of 7.85** (up to 6th semester). Prior to this, he completed his 12th Science at Godavarish Higher Secondary School (65%).",
      suggestions: ["What projects has he built?", "What are his certifications?", "Is he an immediate joiner?"],
    };
  }

  if (q.includes("hire") || q.includes("contact") || q.includes("interview") || q.includes("email") || q.includes("phone") || q.includes("available") || q.includes("join") || q.includes("location") || q.includes("relocat")) {
    return {
      reply: "⚡ **Immediate Joiner:** Priyadarshan is actively available for **Junior / Fresher Full Stack Developer** roles!\n\n• **Email:** [priyadrshanbaral@gmail.com](mailto:priyadrshanbaral@gmail.com)\n• **Phone:** +91 89840 54385\n• **Location:** Bhubaneswar, Odisha (Open to remote, hybrid, or relocation across India)\n\nYou can also submit an inquiry directly using the form in the **Contact** section below!",
      suggestions: ["What is his tech stack?", "Tell me about his internship", "Download his resume"],
    };
  }

  if (q.includes("certif") || q.includes("course") || q.includes("diploma")) {
    return {
      reply: "Priyadarshan holds multiple industry certifications:\n\n• **Web Development Certification** — Vidyavistara Institute\n• **Artificial Intelligence** — IBM SkillsBuild\n• **AI Tools Workshop** — be10X\n• **DSA & MERN Workshop** — MyAnatomy",
      suggestions: ["What are his core skills?", "Tell me about his projects", "How to get in touch?"],
    };
  }

  return {
    reply: `Hello! I am Priyadarshan's AI Portfolio Concierge. Priyadarshan Baral is a passionate **MERN Stack Full Stack Developer** with hands-on internship experience, strong foundations in React, Node, Express, MongoDB, and 3 full-stack projects. He is an **immediate joiner** open for full-time opportunities. How can I help you learn more about his background today?`,
    suggestions: ["Why should we hire him?", "What are his key skills?", "Tell me about his projects", "Is he available immediately?"],
  };
}

app.post("/api/assistant/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, error: "Message string is required" });
    }

    const ai = getGenAI();
    if (ai) {
      // Format history for Gemini generateContent
      const contents: any[] = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item.role === "user" || item.role === "model") {
            contents.push({
              role: item.role,
              parts: [{ text: item.text }],
            });
          }
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      // Try primary model: gemini-3.8-flash, fallback to gemini-3.1-flash-lite
      const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];

      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: ASSISTANT_SYSTEM_PROMPT,
              temperature: 0.7,
              topP: 0.95,
            },
          });

          const replyText = response.text || "";
          if (replyText.trim().length > 0) {
            const lower = message.toLowerCase();
            let suggestions = ["Tell me about his projects", "What are his key skills?", "Is he available immediately?"];
            if (lower.includes("project")) {
              suggestions = ["What are his frontend skills?", "Can I schedule an interview?", "Tell me about his internship"];
            } else if (lower.includes("skill") || lower.includes("tech")) {
              suggestions = ["Show me his projects", "Where does he study?", "How can I contact him?"];
            } else if (lower.includes("contact") || lower.includes("hire")) {
              suggestions = ["What is his notice period?", "What is his preferred role?", "View his certifications"];
            } else if (lower.includes("fit") || lower.includes("why")) {
              suggestions = ["What are his interview questions?", "Tell me about his experience", "Contact Priyadarshan"];
            }

            return res.json({
              success: true,
              reply: replyText,
              suggestions,
              engine: modelName,
            });
          }
        } catch (modelErr: any) {
          console.warn(`[Gemini API Warning] Model ${modelName} failed:`, modelErr?.message || modelErr);
          // Loop will attempt next model or fall through to contextual engine
        }
      }
    }

    // Contextual fallback responder
    const fallback = getContextualFallback(message);
    return res.json({
      success: true,
      reply: fallback.reply,
      suggestions: fallback.suggestions,
      engine: "knowledge-engine",
    });
  } catch (err: any) {
    console.error("[Assistant Error]", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to process assistant request",
    });
  }
});

// 3. Receive & Save Contact Form Submission + Send Email
app.post("/api/contact", async (req, res) => {
  try {
    const { senderName, senderEmail, company, roleType, message } = req.body;

    if (!senderName || !senderEmail || !message) {
      return res.status(400).json({
        success: false,
        error: "senderName, senderEmail, and message are required fields.",
      });
    }

    let emailSent = false;
    let emailStatusMessage = "";

    // Attempt direct SMTP dispatch if SMTP is configured
    const transporter = getMailTransporter();
    const recipient = "priyadrshanbaral@gmail.com";

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Portfolio Recruiter - ${senderName}" <${process.env.SMTP_USER}>`,
          to: recipient,
          replyTo: senderEmail,
          subject: `[New Inquiry] ${roleType} - ${company || senderName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #059669; color: white; padding: 20px;">
                <h2 style="margin: 0; font-size: 20px;">New Inquiry Received for Priyadarshan Baral</h2>
                <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;">Role Target: ${roleType}</p>
              </div>
              <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
                <p><strong>From:</strong> ${senderName} (<a href="mailto:${senderEmail}">${senderEmail}</a>)</p>
                <p><strong>Company / Organization:</strong> ${company || "Not provided"}</p>
                <p><strong>Opportunity Type:</strong> ${roleType}</p>
                <div style="background-color: #f8fafc; border-left: 4px solid #059669; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
                  <strong style="display: block; margin-bottom: 8px; color: #0f172a;">Message:</strong>
                  <div style="white-space: pre-wrap; font-size: 14px; color: #334155;">${message}</div>
                </div>
                <div style="margin-top: 24px;">
                  <a href="mailto:${senderEmail}?subject=Re: Opportunity at ${company || 'your team'}" style="background-color: #059669; color: white; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Reply Directly to ${senderName}</a>
                </div>
              </div>
            </div>
          `,
        });
        emailSent = true;
        emailStatusMessage = "Email delivered directly via SMTP to priyadrshanbaral@gmail.com";
      } catch (mailErr: any) {
        console.error("[Mail Error]", mailErr);
        emailStatusMessage = `SMTP send failed (${mailErr.message}), falling back to direct web dispatch.`;
      }
    }

    // Direct Web to Email Dispatch via FormSubmit service if SMTP was unavailable
    let needsActivation = false;
    if (!emailSent) {
      try {
        const formSubmitRes = await fetch("https://formsubmit.co/ajax/priyadrshanbaral@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Origin: "https://portfolio.priyadarshan.dev",
            Referer: "https://portfolio.priyadarshan.dev",
          },
          body: JSON.stringify({
            name: senderName,
            email: senderEmail,
            company: company || "Not specified",
            role: roleType,
            message: message,
            _subject: `[Portfolio Inquiry] ${roleType} from ${senderName} (${company || "Candidate Inquiry"})`,
            _replyto: senderEmail,
            _template: "table",
            _captcha: "false",
          }),
        });

        if (formSubmitRes.ok) {
          const fsData = await formSubmitRes.json();
          if (fsData.success === "true" || fsData.success === true) {
            emailSent = true;
            emailStatusMessage = "Dispatched directly to priyadrshanbaral@gmail.com via FormSubmit.";
          } else if (fsData.message && fsData.message.toLowerCase().includes("activation")) {
            needsActivation = true;
            emailStatusMessage = "FormSubmit sent an 'Activate Form' confirmation email to priyadrshanbaral@gmail.com. Please click the activation link in your Gmail once to enable automated background delivery.";
            console.log("[FormSubmit Notice]", emailStatusMessage);
          } else {
            emailStatusMessage = fsData.message || "FormSubmit processing.";
          }
        }
      } catch (fsErr: any) {
        console.warn("[FormSubmit Warning]", fsErr?.message || fsErr);
      }
    }

    if (!emailStatusMessage) {
      emailStatusMessage = "Inquiry recorded in portfolio inbox. Ready for 1-click direct dispatch via Gmail.";
    }

    const newRecord = {
      senderName,
      senderEmail,
      company: company || "",
      roleType,
      message,
      emailSent,
      emailError: emailStatusMessage,
      ip: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
      createdAt: new Date(),
    };

    // Save into MongoDB
    let savedToMongo = false;
    let savedDoc: any = null;

    if (mongoose.connection.readyState === 1) {
      try {
        savedDoc = await Inquiry.create(newRecord);
        savedToMongo = true;
        console.log(`[MongoDB] Successfully saved inquiry from ${senderName}`);
      } catch (dbErr: any) {
        console.error("[MongoDB Save Error]", dbErr);
        fallbackStorage.push({ ...newRecord, _id: `fallback-${Date.now()}` });
      }
    } else {
      // Keep in memory fallback
      fallbackStorage.push({ ...newRecord, _id: `fallback-${Date.now()}` });
      console.log(`[Cache Storage] Stored inquiry in memory fallback (${fallbackStorage.length} items)`);
    }

    // Build the 100% reliable direct mail links so recruiters can also send directly from their mailboxes
    const mailtoSubject = encodeURIComponent(`[Job Opportunity] ${roleType} - ${company || senderName}`);
    const mailtoBody = encodeURIComponent(
      `Hello Priyadarshan,\n\n${message}\n\nCandidate / Recruiter Details:\n- Name: ${senderName}\n- Email: ${senderEmail}\n- Company: ${company || "Not Specified"}\n- Role: ${roleType}\n\nBest regards,\n${senderName}`
    );
    const directMailtoUrl = `mailto:${recipient}?subject=${mailtoSubject}&body=${mailtoBody}`;
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${mailtoSubject}&body=${mailtoBody}`;

    return res.status(201).json({
      success: true,
      savedToMongo,
      storage: savedToMongo ? "mongodb" : "memory_cache",
      emailSent,
      needsActivation,
      emailStatusMessage,
      targetEmail: recipient,
      directMailtoUrl,
      gmailComposeUrl,
      record: savedDoc || newRecord,
      message: "Inquiry successfully recorded and prepared for direct delivery to priyadrshanbaral@gmail.com!",
    });
  } catch (err: any) {
    console.error("[API Error /api/contact]", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to process inquiry",
    });
  }
});

// -------------------------------------------------------------
// Vite Middleware & SPA Static Serving
// -------------------------------------------------------------
// On Vercel the Express app is imported as a serverless function, so we must
// NOT call app.listen() or boot the Vite dev middleware there.
const isServerless = Boolean(process.env.VERCEL);

async function startServer() {
  if (isServerless) {
    // Vercel's Node runtime serves the built static assets itself and
    // forwards every request to this exported app.
    console.log("[Vercel] Express app exported as a serverless function.");
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express + Vite] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

// Vercel serverless entrypoint — the platform imports this module and
// invokes the exported handler for every incoming request.
export default app;
