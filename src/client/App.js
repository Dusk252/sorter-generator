import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import Link from './components/general/Link';
import { Layout, Menu, BackTop, Spin, message } from 'antd';
import Loading from './components/general/Loading';
import { initialLoad, initializeIdbStore, clearError } from './store/app/appActions';
import useStyles from 'isomorphic-style-loader/useStyles';
import style from './../client/styles/styles.less';

const { Header, Content, Footer } = Layout;

const getShorterPath = (pathname) => {
    const lastIndex = pathname.lastIndexOf('/');
    return lastIndex > 0 ? pathname.substring(0, lastIndex) : '';
};

const App = ({
    route,
    isLoading,
    isFirstRender,
    pathname,
    initialLoad,
    initializeIdbStore,
    isLoggedIn,
    error,
    clearError
}) => {
    useStyles(style);
    useEffect(() => {
        if (isFirstRender) {
            initialLoad(pathname);
            initializeIdbStore();
        }
    }, []);
    useEffect(() => {
        if (error) message.error(error);
        return () => clearError();
    }, [error]);

    const paths = route && route.routes ? route.routes.map((r) => r.path) : [];
    let initialPath = pathname;
    while (initialPath != '') {
        if (paths.includes(initialPath)) break;
        initialPath = getShorterPath(initialPath);
    }

    return (
        <Layout className='layout'>
            <Loading isAnimating={isLoading} />
            {isFirstRender ? (
                <Spin size='large' style={{ margin: 'auto' }} />
            ) : (
                <>
                    <Header>
                        <Menu theme='dark' mode='horizontal' selectedKeys={[initialPath]}>
                            <Menu.Item key='/'>
                                <Link to='/'>Home</Link>
                            </Menu.Item>
                            {isLoggedIn ? (
                                <Menu.Item key='/profile'>
                                    <Link to='/profile'>Profile</Link>
                                </Menu.Item>
                            ) : (
                                <Menu.Item key='/login'>
                                    <Link to='/login'>Login</Link>
                                </Menu.Item>
                            )}
                            {/* <Menu.Item key='/users'>
                        <Link to='/users'>Users</Link>
                    </Menu.Item> */}
                            <Menu.Item key='/sorters'>
                                <Link to='/sorters'>Sorters</Link>
                            </Menu.Item>
                            <Menu.Item key='/sorters/new'>
                                <Link to='/sorters/new'>Create Sorter</Link>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content>
                        <BackTop />
                        <div className='container' style={{ padding: '50px 50px 0 50px' }}>
                            {renderRoutes(route.routes)}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Sorter Generator @2020 - created by Dusk252</Footer>
                </>
            )}
        </Layout>
    );
};

const mapStateToProps = (state) => ({
    isLoading: state.app.isLoading ?? false,
    isFirstRender: state.app.isFirstRender,
    pathname: state.router.location.pathname,
    isLoggedIn: state.auth.currentUser != null,
    error: state.app.error
});

const mapDispatchToProps = {
    initialLoad,
    initializeIdbStore,
    clearError
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
