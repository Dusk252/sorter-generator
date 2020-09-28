import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import LoginSuccess from './pages/LoginSuccess';

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
            },
            {
                component: LoginSuccess,
                path: '/loginSuccess',
                exact: true
            }
        ]
    }
];

export default routes;
