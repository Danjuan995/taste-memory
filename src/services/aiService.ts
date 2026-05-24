export const aiService = {
  generateTasteMemorySummary(dishName: string, review: string) {
    const warm = review || '这顿饭吃起来很安心';
    return {
      title: `今天这道${dishName}，值得再做一次`,
      summary: `这一餐的感觉是：${warm}。整体风味很完整，适合加入你们的私房菜常做清单。`,
      tags: ['家常', '暖胃', '有记忆点', '适合复刻'],
      suggestion: '下次可以在出锅前加一点点香草或葱花，香气会更立体。'
    };
  },
  generateRestaurantVisitSummary(name: string, review: string) {
    return {
      title: `${name}，是会想二刷的小馆子`,
      summary: `这次探店最打动你们的是：${review || '氛围和味道都很舒服'}。建议收藏为周末约会备选。`,
      tags: ['约会感', '氛围在线', '值得回访'],
      suggestion: '下次可以错峰到店，体验会更从容。'
    };
  }
};
