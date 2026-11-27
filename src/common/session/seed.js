import { statuses } from '../statuses.js';
import { types } from './instruction-types.js';

const seedDate = '2026-10-10T12:00:00';
const frontPhoto = 'images/demo-washer.png';
const defaultViews = [
  {
    id: 'front', name: 'Вид спереди', photo: frontPhoto,
    points: [{ x: 13, y: 39 }, { x: 92, y: 39 }, { x: 79, y: 91 }, { x: 22, y: 91 }],
  },
];

const cleaning = {
  id: 'cleaning', modelId: 'washer', title: 'Очистка фильтра сливного насоса',
  type: types[0], status: statuses[3], updated: seedDate,
  supplies: 'Перчатки, небольшая ёмкость и сухая ткань',
  preparation: 'Освободите место под машиной. Поставьте ёмкость и положите ткань рядом с фильтром.',
  warning: 'Отключите машину от электросети. Дождитесь остывания воды.',
  views: defaultViews, history: [{ at: seedDate, text: 'Инструкция опубликована' }],
  steps: [
    {
      id: 'power', title: 'Обесточьте машину', type: 'Безопасность', text: 'Вытащите вилку из розетки.',
      viewId: 'front', points: [{ x: 33, y: 16 }, { x: 52, y: 8 }], warning: 'Дождитесь остывания воды.', level: 'Внимание',
    },
    {
      id: 'cover', title: 'Откройте нижнюю сервисную крышку', type: 'Обычный',
      text: 'Подставьте ёмкость для остатков воды.', viewId: 'front',
      points: [{ x: 61, y: 63 }, { x: 75, y: 89 }], warning: '', level: 'Внимание',
    },
    {
      id: 'check', title: 'Осмотрите фильтр', type: 'Проверка',
      text: 'Осмотрите фильтр и область вокруг него. Проверьте, нет ли видимого мусора, ворса или посторонних предметов.',
      viewId: 'front', points: [{ x: 52, y: 65 }, { x: 75, y: 89 }], warning: '', level: 'Внимание',
      question: 'Есть ли загрязнения?', yes: 'Да, нужна очистка', no: 'Нет, всё чисто',
    },
  ],
};

function example(id, title, status) {
  return { ...cleaning, id, title, status, supplies: '', preparation: '', warning: '', steps: [], history: [] };
}

export const initial = {
  instructions: [
    cleaning,
    example('feet', 'Проверка балансировки и протяжка ножек', statuses[0]),
    example('air', 'Контроль вентиляции и предотвращение коррозии корпуса', statuses[1]),
  ],
  models: [{ id: 'washer', code: 'М-1', title: 'Стиральная машина', type: 'Стиральная машина', description: 'Инструкции по обслуживанию стиральной машины', photo: frontPhoto }],
  messages: [
    { id: 'question', instructionId: 'cleaning', title: 'Непонятный указатель', text: 'Не сразу нашёл сервисную крышку на втором шаге.', status: 'Новое', reply: '', at: seedDate },
    { id: 'suggestion', instructionId: 'cleaning', title: 'Уточнение к инструкции', text: 'Добавьте пояснение про ёмкость для воды.', status: 'В работе', reply: '', at: seedDate },
    { id: 'feedback', instructionId: 'cleaning', title: 'Спасибо за подсказки', text: 'Получилось проверить фильтр.', status: 'Закрыто', reply: 'Спасибо за обратную связь!', at: seedDate },
  ],
  sessions: [
    { id: 'sample1', instructionId: 'cleaning', at: seedDate, status: 'Завершено', answer: 'Нет, всё чисто', seconds: 95, step: 3 },
    { id: 'sample2', instructionId: 'cleaning', at: seedDate, status: 'Прервано', answer: '', seconds: 40, step: 2 },
  ],
};
