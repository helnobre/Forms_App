import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertAssessmentSchema, insertResponseSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new user
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ message: "Invalid user data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create a new assessment
  app.post("/api/assessments", async (req, res) => {
    try {
      const assessmentData = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(assessmentData);
      res.json(assessment);
    } catch (error) {
      console.error("Error creating assessment:", error);
      res.status(400).json({ message: "Invalid assessment data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Update an existing assessment
  app.put("/api/assessments/:id", async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessmentData = insertAssessmentSchema.partial().parse(req.body);
      const assessment = await storage.updateAssessment(assessmentId, assessmentData);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      console.error("Error updating assessment:", error);
      res.status(400).json({ message: "Invalid assessment data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get assessment by ID
  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.getAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get assessments by user ID
  app.get("/api/users/:userId/assessments", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const assessments = await storage.getAssessmentsByUserId(userId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Complete an assessment
  app.post("/api/assessments/:id/complete", async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.completeAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      console.error("Error completing assessment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Dynamic questions API routes
  
  // Get questions by section
  app.get("/api/questions/section/:section", async (req, res) => {
    try {
      const section = req.params.section;
      const questions = await storage.getQuestionsBySection(section);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all questions
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Submit/update response
  app.post("/api/responses", async (req, res) => {
    try {
      const { userId, questionId, answer } = req.body;
      const response = await storage.updateResponse(userId, questionId, answer);
      res.json(response);
    } catch (error) {
      console.error("Error saving response:", error);
      res.status(400).json({ message: "Invalid response data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get responses by user ID
  app.get("/api/users/:userId/responses", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const responses = await storage.getResponsesByUserId(userId);
      res.json(responses);
    } catch (error) {
      console.error("Error fetching responses:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin: Get all responses grouped by user
  app.get("/api/admin/responses", async (req, res) => {
    try {
      const data = await storage.getAllResponsesGroupedByUser();
      res.json(data);
    } catch (error) {
      console.error("Error fetching admin responses:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // File upload endpoint
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { userId, questionId } = req.body;
      
      // Save file info to database
      const fileData = await storage.saveFile({
        userId: parseInt(userId),
        questionId: questionId ? parseInt(questionId) : null,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        filePath: req.file.path,
      });

      // Also save as response if questionId is provided
      if (questionId) {
        await storage.updateResponse(parseInt(userId), parseInt(questionId), req.file.originalname);
      }

      res.json({ 
        message: "File uploaded successfully", 
        file: fileData,
        fileName: req.file.originalname 
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "File upload failed", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
