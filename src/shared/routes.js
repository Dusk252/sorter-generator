import Home from './Home';
import Hello from './Hello';

const routes = [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/hello',
    exact: true,
    component: Hello
  },
]

export default routes