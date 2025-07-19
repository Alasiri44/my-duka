import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store'; 
import { BrowserRouter } from 'react-router-dom';

const root = createRoot(document.getElementById('root'))
root.render(
  < RouterProvider router={router} />
)