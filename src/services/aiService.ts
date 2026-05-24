export const aiService = {
  summarizeTaste(review: string, dishName: string) {
    const base = review || '这次发挥稳定，香气和口感都很舒服。';
    return {
      title: `周日晚上的${dishName}，暖得刚刚好`,
      summary: `这次${dishName}整体表现很稳，${base.slice(0, 30)}。这道菜很适合保留在周末晚餐清单里。`,
      tags: ['酸甜', '浓郁', '家常', '暖胃'],
      suggestion: '下次可以减少一点炖煮时间，让口感更有层次。'
    };
  }
};
