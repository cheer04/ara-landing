export function reviewIssues(item) {
  const issues = [];
  if (!item.title.trim()) issues.push(['Инструкция', 'Введите название', null]);
  if (!item.modelId) issues.push(['Модель', 'Выберите модель', null]);
  if (!item.steps.length) issues.push(['Шаги', 'Добавьте хотя бы один шаг', null]);
  item.steps.forEach((step, index) => {
    if (!step.text.trim() || !step.title.trim()) issues.push([`Шаг ${index + 1}`, 'Введите название и текст шага', { type: 'step', index }]);
    if (step.type === 'Проверка' && ![step.question, step.yes, step.no].every(value => value?.trim())) {
      issues.push([`Шаг ${index + 1}`, 'Заполните вопрос и оба варианта ответа', { type: 'step', index }]);
    }
  });
  item.views.forEach((view, index) => {
    if (!view.photo || view.points.length !== 4) issues.push([`Ракурс ${index + 1}`, 'Добавьте фото и отметьте 4 точки плоскости', { type: 'view', index }]);
  });
  return issues;
}
