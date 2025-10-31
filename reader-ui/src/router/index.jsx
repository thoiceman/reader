import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { Layout } from '../layout'

const rootRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '*',
        element: <Navigate to="/exception/404" replace />,
      },
    ],
  },
]


export default function Router() {
  const router = createBrowserRouter(rootRoutes)

  return <RouterProvider router={router} />
}