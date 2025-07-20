# Frontend Files

## Main App Structure

### `client/src/App.tsx`
```tsx
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SimpleDashboard from "@/pages/simple-dashboard";
import Participant from "@/pages/participant";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SimpleDashboard} />
      <Route path="/participant" component={Participant} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
```

### `client/src/main.tsx`
```tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

### `client/src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Pages

### `client/src/pages/simple-dashboard.tsx`
```tsx
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Clock, Download } from "lucide-react";

export default function SimpleDashboard() {
  const { data: activeEvent } = useQuery({
    queryKey: ["/api/events/active"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/events", activeEvent?.id, "stats"],
    enabled: !!activeEvent?.id,
  });

  if (!activeEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold mb-2">No Active Event</h2>
            <p className="text-sm text-slate-600 mb-4">
              Create an event to start tracking engagement
            </p>
            <Button>Create Event</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">EngageTracker</h1>
          <p className="text-slate-600">Real-time engagement analytics for {activeEvent.name}</p>
          <div className="mt-2">
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              <div className="w-1.5 h-1.5 mr-1.5 bg-green-400 rounded-full animate-pulse"></div>
              Live Event Active
            </Badge>
          </div>
        </div>

        {/* Organizer Info */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div>
              <p className="font-medium text-slate-700">Khathija Shaik Chintakrindi</p>
              <p className="text-sm text-slate-500">Event Organizer</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Participants</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats?.totalParticipants || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-slate-600 ml-1">from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg. Engagement</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats?.avgEngagement ? parseFloat(stats.avgEngagement).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+5.2%</span>
                <span className="text-slate-600 ml-1">this session</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats?.activeSessions || 0}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-amber-600 font-medium">3 starting soon</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Resource Downloads</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats?.totalDownloads || 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-purple-600 font-medium">+18%</span>
                <span className="text-slate-600 ml-1">last hour</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button onClick={() => window.location.href = '/participant'} className="w-full justify-start">
                  View Participant Dashboard
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Create New Poll
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Export Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-600">Event Name</p>
                  <p className="text-slate-900">{activeEvent.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Description</p>
                  <p className="text-slate-900">{activeEvent.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Status</p>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

### `client/src/pages/participant.tsx`
```tsx
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  QrCode, 
  Download, 
  FileText, 
  ExternalLink,
  Trophy,
  Clock,
  Users
} from "lucide-react";

export default function Participant() {
  const { data: activeEvent } = useQuery({
    queryKey: ["/api/events/active"],
  });

  const { data: activeSessions } = useQuery({
    queryKey: ["/api/events", activeEvent?.id, "sessions/active"],
    enabled: !!activeEvent?.id,
  });

  const { data: resources } = useQuery({
    queryKey: ["/api/sessions", activeSessions?.[0]?.id, "resources"],
    enabled: !!activeSessions?.[0]?.id,
  });

  // Mock participant data - in real app this would come from user context
  const participantData = {
    score: 84,
    rank: 15,
    totalParticipants: 1247,
    sessions: 6,
    totalSessions: 8,
    polls: 12,
    totalPolls: 15,
    downloads: 8,
  };

  const handleCheckin = () => {
    // Implement checkin logic
    console.log('Checking in to session');
  };

  const handleDownload = (resourceId: number) => {
    // Implement download tracking
    console.log('Downloading resource:', resourceId);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Your Engagement Dashboard</h1>
          <p className="text-slate-600">Track your participation and engagement score</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Engagement Score Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Your Engagement Score</h3>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-24 h-24 rounded-full border-8 border-blue-200">
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{participantData.score}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Trophy className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-slate-600">
                    Rank: <span className="font-medium text-blue-600">#{participantData.rank}</span> of {participantData.totalParticipants}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Sessions</span>
                    <span className="font-medium">{participantData.sessions}/{participantData.totalSessions}</span>
                  </div>
                  <Progress value={(participantData.sessions / participantData.totalSessions) * 100} className="h-2" />
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Poll Participation</span>
                    <span className="font-medium">{participantData.polls}/{participantData.totalPolls}</span>
                  </div>
                  <Progress value={(participantData.polls / participantData.totalPolls) * 100} className="h-2" />
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Downloads</span>
                    <span className="font-medium">{participantData.downloads}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Check-in */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Quick Check-in
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="text-xs text-slate-500 mt-1">QR Code</p>
                  </div>
                </div>
                <Button onClick={handleCheckin} className="w-full bg-green-600 hover:bg-green-700">
                  Check into Current Session
                </Button>
                {activeSessions?.[1] && (
                  <p className="text-xs text-slate-500">
                    Next: {activeSessions[1].title} in 15 min
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Available Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Session Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resources?.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                    <div className="flex items-center space-x-3">
                      {resource.type === 'file' ? (
                        <FileText className="h-5 w-5 text-red-500" />
                      ) : resource.type === 'link' ? (
                        <ExternalLink className="h-5 w-5 text-blue-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-slate-700">{resource.name}</p>
                        {resource.fileSize && (
                          <p className="text-xs text-slate-500">{resource.fileSize}</p>
                        )}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-blue-600 hover:text-blue-700"
                      onClick={() => handleDownload(resource.id)}
                    >
                      {resource.type === 'link' ? 'Visit' : 'Download'}
                    </Button>
                  </div>
                ))}
                
                {(!resources || resources.length === 0) && (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No resources available for current session
                  </p>
                )}
              </div>
              
              <Button variant="ghost" className="w-full mt-4">
                View All Resources
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Sessions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Current Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeSessions?.map((session) => (
                  <div key={session.id} className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-medium text-slate-900">{session.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{session.speaker}</p>
                    <p className="text-sm text-slate-600">{session.room}</p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant={session.isActive ? "default" : "secondary"}>
                        {session.isActive ? "Live" : "Upcoming"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

### `client/src/pages/not-found.tsx`
```tsx
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Hooks and Utilities

### `client/src/hooks/use-websocket.ts`
```tsx
import { useEffect, useRef } from "react";
import { queryClient } from "@/lib/queryClient";

export function useWebSocket(eventId?: number) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      // Join the event room
      ws.send(JSON.stringify({
        type: "join_event",
        eventId,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case "poll_created":
          case "poll_response":
            // Invalidate poll-related queries
            queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
            queryClient.invalidateQueries({ queryKey: ["/api/polls"] });
            break;
            
          case "question_submitted":
            // Invalidate questions queries
            queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
            break;
            
          case "checkin":
            // Invalidate stats and session queries
            queryClient.invalidateQueries({ queryKey: ["/api/events"] });
            break;
            
          case "participant_joined":
            // Invalidate participant queries
            queryClient.invalidateQueries({ queryKey: ["/api/events"] });
            break;
            
          default:
            console.log("Unknown WebSocket message type:", data.type);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [eventId]);

  return wsRef.current;
}
```

### `client/src/lib/queryClient.ts`
```tsx
import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
```

## HTML Template

### `client/index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EngageTracker - Student Engagement System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```
