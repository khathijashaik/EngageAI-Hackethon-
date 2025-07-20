import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertEventSchema, insertSessionSchema, insertPollSchema, insertQuestionSchema, insertResourceSchema } from "@shared/schema";

interface WebSocketClient extends WebSocket {
  eventId?: number;
  participantId?: number;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocketClient>();

  wss.on('connection', (ws: WebSocketClient) => {
    console.log('WebSocket client connected');
    clients.add(ws);

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'join_event') {
          ws.eventId = data.eventId;
          ws.participantId = data.participantId;
          console.log(`Client joined event ${data.eventId}`);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });
  });

  function broadcastToEvent(eventId: number, data: any) {
    clients.forEach(client => {
      if (client.eventId === eventId && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  // Events API
  app.get('/api/events/active', async (req, res) => {
    try {
      const event = await storage.getActiveEvent();
      if (!event) {
        return res.status(404).json({ message: 'No active event found' });
      }
      res.json
