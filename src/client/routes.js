import App from './App';
import Home from './pages/Home';
import Hello from './pages/Hello';

const routes = [
  {
    component: App,
    routes: [
      {
        component: Home,
        path: '/',
        exact: true
      },
      {
        component: Hello,
        path: '/hello',
        exact: true
      }
    ]
  }
];

export default routes;