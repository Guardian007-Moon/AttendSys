'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loadAttendance } from '@/lib/mock-data';
import { useMemo } from 'react';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = {
  Present: '#22c55e', // green-500
  Late: '#f59e0b',    // amber-500
  Absent: '#ef4444',  // red-500
};

export default function AnalyticsDashboard({ students, sessions }) {
  const attendanceData = useMemo(() => {
    if (!sessions.length || !students.length) return [];
    
    const allAttendance = loadAttendance();

    return sessions.map(session => {
      const sessionAttendance = allAttendance[session.id] || {};
      const present = Object.values(sessionAttendance).filter(a => a.status === 'Present').length;
      const late = Object.values(sessionAttendance).filter(a => a.status === 'Late').length;
      const totalAttended = present + late;
      const attendancePercentage = (totalAttended / students.length) * 100;
      
      return {
        name: session.name,
        date: new Date(session.date).toLocaleDateString(),
        attendance: parseFloat(attendancePercentage.toFixed(2)),
      };
    }).sort((a,b) => new Date(a.date) - new Date(b.date));
  }, [sessions, students]);

  const overallAttendance = useMemo(() => {
    if (!sessions.length || !students.length) return { present: 0, late: 0, absent: 0 };
    
    const allAttendance = loadAttendance();
    let totalPresent = 0;
    let totalLate = 0;
    
    sessions.forEach(session => {
      const sessionAttendance = allAttendance[session.id] || {};
      totalPresent += Object.values(sessionAttendance).filter(a => a.status === 'Present').length;
      totalLate += Object.values(sessionAttendance).filter(a => a.status === 'Late').length;
    });

    const totalPossibleAttendances = sessions.length * students.length;
    const totalAbsent = totalPossibleAttendances - totalPresent - totalLate;

    return {
      Present: totalPresent,
      Late: totalLate,
      Absent: totalAbsent,
    };
  }, [sessions, students]);

  const pieData = [
    { name: 'Present', value: overallAttendance.Present },
    { name: 'Late', value: overallAttendance.Late },
    { name: 'Absent', value: overallAttendance.Absent },
  ].filter(item => item.value > 0);

  if (!sessions.length || !students.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No session or student data available to display analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="col-span-1 lg:col-span-2 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Attendance Trend</CardTitle>
          </div>
          <CardDescription>
            Shows the attendance percentage for each session over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} />
              <YAxis domain={[0, 100]} label={{ value: 'Attendance %', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="attendance" stroke={COLORS.Present} strokeWidth={2} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 lg:col-span-1 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
              <PieChartIcon className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Overall Attendance</CardTitle>
          </div>
          <CardDescription>
            Distribution of attendance statuses across all sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
