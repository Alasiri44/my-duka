import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', stock: 400 },
  { name: 'Feb', stock: 300 },
  { name: 'Mar', stock: 500 },
  { name: 'Apr', stock: 200 },
];

const ReportsChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="stock" stroke="#8884d8" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

export default ReportsChart;