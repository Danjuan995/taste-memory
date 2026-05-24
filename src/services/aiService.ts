export const aiService = {
  summarizeTaste(review: string, dishName: string) {
    const digest = review.slice(0, 30) || '这顿饭很有家的温度';
    return {
      title: `今天这道${dishName}，值得再做一次`,
      summary: `AI 味蕾总结：${digest}。整体口感层次不错，记录下了你们今天的小确幸。`,
      tags: ['家常治愈', '口感平衡', '值得复刻'],
      suggestion: '下次可以把咸度降低一点，再增加一点香草或葱花提香。'
    };
  }
};
