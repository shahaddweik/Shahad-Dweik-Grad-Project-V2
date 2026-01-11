'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { ChartDataPoint } from '@/types/dashboard';

// --- Colors ---
const COLORS = ['#0d9488', '#0891b2', '#0284c7', '#2563eb', '#4f46e5']; // Teal to Indigo
const ACCENT_COLOR = '#0d9488'; // Teal-600

// --- Generic Chart Card Wrapper ---
interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-96">
      <div className="p-6 border-b border-gray-100 flex-shrink-0">
        <h4 className="text-lg font-bold text-gray-900 mb-1">{title}</h4>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="flex-grow w-full p-4 min-h-0">
        {children}
      </div>
    </div>
  );
}

// --- Bar Chart ---
export function SimpleBarChart({ data, color = ACCENT_COLOR }: { data: ChartDataPoint[]; color?: string }) {
  if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-gray-400">No data available</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          cursor={{ fill: '#f3f4f6' }}
        />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// --- Pie Chart ---
export function SimplePieChart({ data }: { data: ChartDataPoint[] }) {
  if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-gray-400">No data available</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// --- Area/Line Chart ---
export function SimpleAreaChart({ data, color = ACCENT_COLOR }: { data: ChartDataPoint[]; color?: string }) {
  if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-gray-400">No data available</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill="url(#colorValue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
