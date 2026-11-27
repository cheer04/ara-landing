import { date } from '../../../../common/format.js';
import { exportRows } from './export-csv.js';

export function titleOf(instructions, id) {
  return instructions.find(entry => entry.id === id)?.title || 'Удалённая инструкция';
}

export function duration(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export function exportSessions(sessions, instructions) {
  exportRows('ara-sessions.csv', ['Дата', 'Инструкция', 'Статус', 'Шаг', 'Ответ', 'Секунды'], sessions.map(item => [
    date(item.at), titleOf(instructions, item.instructionId), item.status, item.step, item.answer, item.seconds,
  ]));
}
