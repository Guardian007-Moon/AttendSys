
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loadAttendance } from '@/lib/mock-data';
import { useMemo } from 'react';
import { TrendingUp, PieChart as PieChartIcon, Users } from 'lucide-react';

const COLORS = {
  Present: '#22c55e', // green-500
  Late: '#f59e0b',    // amber-500
  Absent: '#ef4444',  // red-500
};

const CustomTick = ({ x, y, payload }) => {
  if (payload && payload.value) {
    const label = payload.value;
    const maxChars = 10; // Character limit before font size starts to scale
    const baseFontSize = 12; // Base font size for labels
    const minFontSize = 8; // Minimum font size

    let fontSize = baseFontSize;
    if (label.length > maxChars) {
      // Scale font size down for longer labels
      fontSize = Math.max(minFontSize, baseFontSize - (label.length - maxChars) * 0.5);
    }
    
    // Simple logic to split into two lines if very long
    if (label.length > 15) {
        const words = label.split(' ');
        const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
        const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
        return (
            <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)" fontSize={fontSize}>
                <tspan x="0" dy="1.2em">{line1}</tspan>
                <tspan x="0" dy="1.2em">{line2}</tspan>
            </text>
            </g>
        );
    }

    return (
       <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)" fontSize={fontSize}>
          {label}
        </text>
      </g>
    );
  }
  return null;
};


export default function AnalyticsDashboard({ students, sessions }) {
  const attendanceData = useMemo(() => {
    if (!sessions.length || !students.length) return [];
    
    const allAttendance = loadAttendance();

    return sessions.map(session => {
      const sessionAttendance = allAttendance[session.id] || {};
      const present = Object.values(sessionAttendance).filter(a => a.status === 'Present').length;
      const late = Object.values(sessionAttendance).filter(a => a.status === 'Late').length;
      const attended = present + late;
      const absent = students.length - attended;
      
      return {
        name: session.name,
        date: new Date(session.date).toLocaleDateString(),
        Present: present,
        Late: late,
        Absent: absent,
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
            Shows the number of students with each attendance status for every session.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={<CustomTick />} height={80} interval={0} />
              <YAxis label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend verticalAlign="top" align="right" />
              <Line type="monotone" dataKey="Present" stroke={COLORS.Present} strokeWidth={2} />
              <Line type="monotone" dataKey="Late" stroke={COLORS.Late} strokeWidth={2} />
              <Line type="monotone" dataKey="Absent" stroke={COLORS.Absent} strokeWidth={2} />
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
              <Legend verticalAlign="top" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-1 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Student Performance</CardTitle>
          </div>
          <CardDescription>
            Individual student attendance summary across all sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
                data={students.map(student => {
                    const studentAttendance = { name: student.name, Present: 0, Late: 0, Absent: 0 };
                    sessions.forEach(session => {
                        const allAtt = loadAttendance();
                        const record = allAtt[session.id] && allAtt[session.id][student.id];
                        if (record) {
                            studentAttendance[record.status]++;
                        } else {
                            studentAttendance.Absent++;
                        }
                    });
                    return studentAttendance;
                })}
                layout="vertical"
                margin={{ top: 20, right: 20, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend verticalAlign="top" align="right" />
              <Bar dataKey="Present" stackId="a" fill={COLORS.Present} />
              <Bar dataKey="Late" stackId="a" fill={COLORS.Late} />
              <Bar dataKey="Absent" stackId="a" fill={COLORS.Absent} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
