import React from 'react';
import { createRoot } from 'react-dom/client';
import './app/theme.css';
import './app/Surface.css';
import Root from './app/view.jsx';

createRoot(document.getElementById('root')).render(<div className="ara-app"><Root /></div>);
