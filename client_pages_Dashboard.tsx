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
