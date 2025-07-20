import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role").notNull().default("participant"), // "organizer" or "participant"
  createdAt: timestamp("created_at").defaultNow(),
});

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  organizerId: integer("organizer_id").references(() => users.id).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sessions table
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  speaker: text("speaker"),
  room: text("room"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  maxCapacity: integer("max_capacity"),
  isActive: boolean("is_active").default(false),
  qrCode: text("qr_code"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Participants table (event registrations)
export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
  engagementScore: decimal("engagement_score", { precision: 5, scale: 2 }).default("0"),
});

// Session check-ins
export const sessionCheckins = pgTable("session_checkins", {
  id: serial("id").primaryKey(),
  participantId: integer("participant_id").references(() => participants.id).notNull(),
  sessionId: integer("session_id").references(() => sessions.id).notNull(),
  checkinTime: timestamp("checkin_time").defaultNow(),
  checkoutTime: timestamp("checkout_time"),
});

// Polls table
export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => sessions.id).notNull(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // Array of poll options
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  endedAt: timestamp("ended_at"),
});

// Poll responses
export const pollResponses = pgTable("poll_responses", {
  id: serial("id").primaryKey(),
  pollId: integer("poll_id").references(() => polls.id).notNull(),
  participantId: integer("participant_id").references(() => participants.id).notNull(),
  selectedOption: integer("selected_option").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Q&A questions
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => sessions.id).notNull(),
  participantId: integer("participant_id").references(() => participants.id).notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  upvotes: integer("upvotes").default(0),
  isAnswered: boolean("is_answered").default(false),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  answeredAt: timestamp("answered_at"),
});

// Resources table
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => sessions.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "file", "link", "video"
  url: text("url").notNull(),
  fileSize: text("file_size"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Resource downloads tracking
export const resourceDownloads = pgTable("resource_downloads", {
  id: serial("id").primaryKey(),
  resourceId: integer("resource_id").references(() => resources.id).notNull(),
  participantId: integer("participant_id").references(() => participants.id).notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow(),
});

// Question upvotes
export const questionUpvotes = pgTable("question_upvotes", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  participantId: integer("participant_id").references(() => participants.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true, createdAt: true });
export const insertParticipantSchema = createInsertSchema(participants).omit({ id: true, registeredAt: true });
export const insertPollSchema = createInsertSchema(polls).omit({ id: true, createdAt: true, endedAt: true });
export const insertQuestionSchema = createInsertSchema(questions).omit({ id: true, createdAt: true, answeredAt: true });
export const insertResourceSchema = createInsertSchema(resources).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Participant = typeof participants.$inferSelect;
export type Poll = typeof polls.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Resource = typeof resources.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type InsertPoll = z.infer<typeof insertPollSchema>;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type InsertResource = z.infer<typeof insertResourceSchema>;
