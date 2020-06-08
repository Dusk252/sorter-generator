import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';

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
        component: Login,
        path: '/login',
        exact: true
      }
    ]
  }
];

export default routes;