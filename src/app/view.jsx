import React, { useEffect, useRef, useState } from 'react';
import App from '../features/landing/view.jsx';
import Guide from '../features/workspace/guide/view.jsx';
import Workspace from '../features/workspace/view.jsx';
import { loadData, saveData } from '../common/session/controller.js';

function readRoute() {
  const hash = window.location.hash;
  return hash.startsWith('#/') ? hash.slice(2).split('/') : [];
}

export default function Root() {
  const [route, setRoute] = useState(readRoute);
  const [data, setData] = useState(loadData);
  const [error, setError] = useState('');
  const latest = useRef(data);

  useEffect(() => {
    function onHash() {
      const next = readRoute();
      setRoute(next);
      if (next.length) window.scrollTo(0, 0);
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (!route.length && window.location.hash === '#top') window.scrollTo(0, 0);
  }, [route]);

  function update(mutator) {
    try {
      const next = mutator(latest.current);
      saveData(next);
      latest.current = next;
      setData(next);
      setError('');
      return true;
    } catch (failure) {
      setError(failure.name === 'QuotaExceededError'
        ? 'Хранилище вкладки заполнено. Попробуйте загрузить фотографию меньшего размера.'
        : failure.message || 'Не удалось сохранить изменения в этой вкладке.');
      return false;
    }
  }

  if (route[0] === 'demo') return <Workspace route={route} data={data} update={update} error={error} />;
  if (route[0] === 'guide') return <>
    {error && <p className="work-error" role="alert">{error}</p>}
    <Guide key={route[1]} model={data.models.find(item => item.id === route[1])} instructions={data.instructions} instructionId={route[2]} update={update} />
  </>;
  return <App onRequest={item => update(current => ({ ...current, messages: [item, ...current.messages] }))} />;
}
