import React from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Link } from 'react-router-dom';
import { Layout, Menu, BackTop } from 'antd';
import Loading from './components/general/Loading';
import useStyles from 'isomorphic-style-loader/useStyles';
import style from './../client/styles/styles.less';

const { Header, Content, Footer } = Layout;

const App = ({ route, isLoading, pathname }) => {
    useStyles(style);

    return (
        <Layout className='layout'>
            <Loading isAnimating={isLoading} />
            <Header>
                <Menu theme='dark' mode='horizontal' defaultSelectedKeys={[pathname]}>
                    <Menu.Item key='/'>
                        <Link to='/'>Home</Link>
                    </Menu.Item>
                    <Menu.Item key='/login'>
                        <Link to='/login'>Login</Link>
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
                <div className='container'>{renderRoutes(route.routes)}</div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Sorter Generator @2020 - created by Dusk252</Footer>
        </Layout>
    );
};

const mapStateToProps = (state) => ({
    isLoading: state.app.isLoading,
    pathname: state.router.location.pathname
});

export default connect(mapStateToProps)(App);
