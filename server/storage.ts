import { 
  users, assessments, questions, options, responses, assessmentFiles,
  type User, type InsertUser, type Assessment, type InsertAssessment,
  type Question, type InsertQuestion, type Option, type InsertOption,
  type Response, type InsertResponse, type AssessmentFile, type InsertAssessmentFile
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  createAssessment(insertAssessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: number, data: Partial<InsertAssessment>): Promise<Assessment | undefined>;
  getAssessmentsByUserId(userId: number): Promise<Assessment[]>;
  completeAssessment(id: number): Promise<Assessment | undefined>;

  // Dynamic questions system
  getQuestionsBySection(section: string): Promise<(Question & { options: Option[] })[]>;
  getAllQuestions(): Promise<(Question & { options: Option[] })[]>;
  createResponse(insertResponse: InsertResponse): Promise<Response>;
  updateResponse(userId: number, questionId: number, answer: string): Promise<Response | undefined>;
  getResponsesByUserId(userId: number): Promise<(Response & { question: Question })[]>;
  getAllResponsesGroupedByUser(): Promise<{ user: User; responses: (Response & { question: Question })[]; assessments: Assessment[] }[]>;
  saveFile(insertFile: InsertAssessmentFile): Promise<AssessmentFile>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment || undefined;
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const [assessment] = await db
      .insert(assessments)
      .values(insertAssessment)
      .returning();
    return assessment;
  }

  async updateAssessment(id: number, data: Partial<InsertAssessment>): Promise<Assessment | undefined> {
    const [assessment] = await db
      .update(assessments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(assessments.id, id))
      .returning();
    return assessment || undefined;
  }

  async getAssessmentsByUserId(userId: number): Promise<Assessment[]> {
    return await db.select().from(assessments).where(eq(assessments.userId, userId));
  }

  async completeAssessment(id: number): Promise<Assessment | undefined> {
    const [assessment] = await db
      .update(assessments)
      .set({ 
        isCompleted: true, 
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(assessments.id, id))
      .returning();
    return assessment || undefined;
  }

  async getQuestionsBySection(section: string): Promise<(Question & { options: Option[] })[]> {
    const questionsData = await db
      .select()
      .from(questions)
      .where(eq(questions.section, section))
      .orderBy(asc(questions.order));

    const questionsWithOptions = await Promise.all(
      questionsData.map(async (question) => {
        const optionsData = await db
          .select()
          .from(options)
          .where(eq(options.questionId, question.id))
          .orderBy(asc(options.order));

        return { ...question, options: optionsData };
      })
    );

    return questionsWithOptions;
  }

  async getAllQuestions(): Promise<(Question & { options: Option[] })[]> {
    const questionsData = await db
      .select()
      .from(questions)
      .orderBy(asc(questions.section), asc(questions.order));

    const questionsWithOptions = await Promise.all(
      questionsData.map(async (question) => {
        const optionsData = await db
          .select()
          .from(options)
          .where(eq(options.questionId, question.id))
          .orderBy(asc(options.order));

        return { ...question, options: optionsData };
      })
    );

    return questionsWithOptions;
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const [response] = await db
      .insert(responses)
      .values(insertResponse)
      .returning();
    return response;
  }

  async updateResponse(userId: number, questionId: number, answer: string): Promise<Response | undefined> {
    // Check if response exists
    const [existingResponse] = await db
      .select()
      .from(responses)
      .where(and(
        eq(responses.userId, userId),
        eq(responses.questionId, questionId)
      ));

    if (existingResponse) {
      // Update existing response
      const [updatedResponse] = await db
        .update(responses)
        .set({ answer, updatedAt: new Date() })
        .where(and(
          eq(responses.userId, userId),
          eq(responses.questionId, questionId)
        ))
        .returning();
      return updatedResponse || undefined;
    } else {
      // Create new response
      const newResponse = await this.createResponse({ userId, questionId, answer });
      return newResponse;
    }
  }

  async getResponsesByUserId(userId: number): Promise<(Response & { question: Question })[]> {
    const responsesData = await db
      .select({
        response: responses,
        question: questions,
      })
      .from(responses)
      .innerJoin(questions, eq(responses.questionId, questions.id))
      .where(eq(responses.userId, userId))
      .orderBy(asc(questions.section), asc(questions.order));

    return responsesData.map(({ response, question }) => ({
      ...response,
      question,
    }));
  }

  async getAllResponsesGroupedByUser(): Promise<{ user: User; responses: (Response & { question: Question })[]; assessments: Assessment[] }[]> {
    // Get all users first
    const allUsers = await db.select().from(users).orderBy(asc(users.id));

    // Get all responses with questions
    const responsesResult = await db.select({
      response: {
        id: responses.id,
        userId: responses.userId,
        questionId: responses.questionId,
        answer: responses.answer,
        createdAt: responses.createdAt,
        updatedAt: responses.updatedAt,
      },
      question: {
        id: questions.id,
        text: questions.text,
        type: questions.type,
        section: questions.section,
        order: questions.order,
      }
    })
    .from(responses)
    .innerJoin(questions, eq(responses.questionId, questions.id))
    .orderBy(asc(responses.userId), asc(questions.order));

    // Get all assessments
    const assessmentResult = await db.select()
      .from(assessments)
      .orderBy(asc(assessments.userId));

    // Group by user
    const grouped: { [userId: number]: any } = {};

    // Initialize all users
    allUsers.forEach(user => {
      grouped[user.id] = {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          company: user.company,
          position: user.position,
          phone: user.phone,
          employeeCount: user.employeeCount,
          createdAt: user.createdAt,
        },
        responses: [],
        assessments: []
      };
    });

    // Add responses
    responsesResult.forEach(row => {
      if (grouped[row.response.userId]) {
        grouped[row.response.userId].responses.push({
          ...row.response,
          question: row.question
        });
      }
    });

    // Add assessments
    assessmentResult.forEach(assessment => {
      if (grouped[assessment.userId]) {
        grouped[assessment.userId].assessments.push(assessment);
      }
    });

    // Return only users who have either responses or assessments
    return Object.values(grouped).filter((userData: any) => 
      userData.responses.length > 0 || userData.assessments.length > 0
    );
  }

  async saveFile(insertFile: InsertAssessmentFile): Promise<AssessmentFile> {
    const [file] = await db
      .insert(assessmentFiles)
      .values(insertFile)
      .returning();
    return file;
  }
}

export const storage = new DatabaseStorage();