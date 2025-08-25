// Gamification system utilities
// Points system and achievements logic

// Points configuration
export const POINTS_CONFIG = {
  HABIT_COMPLETION: 10,
  STREAK_BONUS: 5, // Additional points per day in streak
  ACHIEVEMENT_UNLOCK: 50,
  PERFECT_WEEK: 100,
  PERFECT_MONTH: 500,
};

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_HABIT: {
    id: 'first_habit',
    name: 'Getting Started',
    description: 'Complete your first habit',
    icon: '🌱',
    points: 50,
    condition: (stats) => stats.totalCompleted >= 1,
  },
  FIRST_WEEK_STREAK: {
    id: 'first_week_streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    points: 100,
    condition: (stats) => stats.longestStreak >= 7,
  },
  TEN_HABITS: {
    id: 'ten_habits',
    name: 'Habit Builder',
    description: 'Complete 10 habits',
    icon: '💪',
    points: 150,
    condition: (stats) => stats.totalCompleted >= 10,
  },
  PERFECT_WEEK: {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Complete all habits for 7 consecutive days',
    icon: '⭐',
    points: 200,
    condition: (stats) => stats.perfectWeeks >= 1,
  },
  FIFTY_HABITS: {
    id: 'fifty_habits',
    name: 'Consistency Champion',
    description: 'Complete 50 habits',
    icon: '🏆',
    points: 300,
    condition: (stats) => stats.totalCompleted >= 50,
  },
  MONTH_STREAK: {
    id: 'month_streak',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🎯',
    points: 500,
    condition: (stats) => stats.longestStreak >= 30,
  },
  PERFECT_MONTH: {
    id: 'perfect_month',
    name: 'Perfect Month',
    description: 'Complete all habits for 30 consecutive days',
    icon: '👑',
    points: 1000,
    condition: (stats) => stats.perfectMonths >= 1,
  },
  HUNDRED_HABITS: {
    id: 'hundred_habits',
    name: 'Habit Master',
    description: 'Complete 100 habits',
    icon: '🌟',
    points: 500,
    condition: (stats) => stats.totalCompleted >= 100,
  },
  TRIPLE_DIGIT_STREAK: {
    id: 'triple_digit_streak',
    name: 'Century Streak',
    description: 'Maintain a 100-day streak',
    icon: '💎',
    points: 1500,
    condition: (stats) => stats.longestStreak >= 100,
  },
  HABIT_VARIETY: {
    id: 'habit_variety',
    name: 'Well Rounded',
    description: 'Complete at least 5 different habit types',
    icon: '🌈',
    points: 200,
    condition: (stats) => stats.uniqueHabitsCompleted >= 5,
  },
};

// Calculate user statistics for achievements
export const calculateUserStats = (completedData, habitList) => {
  const stats = {
    totalCompleted: 0,
    longestStreak: 0,
    currentStreak: 0,
    perfectWeeks: 0,
    perfectMonths: 0,
    uniqueHabitsCompleted: 0,
    totalPoints: 0,
  };

  // Calculate total completed habits
  Object.values(completedData).forEach(habitData => {
    const completedDays = Object.values(habitData).filter(Boolean).length;
    stats.totalCompleted += completedDays;
  });

  // Calculate longest streak across all habits
  Object.values(completedData).forEach(habitData => {
    const dates = Object.keys(habitData).filter(date => habitData[date]).sort();
    if (dates.length === 0) return;

    let currentStreak = 1;
    let longestStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diffTime = Math.abs(currDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    stats.longestStreak = Math.max(stats.longestStreak, longestStreak);
  });

  // Calculate unique habits completed
  stats.uniqueHabitsCompleted = Object.keys(completedData).filter(habitKey => {
    const habitData = completedData[habitKey] || {};
    return Object.values(habitData).some(Boolean);
  }).length;

  // Calculate perfect weeks and months (simplified logic)
  // This would need more complex logic for actual perfect streaks
  stats.perfectWeeks = Math.floor(stats.longestStreak / 7);
  stats.perfectMonths = Math.floor(stats.longestStreak / 30);

  return stats;
};

// Calculate points earned
export const calculatePoints = (completedData, habitList) => {
  const stats = calculateUserStats(completedData, habitList);
  let totalPoints = 0;

  // Base points for habit completions
  totalPoints += stats.totalCompleted * POINTS_CONFIG.HABIT_COMPLETION;

  // Streak bonus points
  totalPoints += stats.longestStreak * POINTS_CONFIG.STREAK_BONUS;

  // Perfect week/month bonuses
  totalPoints += stats.perfectWeeks * POINTS_CONFIG.PERFECT_WEEK;
  totalPoints += stats.perfectMonths * POINTS_CONFIG.PERFECT_MONTH;

  return totalPoints;
};

// Check which achievements are unlocked
export const getUnlockedAchievements = (completedData, habitList) => {
  const stats = calculateUserStats(completedData, habitList);
  const unlockedAchievements = [];

  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (achievement.condition(stats)) {
      unlockedAchievements.push(achievement);
    }
  });

  return unlockedAchievements;
};

// Get next achievements to unlock
export const getNextAchievements = (completedData, habitList) => {
  const stats = calculateUserStats(completedData, habitList);
  const nextAchievements = [];

  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (!achievement.condition(stats)) {
      nextAchievements.push({
        ...achievement,
        progress: calculateAchievementProgress(achievement, stats),
      });
    }
  });

  return nextAchievements.sort((a, b) => b.progress - a.progress);
};

// Calculate progress towards an achievement
const calculateAchievementProgress = (achievement, stats) => {
  switch (achievement.id) {
    case 'first_habit':
      return Math.min(stats.totalCompleted / 1, 1);
    case 'first_week_streak':
      return Math.min(stats.longestStreak / 7, 1);
    case 'ten_habits':
      return Math.min(stats.totalCompleted / 10, 1);
    case 'perfect_week':
      return Math.min(stats.perfectWeeks / 1, 1);
    case 'fifty_habits':
      return Math.min(stats.totalCompleted / 50, 1);
    case 'month_streak':
      return Math.min(stats.longestStreak / 30, 1);
    case 'perfect_month':
      return Math.min(stats.perfectMonths / 1, 1);
    case 'hundred_habits':
      return Math.min(stats.totalCompleted / 100, 1);
    case 'triple_digit_streak':
      return Math.min(stats.longestStreak / 100, 1);
    case 'habit_variety':
      return Math.min(stats.uniqueHabitsCompleted / 5, 1);
    default:
      return 0;
  }
};

// Level system based on points
export const calculateLevel = (points) => {
  if (points < 100) return { level: 1, title: 'Beginner', nextLevelPoints: 100 };
  if (points < 500) return { level: 2, title: 'Novice', nextLevelPoints: 500 };
  if (points < 1000) return { level: 3, title: 'Apprentice', nextLevelPoints: 1000 };
  if (points < 2500) return { level: 4, title: 'Practitioner', nextLevelPoints: 2500 };
  if (points < 5000) return { level: 5, title: 'Expert', nextLevelPoints: 5000 };
  if (points < 10000) return { level: 6, title: 'Master', nextLevelPoints: 10000 };
  return { level: 7, title: 'Grandmaster', nextLevelPoints: null };
};
