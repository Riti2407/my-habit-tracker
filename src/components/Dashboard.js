import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

const Dashboard = ({ habitList, completedData, habitEmojis }) => {
  const [selectedHabit, setSelectedHabit] = useState(habitList[0]?.key || '');
  const [viewType, setViewType] = useState('weekly'); // weekly, monthly, yearly

  // Calculate habit statistics
  const calculateHabitStats = (habitKey) => {
    const habitData = completedData[habitKey] || {};
    const dates = Object.keys(habitData).sort();
    const completedDates = dates.filter(date => habitData[date]);
    
    // Current streak
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (habitData[dateStr]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < dates.length; i++) {
      if (habitData[dates[i]]) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    // Success rate
    const totalDays = dates.length;
    const completedDays = completedDates.length;
    const successRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    
    return {
      currentStreak,
      longestStreak,
      successRate,
      totalCompleted: completedDays,
      totalDays
    };
  };

  // Get all habit statistics
  const allHabitStats = useMemo(() => {
    return habitList.map(habit => ({
      ...habit,
      stats: calculateHabitStats(habit.key),
      emoji: habitEmojis[habit.key] || '📊'
    }));
  }, [habitList, completedData, habitEmojis]);

  // Prepare line chart data for selected habit
  const getLineChartData = () => {
    const habitData = completedData[selectedHabit] || {};
    const last30Days = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last30Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: habitData[dateStr] ? 1 : 0,
        fullDate: dateStr
      });
    }
    
    return last30Days;
  };

  // Prepare bar chart data comparing all habits
  const getBarChartData = () => {
    return allHabitStats.map(habit => ({
      name: habit.label.length > 10 ? habit.label.substring(0, 10) + '...' : habit.label,
      successRate: habit.stats.successRate,
      emoji: habit.emoji
    }));
  };

  // Prepare pie chart data for completed vs missed
  const getPieChartData = () => {
    const totalCompleted = allHabitStats.reduce((sum, habit) => sum + habit.stats.totalCompleted, 0);
    const totalPossible = allHabitStats.reduce((sum, habit) => sum + habit.stats.totalDays, 0);
    const totalMissed = totalPossible - totalCompleted;
    
    return [
      { name: 'Completed', value: totalCompleted, color: '#4CAF50' },
      { name: 'Missed', value: totalMissed, color: '#FF6B6B' }
    ];
  };

  // Get monthly/yearly summary
  const getTimePeriodSummary = () => {
    const now = new Date();
    let startDate, endDate, label;
    
    if (viewType === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      label = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      label = now.getFullYear().toString();
    }
    
    const periodStats = allHabitStats.map(habit => {
      const habitData = completedData[habit.key] || {};
      let completedInPeriod = 0;
      let totalDaysInPeriod = 0;
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        totalDaysInPeriod++;
        if (habitData[dateStr]) {
          completedInPeriod++;
        }
      }
      
      return {
        ...habit,
        completedInPeriod,
        totalDaysInPeriod,
        periodSuccessRate: totalDaysInPeriod > 0 ? Math.round((completedInPeriod / totalDaysInPeriod) * 100) : 0
      };
    });
    
    return { periodStats, label };
  };

  const lineChartData = getLineChartData();
  const barChartData = getBarChartData();
  const pieChartData = getPieChartData();
  const { periodStats, label: periodLabel } = getTimePeriodSummary();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Analytics Dashboard</h1>
        <p>Gain insights into your habit tracking progress</p>
      </div>

      {/* Habit Statistics Cards */}
      <div className="stats-grid">
        {allHabitStats.slice(0, 6).map(habit => (
          <div key={habit.key} className="stat-card">
            <div className="stat-header">
              <span className="stat-emoji">{habit.emoji}</span>
              <h3>{habit.label}</h3>
            </div>
            <div className="stat-metrics">
              <div className="metric">
                <span className="metric-value">{habit.stats.currentStreak}</span>
                <span className="metric-label">Current Streak</span>
              </div>
              <div className="metric">
                <span className="metric-value">{habit.stats.longestStreak}</span>
                <span className="metric-label">Longest Streak</span>
              </div>
              <div className="metric">
                <span className="metric-value">{habit.stats.successRate}%</span>
                <span className="metric-label">Success Rate</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Line Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h2>📈 Progress Over Time</h2>
            <select 
              value={selectedHabit} 
              onChange={(e) => setSelectedHabit(e.target.value)}
              className="habit-selector"
            >
              {habitList.map(habit => (
                <option key={habit.key} value={habit.key}>
                  {habitEmojis[habit.key]} {habit.label}
                </option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} tickFormatter={(value) => value === 1 ? 'Done' : 'Missed'} />
              <Tooltip 
                formatter={(value) => [value === 1 ? 'Completed' : 'Missed', 'Status']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#4CAF50" 
                strokeWidth={3}
                dot={{ fill: '#4CAF50', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-container">
          <h2>📊 Habit Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
              <Bar dataKey="successRate" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-container">
          <h2>🥧 Overall Completion</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Reports */}
      <div className="progress-reports">
        <div className="report-header">
          <h2>📅 Progress Reports</h2>
          <div className="view-toggles">
            <button 
              className={viewType === 'weekly' ? 'active' : ''}
              onClick={() => setViewType('weekly')}
            >
              Weekly
            </button>
            <button 
              className={viewType === 'monthly' ? 'active' : ''}
              onClick={() => setViewType('monthly')}
            >
              Monthly
            </button>
            <button 
              className={viewType === 'yearly' ? 'active' : ''}
              onClick={() => setViewType('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>

        {viewType === 'weekly' && (
          <div className="weekly-summary">
            <h3>This Week's Summary</h3>
            <div className="weekly-grid">
              {allHabitStats.slice(0, 8).map(habit => (
                <div key={habit.key} className="weekly-habit">
                  <span className="habit-emoji">{habit.emoji}</span>
                  <span className="habit-name">{habit.label}</span>
                  <div className="weekly-progress">
                    <span className="progress-text">{habit.stats.currentStreak} day streak</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${habit.stats.successRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(viewType === 'monthly' || viewType === 'yearly') && (
          <div className="period-summary">
            <h3>{periodLabel} Summary</h3>
            <div className="period-grid">
              {periodStats.map(habit => (
                <div key={habit.key} className="period-habit">
                  <div className="period-habit-header">
                    <span className="habit-emoji">{habit.emoji}</span>
                    <span className="habit-name">{habit.label}</span>
                  </div>
                  <div className="period-stats">
                    <div className="period-metric">
                      <span className="metric-value">{habit.completedInPeriod}</span>
                      <span className="metric-label">/{habit.totalDaysInPeriod} days</span>
                    </div>
                    <div className="period-success-rate">
                      {habit.periodSuccessRate}% success rate
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Key Insights */}
      <div className="insights-section">
        <h2>💡 Key Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h3>🏆 Top Performer</h3>
            <p>
              {allHabitStats.reduce((best, habit) => 
                habit.stats.successRate > (best?.stats.successRate || 0) ? habit : best
              )?.label || 'No data'} with {
                Math.max(...allHabitStats.map(h => h.stats.successRate))
              }% success rate
            </p>
          </div>
          <div className="insight-card">
            <h3>🔥 Longest Streak</h3>
            <p>
              {allHabitStats.reduce((best, habit) => 
                habit.stats.longestStreak > (best?.stats.longestStreak || 0) ? habit : best
              )?.label || 'No data'} with {
                Math.max(...allHabitStats.map(h => h.stats.longestStreak))
              } days
            </p>
          </div>
          <div className="insight-card">
            <h3>📈 Improvement Opportunity</h3>
            <p>
              {allHabitStats.reduce((worst, habit) => 
                habit.stats.successRate < (worst?.stats.successRate || 100) ? habit : worst
              )?.label || 'No data'} needs attention with {
                Math.min(...allHabitStats.map(h => h.stats.successRate))
              }% success rate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
