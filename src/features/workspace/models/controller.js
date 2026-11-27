import { newId } from '../../../common/records.js';

export function newModel() {
  return { id: newId(), code: '', title: '', type: 'Стиральная машина', description: '', photo: '' };
}

export function publicLink(modelId) {
  const url = new URL(window.location.href);
  url.hash = '/guide/' + modelId;
  return url.href;
}
