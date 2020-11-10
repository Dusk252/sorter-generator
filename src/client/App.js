import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { Layout, Menu, BackTop } from 'antd';
import Loading from './components/general/Loading';
import { getNewToken, clearAuthError } from './store/auth/authActions';
import useStyles from 'isomorphic-style-loader/useStyles';
import style from './../client/styles/styles.less';

const { Header, Content, Footer } = Layout;

const App = ({ route, isLoading, pathname, authStatus, clearAuthError, user, getNewToken, history }) => {
    const [renderRoute, setRenderRoute] = useState(false);
    useStyles(style);
    useEffect(() => {
        const match = matchRoutes(route.routes, pathname);
        if (match.length && match[0].route.private) {
            if (!user) {
                setRenderRoute(false);
                if (!authStatus.authError) getNewToken();
                else {
                    clearAuthError();
                    history.push('/login');
                }
            } else setRenderRoute(true);
        } else setRenderRoute(true);
    }, [user, authStatus.authError, pathname]);

    return (
        <Layout className='layout'>
            <Loading isAnimating={isLoading} />
            <Header>
                <Menu theme='dark' mode='horizontal' selectedKeys={[pathname]}>
                    <Menu.Item key='/'>
                        <Link to='/'>Home</Link>
                    </Menu.Item>
                    <Menu.Item key='/login'>
                        <Link to='/login'>Login</Link>
                    </Menu.Item>
                    <Menu.Item key='/profile'>
                        <Link to='/profile'>Profile</Link>
                    </Menu.Item>
                    <Menu.Item key='/users'>
                        <Link to='/users'>Users</Link>
                    </Menu.Item>
                    <Menu.Item key='/sorters'>
                        <Link to='/sorters'>Sorters</Link>
                    </Menu.Item>
                    <Menu.Item key='/sorters/new'>
                        <Link to='/sorters/new'>Create Sorter</Link>
                    </Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <BackTop />
                {renderRoute ? <div className='container'>{renderRoutes(route.routes)}</div> : <></>}
            </Content>
            <Footer style={{ textAlign: 'center' }}>Sorter Generator @2020 - created by Dusk252</Footer>
        </Layout>
    );
};

const mapStateToProps = (state) => ({
    isLoading: state.app.isLoading,
    authStatus: { isFetching: state.auth.isFetching, authError: state.auth.authError },
    pathname: state.router.location.pathname,
    user: state.auth.currentUser
});

const mapDispatchToProps = {
    history: { push },
    getNewToken,
    clearAuthError
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
