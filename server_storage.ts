import {
  users, events, sessions, participants, sessionCheckins, polls, pollResponses,
  questions, resources, resourceDownloads, questionUpvotes,
  type User, type Event, type Session, type Participant, type Poll, type Question, type Resource,
  type InsertUser, type InsertEvent, type InsertSession, type InsertParticipant,
  type InsertPoll, type InsertQuestion, type InsertResource
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, count, sum } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Event operations
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  getActiveEvent(): Promise<Event | undefined>;

  // Session operations
  getSessions(eventId: number): Promise<Session[]>;
  getSession(id: number): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: number, updates: Partial<Session>): Promise<Session>;
  getActiveSessions(eventId: number): Promise<Session[]>;

  // Participant operations
  getParticipants(eventId: number): Promise<(Participant & { user: User })[]>;
  getParticipant(userId: number, eventId: number): Promise<Participant | undefined>;
  createParticipant(participant: InsertParticipant): Promise<Participant>;
  updateEngagementScore(participantId: number, score: number): Promise<void>;
  getTopEngagers(eventId: number, limit?: number): Promise<(Participant & { user: User })[]>;

  // Poll operations
  getPolls(sessionId: number): Promise<Poll[]>;
  createPoll(poll: InsertPoll): Promise<Poll>;
  endPoll(pollId: number): Promise<void>;
  getActivePoll(sessionId: number): Promise<Poll | undefined>;
  submitPollResponse(pollId: number, participantId: number, selectedOption: number): Promise<void>;
  getPollResults(pollId: number): Promise<any>;

  // Analytics
  getEventStats(eventId: number): Promise<{
    totalParticipants: number;
    avgEngagement: number;
    activeSessions: number;
    totalDownloads: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(desc(events.createdAt));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(eventData).returning();
    return event;
  }

  async getActiveEvent(): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.isActive, true)).limit(1);
    return event;
  }

  async getSessions(eventId: number): Promise<Session[]> {
    return db.select().from(sessions).where(eq(sessions.eventId, eventId)).orderBy(sessions.startTime);
  }

  async getSession(id: number): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session;
  }

  async createSession(sessionData: InsertSession): Promise<Session> {
    const [session] = await db.insert(sessions).values(sessionData).returning();
    return session;
  }

  async updateSession(id: number, updates: Partial<Session>): Promise<Session> {
    const [session] = await db.update(sessions).set(updates).where(eq(sessions.id, id)).returning();
    return session;
  }

  async getActiveSessions(eventId: number): Promise<Session[]> {
    return db.select().from(sessions)
      .where(and(eq(sessions.eventId, eventId), eq(sessions.isActive, true)))
      .orderBy(sessions.startTime);
  }

  async getParticipants(eventId: number): Promise<(Participant & { user: User })[]> {
    return db.select()
      .from(participants)
      .innerJoin(users, eq(participants.userId, users.id))
      .where(eq(participants.eventId, eventId))
      .then(rows => rows.map(row => ({ ...row.participants, user: row.users })));
  }

  async getParticipant(userId: number, eventId: number): Promise<Participant | undefined> {
    const [participant] = await db.select().from(participants)
      .where(and(eq(participants.userId, userId), eq(participants.eventId, eventId)));
    return participant;
  }

  async createParticipant(participantData: InsertParticipant): Promise<Participant> {
    const [participant] = await db.insert(participants).values(participantData).returning();
    return participant;
  }

  async updateEngagementScore(participantId: number, score: number): Promise<void> {
    await db.update(participants)
      .set({ engagementScore: score.toString() })
      .where(eq(participants.id, participantId));
  }

  async getTopEngagers(eventId: number, limit = 10): Promise<(Participant & { user: User })[]> {
    return db.select()
      .from(participants)
      .innerJoin(users, eq(participants.userId, users.id))
      .where(eq(participants.eventId, eventId))
      .orderBy(desc(participants.engagementScore))
      .limit(limit)
      .then(rows => rows.map(row => ({ ...row.participants, user: row.users })));
  }

  async getPolls(sessionId: number): Promise<Poll[]> {
    return db.select().from(polls)
      .where(eq(polls.sessionId, sessionId))
      .orderBy(desc(polls.createdAt));
  }

  async createPoll(pollData: InsertPoll): Promise<Poll> {
    const [poll] = await db.insert(polls).values(pollData).returning();
    return poll;
  }

  async endPoll(pollId: number): Promise<void> {
    await db.update(polls)
      .set({ isActive: false, endedAt: new Date() })
      .where(eq(polls.id, pollId));
  }

  async getActivePoll(sessionId: number): Promise<Poll | undefined> {
    const [poll] = await db.select().from(polls)
      .where(and(eq(polls.sessionId, sessionId), eq(polls.isActive, true)))
      .limit(1);
    return poll;
  }

  async submitPollResponse(pollId: number, participantId: number, selectedOption: number): Promise<void> {
    await db.insert(pollResponses).values({
      pollId,
      participantId,
      selectedOption,
    });
  }

  async getPollResults(pollId: number): Promise<any> {
    const results = await db.select({
      selectedOption: pollResponses.selectedOption,
      count: count()
    })
    .from(pollResponses)
    .where(eq(pollResponses.pollId, pollId))
    .groupBy(pollResponses.selectedOption);

    const totalResponses = results.reduce((sum, result) => sum + result.count, 0);
    
    return {
      totalResponses,
      options: results.map(result => ({
        option: result.selectedOption,
        count: result.count,
        percentage: totalResponses > 0 ? (result.count / totalResponses) * 100 : 0
      }))
    };
  }

  async getEventStats(eventId: number): Promise<{
    totalParticipants: number;
    avgEngagement: number;
    activeSessions: number;
    totalDownloads: number;
  }> {
    const [participantCount] = await db.select({ count: count() })
      .from(participants)
      .where(eq(participants.eventId, eventId));

    const [avgEngagement] = await db.select({ 
      avg: sql<number>`avg(cast(${participants.engagementScore} as decimal))` 
    })
      .from(participants)
      .where(eq(participants.eventId, eventId));

    const [activeSessionCount] = await db.select({ count: count() })
      .from(sessions)
      .where(and(eq(sessions.eventId, eventId), eq(sessions.isActive, true)));

    const [downloadCount] = await db.select({ count: count() })
      .from(resourceDownloads)
      .innerJoin(resources, eq(resourceDownloads.resourceId, resources.id))
      .innerJoin(sessions, eq(resources.sessionId, sessions.id))
      .where(eq(sessions.eventId, eventId));

    return {
      totalParticipants: participantCount.count,
      avgEngagement: avgEngagement.avg || 0,
      activeSessions: activeSessionCount.count,
      totalDownloads: downloadCount.count,
    };
  }
}

export const storage = new DatabaseStorage();
