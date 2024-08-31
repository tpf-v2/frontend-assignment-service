import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';

const BarChartComponent = ({ data }) => {
  return (
    <>
      <Typography variant="h6" style={{ padding: '16px', color: '#0072C6', textAlign: 'left' }}>
        Integrantes por respuesta
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#0072C6" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default BarChartComponent;