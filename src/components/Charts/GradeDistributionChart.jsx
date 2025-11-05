import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'];

export default function GradeDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No data available for chart</Typography>
      </Paper>
    );
  }

  const chartData = [
    { name: 'A (90-100%)', value: data.filter(d => d.percentage >= 90).length },
    { name: 'B (80-89%)', value: data.filter(d => d.percentage >= 80 && d.percentage < 90).length },
    { name: 'C (70-79%)', value: data.filter(d => d.percentage >= 70 && d.percentage < 80).length },
    { name: 'D (60-69%)', value: data.filter(d => d.percentage >= 60 && d.percentage < 70).length },
    { name: 'F (<60%)', value: data.filter(d => d.percentage < 60).length },
  ].filter(item => item.value > 0);

  return (
    <Box sx={{ width: '100%', height: 300, mt: 2 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}

