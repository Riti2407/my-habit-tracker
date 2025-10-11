export function calculateStreaks(habits, keys) {
  const completedDates = new Set();
  
  keys.forEach(key => {
    const data = habits[key] || {};
    Object.keys(data).forEach(date => {
      if (data[date]) {
        completedDates.add(date);
      }
    });
  });
  
  const sortedDates = Array.from(completedDates).sort();
  
  if (sortedDates.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      growthStage: 'empty',
      stageInfo: getStageInfo('empty')
    };
  }
  
  let currentStreak = 0;
  const today = new Date();
  let date = new Date(today);
  const todayStr = date.toISOString().split('T')[0];
  
  if (!completedDates.has(todayStr)) {
    date.setDate(date.getDate() - 1);
  }
  
  while (true) {
    const dateStr = date.toISOString().split('T')[0];
    if (completedDates.has(dateStr)) {
      currentStreak++;
      date.setDate(date.getDate() - 1);
    } else {
      break;
    }
  }
  let bestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;
  
  for (const dateStr of sortedDates) {
    const current = new Date(dateStr);
    
    if (prevDate === null) {
      tempStreak = 1;
    } else {
      const diffTime = current - prevDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    prevDate = current;
  }
  
  bestStreak = Math.max(bestStreak, tempStreak);
  
  const stage = getStage(currentStreak);
  
  return {
    currentStreak,
    bestStreak,
    growthStage: stage,
    stageInfo: getStageInfo(stage),
    completedDates: sortedDates
  };
}

export function getStage(streak) {
  if (streak === 0) return 'empty';
  if (streak >= 1 && streak <= 2) return 'seed';
  if (streak >= 3 && streak <= 6) return 'sprout';
  if (streak >= 7 && streak <= 13) return 'sapling';
  if (streak >= 14 && streak <= 20) return 'tree';
  if (streak >= 21 && streak <= 29) return 'mature_tree';
  if (streak >= 30 && streak <= 49) return 'flowering_tree';
  if (streak >= 50 && streak <= 99) return 'fruit_tree';
  if (streak >= 100) return 'ancient_tree';
  return 'empty';
}

export function getStageInfo(stage) {
  const stages = {
    empty: {
      emoji: '🕳️',
      name: 'Empty Plot',
      description: 'Ready to plant your first habit',
      color: '#9ca3af',
      bgColor: '#f3f4f6',
      message: 'Plant your first seed by completing a habit!',
      nextStage: 'seed',
      requirement: 'Complete 1 habit',
      pot: null
    },
    seed: {
      emoji: '🌱',
      name: 'Seed',
      description: 'A small beginning with great potential',
      color: '#22c55e',
      bgColor: '#dcfce7',
      message: 'Great start! Keep going to see growth!',
      nextStage: 'sprout',
      requirement: 'Maintain 3-day streak',
      pot: '🏺'
    },
    sprout: {
      emoji: '🌿',
      name: 'Sprout',
      description: 'Young shoots reaching for the light',
      color: '#16a34a',
      bgColor: '#bbf7d0',
      message: 'Your habits are taking root!',
      nextStage: 'sapling',
      requirement: 'Maintain 7-day streak',
      pot: '🪴'
    },
    sapling: {
      emoji: '🌲',
      name: 'Young Sapling',
      description: 'Growing stronger each day',
      color: '#15803d',
      bgColor: '#86efac',
      message: 'Excellent progress! You\'re building consistency!',
      nextStage: 'tree',
      requirement: 'Maintain 14-day streak',
      pot: '🏺'
    },
    tree: {
      emoji: '🌳',
      name: 'Healthy Tree',
      description: 'Well established and thriving',
      color: '#166534',
      bgColor: '#86efac',
      message: 'Amazing consistency! You\'re truly thriving!',
      nextStage: 'mature_tree',
      requirement: 'Maintain 21-day streak',
      pot: '🏺'
    },
    mature_tree: {
      emoji: '🌲',
      name: 'Mature Tree',
      description: 'Strong and resilient',
      color: '#14532d',
      bgColor: '#4ade80',
      message: 'Incredible! Your habits are deeply rooted!',
      nextStage: 'flowering_tree',
      requirement: 'Maintain 30-day streak',
      pot: '🏺'
    },
    flowering_tree: {
      emoji: '🌸',
      name: 'Flowering Tree',
      description: 'Beautiful blooms of consistency',
      color: '#ec4899',
      bgColor: '#fce7f3',
      message: 'Spectacular! Your dedication is blooming!',
      nextStage: 'fruit_tree',
      requirement: 'Maintain 50-day streak',
      pot: '🏺'
    },
    fruit_tree: {
      emoji: '🌺',
      name: 'Fruit-bearing Tree',
      description: 'Harvesting the rewards of consistency',
      color: '#dc2626',
      bgColor: '#fef2f2',
      message: 'Outstanding! You\'re reaping what you\'ve sown!',
      nextStage: 'ancient_tree',
      requirement: 'Maintain 100-day streak',
      pot: '🏺'
    },
    ancient_tree: {
      emoji: '🌳',
      name: 'Ancient Wisdom Tree',
      description: 'A living legend of consistency',
      color: '#7c2d12',
      bgColor: '#fed7aa',
      message: 'LEGENDARY! You\'ve achieved habit mastery!',
      nextStage: null,
      requirement: 'Habit Legend!',
      pot: '🏺'
    }
  };
  
  return stages[stage] || stages.empty;
}
export function getCongrats(stage, streak) {
  const messages = {
    seed: `🎉 You planted your first seed! ${streak}-day streak!`,
    sprout: `🌱 Your habits are sprouting! ${streak}-day streak!`,
    sapling: `🌲 Growing into a strong sapling! ${streak}-day streak!`,
    tree: `🌳 You've grown into a mighty tree! ${streak}-day streak!`,
    mature_tree: `🌲 Your tree has matured beautifully! ${streak}-day streak!`,
    flowering_tree: `🌸 Magnificent blooms of consistency! ${streak}-day streak!`,
    fruit_tree: `🌺 Your tree bears the fruits of dedication! ${streak}-day streak!`,
    ancient_tree: `🌳 LEGENDARY! An ancient tree of wisdom! ${streak}-day streak!`
  };
  
  return messages[stage] || `Great job! ${streak}-day streak!`;
}