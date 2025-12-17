import { users, clients, type User, type InsertUser, type Client, type InsertClient } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(options?: {
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ users: User[]; total: number }>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Client methods
  getClients(options?: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ clients: Client[]; total: number }>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient, createdBy: number): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  clearClients(): Promise<void>;
  
  // Admin statistics
  getAdminStats(): Promise<{
    totalUsers: number;
    totalClients: number;
    newClientsLast7Days: number;
    activeClients: number;
  }>;
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

  async getClients(options: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ clients: Client[]; total: number }> {
    const { search, status, limit = 10, offset = 0, sortBy = 'registrationDate', sortOrder = 'desc' } = options;
    
    let query = db.select().from(clients);
    let countQuery = db.select({ count: clients.id }).from(clients);
    
    const conditions = [];
    
    if (search) {
      const searchCondition = or(
        ilike(clients.firstName, `%${search}%`),
        ilike(clients.lastName, `%${search}%`),
        ilike(clients.email, `%${search}%`)
      );
      conditions.push(searchCondition);
    }
    
    if (status) {
      conditions.push(eq(clients.status, status as any));
    }
    
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : or(...conditions));
      countQuery = countQuery.where(conditions.length === 1 ? conditions[0] : or(...conditions));
    }
    
    // Apply sorting
    const sortColumn = sortBy === 'name' ? clients.firstName : 
                      sortBy === 'email' ? clients.email :
                      sortBy === 'status' ? clients.status :
                      clients.registrationDate;
    
    query = query.orderBy(sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn));
    
    // Apply pagination
    query = query.limit(limit).offset(offset);
    
    const [clientResults, countResults] = await Promise.all([
      query,
      countQuery
    ]);
    
    return {
      clients: clientResults,
      total: countResults.length
    };
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient, createdBy: number): Promise<Client> {
    const [client] = await db
      .insert(clients)
      .values({ ...insertClient, createdBy })
      .returning();
    return client;
  }

  async updateClient(id: number, updateClient: Partial<InsertClient>): Promise<Client | undefined> {
    const [client] = await db
      .update(clients)
      .set(updateClient)
      .where(eq(clients.id, id))
      .returning();
    return client || undefined;
  }

  async deleteClient(id: number): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUsers(options: {
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ users: User[]; total: number }> {
    const { search, limit = 10, offset = 0, sortBy = 'createdAt', sortOrder = 'desc' } = options;

    let query = db.select().from(users);
    let countQuery = db.select({ count: users.id }).from(users);

    // Apply search filter
    if (search) {
      const searchFilter = or(
        ilike(users.firstName, `%${search}%`),
        ilike(users.lastName, `%${search}%`),
        ilike(users.email, `%${search}%`)
      );
      query = query.where(searchFilter);
      countQuery = countQuery.where(searchFilter);
    }

    // Apply sorting
    const sortColumn = users[sortBy as keyof typeof users] || users.createdAt;
    query = query.orderBy(sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn));

    // Apply pagination
    query = query.limit(limit).offset(offset);

    // Execute queries
    const [userResults, countResults] = await Promise.all([
      query,
      countQuery
    ]);

    return {
      users: userResults,
      total: countResults.length
    };
  }

  async updateUser(id: number, updateUser: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updateUser)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAdminStats(): Promise<{
    totalUsers: number;
    totalClients: number;
    newClientsLast7Days: number;
    activeClients: number;
  }> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalUsersResult,
      totalClientsResult,
      newClientsResult,
      activeClientsResult
    ] = await Promise.all([
      db.select({ count: users.id }).from(users),
      db.select({ count: clients.id }).from(clients),
      db.select({ count: clients.id }).from(clients).where(eq(clients.registrationDate, sevenDaysAgo)),
      db.select({ count: clients.id }).from(clients).where(eq(clients.status, 'active'))
    ]);

    return {
      totalUsers: totalUsersResult.length,
      totalClients: totalClientsResult.length,
      newClientsLast7Days: newClientsResult.length,
      activeClients: activeClientsResult.length
    };
  }

  async clearClients(): Promise<void> {
    await db.delete(clients);
  }
}

export const storage = new DatabaseStorage();
