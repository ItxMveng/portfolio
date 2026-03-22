import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ScrollToTop } from '../components/layout/ScrollToTop';
import { Spinner } from '../components/ui';
import styled from 'styled-components';

const HomePage = lazy(() => import('../pages/HomePage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));
const ArticlePage = lazy(() => import('../pages/ArticlePage'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const AdminLayout = lazy(() => import('../pages/admin/AdminLayout'));
const LoginPage = lazy(() => import('../pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const ProfileEditor = lazy(() => import('../pages/admin/ProfileEditor'));
const SkillsEditor = lazy(() => import('../pages/admin/SkillsEditor'));
const ServicesEditor = lazy(() => import('../pages/admin/ServicesEditor'));
const ProjectsManager = lazy(() => import('../pages/admin/ProjectsManager'));
const ProjectEditor = lazy(() => import('../pages/admin/ProjectEditor'));
const BlogManager = lazy(() => import('../pages/admin/BlogManager'));
const ArticleEditor = lazy(() => import('../pages/admin/ArticleEditor'));
const MessagesPage = lazy(() => import('../pages/admin/MessagesPage'));

const PageLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
`;

function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense
          fallback={
            <PageLoader>
              <Spinner size={32} />
            </PageLoader>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:slug', element: <ProjectDetailPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:slug', element: <ArticlePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin/login',
    element: (
      <Suspense
        fallback={
          <PageLoader>
            <Spinner size={32} />
          </PageLoader>
        }
      >
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Suspense
          fallback={
            <PageLoader>
              <Spinner size={32} />
            </PageLoader>
          }
        >
          <AdminLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'profile', element: <ProfileEditor /> },
      { path: 'skills', element: <SkillsEditor /> },
      { path: 'services', element: <ServicesEditor /> },
      { path: 'projects', element: <ProjectsManager /> },
      { path: 'projects/new', element: <ProjectEditor /> },
      { path: 'projects/:id/edit', element: <ProjectEditor /> },
      { path: 'blog', element: <BlogManager /> },
      { path: 'blog/new', element: <ArticleEditor /> },
      { path: 'blog/:id/edit', element: <ArticleEditor /> },
      { path: 'messages', element: <MessagesPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
