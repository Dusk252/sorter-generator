import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import Link from './components/general/Link';
import { Layout, Menu, BackTop } from 'antd';
import Loading from './components/general/Loading';
import { initialLogin } from './store/app/appActions';
import useStyles from 'isomorphic-style-loader/useStyles';
import style from './../client/styles/styles.less';

const { Header, Content, Footer } = Layout;

const App = ({ route, isLoading, isFirstRender, pathname, initialLogin, isLoggedIn }) => {
    useStyles(style);
    useEffect(() => {
        if (isFirstRender) initialLogin(pathname);
    }, []);

    return (
        <Layout className='layout'>
            <Loading isAnimating={isLoading} />
            <Header>
                <Menu theme='dark' mode='horizontal' selectedKeys={[pathname]}>
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
            <Content style={{ padding: '50px 50px 0 50px' }}>
                <BackTop />
                <div className='container'>{renderRoutes(route.routes)}</div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Sorter Generator @2020 - created by Dusk252</Footer>
        </Layout>
    );
};

const mapStateToProps = (state) => ({
    isLoading: state.app.isLoading ?? false,
    isFirstRender: state.app.isFirstRender,
    pathname: state.router.location.pathname,
    isLoggedIn: state.auth.currentUser != null
});

const mapDispatchToProps = {
    initialLogin
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
