"use client";

import React, { useRef } from 'react';
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
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { DynamicChart } from '@/types/dashboard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface Props {
  chart: DynamicChart;
  index: number;
}

export function DynamicChartRenderer({ chart, isDarkMode = true }: { chart: DynamicChart; isDarkMode?: boolean }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { chartType, data, title, description } = chart;

  const getAxisStyle = () => ({
    fontSize: 12,
    fill: isDarkMode ? '#9CA3AF' : '#6B7280', // gray-400 vs gray-500
    stroke: 'none'
  });

  const getGridStyle = () => ({
    stroke: isDarkMode ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
    strokeDasharray: '3 3',
    vertical: false
  });

  const getTooltipStyle = () => ({
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    color: '#111827',
    minWidth: '150px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    padding: '12px',
    fontWeight: 600,
  });

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid {...getGridStyle()} />
              <XAxis dataKey="name" tick={getAxisStyle()} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={getAxisStyle()} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} contentStyle={getTooltipStyle()} />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
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
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={getTooltipStyle()} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid {...getGridStyle()} />
              <XAxis dataKey="name" tick={getAxisStyle()} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={getAxisStyle()} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={getTooltipStyle()} />
              <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: isDarkMode ? '#111827' : '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`colorValue-${chart.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={getAxisStyle()} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={getAxisStyle()} axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "#E5E7EB"} />
              <Tooltip contentStyle={getTooltipStyle()} />
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill={`url(#colorValue-${chart.id})`} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        const isTrueScatter = data.length > 0 && 'x' in data[0] && typeof data[0].x === 'number';

        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "#E5E7EB"} />
              {isTrueScatter ? (
                <>
                  <XAxis type="number" dataKey="x" name="X" tick={getAxisStyle()} axisLine={false} tickLine={false} dy={10} />
                  <YAxis type="number" dataKey="y" name="Y" tick={getAxisStyle()} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={getTooltipStyle()}
                    formatter={(value: any, name: any, props: any) => {
                      // Custom tooltip for scatter to show name if available
                      if (name === 'X' || name === 'Y') return [value, name];
                      return [value, name];
                    }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const pt = payload[0].payload;
                        return (
                          <div style={getTooltipStyle()} className="p-3 text-sm">
                            <p className="font-bold mb-1">{pt.name}</p>
                            <p>X: {pt.x}</p>
                            <p>Y: {pt.y}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Matches" data={data} fill="#f59e0b" />
                </>
              ) : (
                <>
                  <XAxis type="category" dataKey="name" name="category" tick={getAxisStyle()} axisLine={false} tickLine={false} dy={10} />
                  <YAxis type="number" dataKey="value" name="value" tick={getAxisStyle()} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={getTooltipStyle()} />
                  <Scatter name="Data" data={data} fill="#f59e0b" />
                </>
              )}
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        // Case-insensitive check handled by parent, but basic fallback here
        return <p className="text-red-400">Unsupported chart type: {chartType}</p>;
    }
  };

  return (
    <div key={chart.id}
      className={`p-6 rounded-2xl shadow-sm border backdrop-blur-sm transition-all hover:scale-[1.01] duration-300
         ${isDarkMode
          ? 'bg-white/5 border-white/10 hover:bg-white/10 shadow-lg'
          : 'bg-white border-gray-100 shadow-sm'}
         ${chart.isNew ? (isDarkMode ? 'border-purple-500/50 ring-2 ring-purple-500/20' : 'border-purple-200 ring-4 ring-purple-50/50') : ''}`}
      ref={chartRef}>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {title}
            {chart.isNew && (
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide border ${isDarkMode ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200'}`}>
                New
              </span>
            )}
          </h3>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
        </div>
      </div>
      <div className="w-full h-[300px]">
        {renderChart()}
      </div>
    </div>
  );
}
