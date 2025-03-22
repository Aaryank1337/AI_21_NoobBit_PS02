import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AnalyticsDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/api/logs');
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Filter only user query logs
  const userQueries = logs.filter(
    (log) => log.category === 'Chatbot' && log.event === 'User Query'
  );

  // Line Graph: Cumulative User Queries Over Time
  const sortedUserQueries = userQueries.sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
  const cumulativeLabels = sortedUserQueries.map((log) =>
    new Date(log.timestamp).toLocaleString()
  );
  const cumulativeData = sortedUserQueries.map((_, index) => index + 1);

  const lineChartData = {
    labels: cumulativeLabels,
    datasets: [
      {
        label: 'Cumulative User Queries',
        data: cumulativeData,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  // Bar Graph: User Queries per Day
  const aggregateQueriesByDay = () => {
    const counts = {};
    userQueries.forEach((log) => {
      const day = new Date(log.timestamp).toLocaleDateString();
      counts[day] = (counts[day] || 0) + 1;
    });
    return counts;
  };

  const dailyCounts = aggregateQueriesByDay();
  const barLabels = Object.keys(dailyCounts).sort(
    (a, b) => new Date(a) - new Date(b)
  );
  const barData = barLabels.map((label) => dailyCounts[label]);

  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        label: 'User Queries per Day',
        data: barData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Basic analytics metrics
  const totalUserQueries = userQueries.length;
  const totalBotResponses = logs.filter(
    (log) => log.category === 'Chatbot' && log.event === 'Bot Response'
  ).length;
  const totalErrors = logs.filter((log) => log.event === 'Error').length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
        {loading ? (
          <p>Loading analytics...</p>
        ) : (
          <div>
            {/* Analytics Metrics */}
            <div className="mb-6 space-y-1">
              <p className="text-lg">Total User Queries: <span className="font-semibold">{totalUserQueries}</span></p>
              <p className="text-lg">Total Bot Responses: <span className="font-semibold">{totalBotResponses}</span></p>
              <p className="text-lg">Total Errors: <span className="font-semibold">{totalErrors}</span></p>
            </div>

            {/* Line Chart: Cumulative User Queries Over Time */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">
                Cumulative User Queries Over Time
              </h3>
              <div className="bg-gray-100 p-4 rounded">
                <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
              </div>
            </div>

            {/* Bar Chart: User Queries per Day */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">
                User Queries per Day
              </h3>
              <div className="bg-gray-100 p-4 rounded">
                <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
              </div>
            </div>

            {/* Recent Logs Table without Details */}
            <h3 className="text-xl font-semibold mb-2">Recent Logs</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border">Timestamp</th>
                    <th className="px-4 py-2 border">User</th>
                    <th className="px-4 py-2 border">Category</th>
                    <th className="px-4 py-2 border">Event</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border">{log.user_id}</td>
                      <td className="px-4 py-2 border">{log.category}</td>
                      <td className="px-4 py-2 border">{log.event}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
