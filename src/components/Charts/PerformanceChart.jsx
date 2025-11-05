import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

export default function PerformanceChart({ data, type = 'line' }) {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No data available for chart</Typography>
      </Paper>
    );
  }

  const ChartComponent = type === 'bar' ? BarChart : LineChart;
  const DataComponent = type === 'bar' ? Bar : Line;

  return (
    <Box sx={{ width: '100%', height: 300, mt: 2 }}>
      <ResponsiveContainer>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <DataComponent 
            type="monotone" 
            dataKey="score" 
            stroke="#FF4433" 
            strokeWidth={2}
            fill={type === 'bar' ? '#FF4433' : undefined}
          />
          <DataComponent 
            type="monotone" 
            dataKey="average" 
            stroke="#3b82f6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            fill={type === 'bar' ? '#3b82f6' : undefined}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </Box>
  );
}

