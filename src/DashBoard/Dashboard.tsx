import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiUserCheck } from "react-icons/fi";
import clientService from "../services/Client/clientService";
import { userService } from "../services/user/userService";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const COLORS = ["#6366F1", "#10B981"]; // Indigo + Green
const gradientColors = ["#6366F1", "#A78BFA"];

const Dashboard = () => {
  const [totalClients, setTotalClients] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const [weeklyClients, setWeeklyClients] = useState<number[]>([]);
  const [weeklyUsers, setWeeklyUsers] = useState<number[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const clients = await clientService.getAll();
      const users = await userService.getAll();

      setTotalClients(clients.length);
      setTotalUsers(users.length);

      // Generate dummy weekly activity for charts
      setWeeklyClients(Array.from({ length: 7 }, () => Math.floor(Math.random() * 10 + 5)));
      setWeeklyUsers(Array.from({ length: 7 }, () => Math.floor(Math.random() * 5 + 2)));
    } catch (err) {
      console.error("Dashboard load failed", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const chartData = [
    { name: "Clients", value: totalClients },
    { name: "Users", value: totalUsers },
  ];

  const lineChartData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    clients: weeklyClients[i] || 0,
    users: weeklyUsers[i] || 0,
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-800">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-2xl p-6 flex items-center space-x-4 hover:scale-[1.03] transition"
        >
          <FiUsers className="w-12 h-12 text-indigo-600" />
          <div>
            <p className="text-gray-500">Total Clients</p>
            <p className="text-3xl font-bold">{totalClients}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white shadow-xl rounded-2xl p-6 flex items-center space-x-4 hover:scale-[1.03] transition"
        >
          <FiUserCheck className="w-12 h-12 text-green-500" />
          <div>
            <p className="text-gray-500">Total Users</p>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-xl rounded-2xl p-6 flex flex-col justify-center hover:scale-[1.03] transition"
        >
          <p className="text-gray-500">Client Growth</p>
          <p className="text-3xl font-bold text-indigo-600">+12%</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* Bar Chart */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Bar Chart</h3>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Pie Chart</h3>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line Chart (weekly activity) */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mt-10">
        <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
        <div className="w-full h-80">
          <ResponsiveContainer>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="clients"
                stroke={gradientColors[0]}
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke={gradientColors[1]}
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
