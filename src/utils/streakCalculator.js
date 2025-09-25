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
  if (streak >= 3 && streak <= 4) return 'sprout';
  if (streak >= 5 && streak <= 6) return 'tree';
  if (streak >= 7) return 'blossom';
  return 'empty';
}

export function getStageInfo(stage) {
  const stages = {
    empty: {
      emoji: '🕳️',
      name: 'Empty Plot',
      description: 'Start your habit journey!',
      color: '#9ca3af',
      bgColor: '#f3f4f6',
      message: 'Plant your first seed by completing a habit!',
      nextStage: 'seed',
      requirement: 'Complete 1 habit'
    },
    seed: {
      emoji: '🌱',
      name: 'Seed',
      description: 'A small beginning',
      color: '#22c55e',
      bgColor: '#dcfce7',
      message: 'Great start! Keep going to see growth!',
      nextStage: 'sprout',
      requirement: 'Maintain 3-day streak'
    },
    sprout: {
      emoji: '🌿',
      name: 'Sprout',
      description: 'Growing strong',
      color: '#16a34a',
      bgColor: '#bbf7d0',
      message: 'Your habits are taking root!',
      nextStage: 'tree',
      requirement: 'Maintain 5-day streak'
    },
    tree: {
      emoji: '🌳',
      name: 'Tree',
      description: 'Well established',
      color: '#15803d',
      bgColor: '#86efac',
      message: 'Excellent consistency! You\'re thriving!',
      nextStage: 'blossom',
      requirement: 'Maintain 7-day streak'
    },
    blossom: {
      emoji: '🌸',
      name: 'Blossoming Tree',
      description: 'Full bloom',
      color: '#ec4899',
      bgColor: '#fce7f3',
      message: 'Amazing! You\'ve mastered your habits!',
      nextStage: null,
      requirement: 'Habit master!'
    }
  };
  
  return stages[stage] || stages.empty;
}
export function getCongrats(stage, streak) {
  const messages = {
    seed: `🎉 You planted your first seed! ${streak}-day streak!`,
    sprout: `🌱 Your habits are sprouting! ${streak}-day streak!`,
    tree: `🌳 You've grown into a strong tree! ${streak}-day streak!`,
    blossom: `🌸 Magnificent! Your habits are in full bloom! ${streak}-day streak!`
  };
  
  return messages[stage] || `Great job! ${streak}-day streak!`;
}