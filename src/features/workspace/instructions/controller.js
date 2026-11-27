import { newId, timestamp } from '../../../common/records.js';
import { statuses } from '../../../common/statuses.js';
import { types } from '../../../common/session/instruction-types.js';

export function newInstruction(modelId) {
  return {
    id: newId(), modelId, title: '', type: types[0], status: statuses[0],
    supplies: '', preparation: '', warning: '', steps: [], views: [], history: [], updated: timestamp(),
  };
}
