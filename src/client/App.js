import React from 'react';
import { renderRoutes } from 'react-router-config';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, BackTop } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import style from './../client/styles/styles.less';

const { Header, Content, Footer } = Layout;

const App = ({ route }) => {
    useStyles(style);
    const pathName = useLocation().pathname;

    return (
        <Layout className='layout'>
            <Header>
                <Menu theme='dark' mode='horizontal' defaultSelectedKeys={[pathName]}>
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

export default App;
