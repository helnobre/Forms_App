import { users, assessments, type User, type InsertUser, type Assessment, type InsertAssessment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  createAssessment(insertAssessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: number, data: Partial<InsertAssessment>): Promise<Assessment | undefined>;
  getAssessmentsByUserId(userId: number): Promise<Assessment[]>;
  completeAssessment(id: number): Promise<Assessment | undefined>;
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
}

export const storage = new DatabaseStorage();