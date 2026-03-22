import dynamic from 'next/dynamic';

const ClientAppRouter = dynamic(
  () => import('../router').then((module) => module.AppRouter),
  { ssr: false },
);

function RouterShellPage() {
  return <ClientAppRouter />;
}

(RouterShellPage as typeof RouterShellPage & { disableCompatRouter?: boolean }).disableCompatRouter = true;

export default RouterShellPage;
