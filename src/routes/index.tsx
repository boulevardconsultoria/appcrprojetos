import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { HomePage } from '@/pages/Home'
import { CatalogPage } from '@/pages/Catalog'
import { FilePage } from '@/pages/File'
import { LoginPage } from '@/pages/Login'
import { RegisterPage } from '@/pages/Register'
import { ForgotPasswordPage } from '@/pages/ForgotPassword'
import { DashboardPage } from '@/pages/Dashboard'
import { DownloadsPage } from '@/pages/Downloads'
import { FavoritesPage } from '@/pages/Favorites'
import { ProfilePage } from '@/pages/Profile'
import { PlansPage } from '@/pages/Plans'
import { AdminDashboard } from '@/pages/Admin/Dashboard'
import { AdminFiles } from '@/pages/Admin/Files'
import { AdminCategories } from '@/pages/Admin/Categories'
import { AdminUsers } from '@/pages/Admin/Users'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalogo', element: <CatalogPage /> },
      { path: 'modelo/:slug', element: <FilePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'cadastro', element: <RegisterPage /> },
      { path: 'recuperar-senha', element: <ForgotPasswordPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'downloads', element: <DownloadsPage /> },
      { path: 'favoritos', element: <FavoritesPage /> },
      { path: 'perfil', element: <ProfilePage /> },
      { path: 'planos', element: <PlansPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'arquivos', element: <AdminFiles /> },
      { path: 'categorias', element: <AdminCategories /> },
      { path: 'usuarios', element: <AdminUsers /> },
    ],
  },
])
