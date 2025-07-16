import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider , createBrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { routes } from './router.jsx'

const router = createBrowserRouter(routes)


const root = createRoot(document.getElementById('root'))
root.render(
  < RouterProvider router={router} />
)

