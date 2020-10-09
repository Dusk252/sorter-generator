import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import LoginSuccess from './pages/LoginSuccess';
import UserList from './pages/UserList';
import SorterNew from './pages/SorterNew';

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
            },
            {
                component: UserList,
                path: '/users',
                exact: true
            },
            {
                component: SorterNew,
                path: '/sorters/new',
                exact: true
            }
        ]
    }
];

export default routes;
