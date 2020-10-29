import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { localLogin, clearAuthError } from './../store/auth/authActions';
import { Form, Input, Button, Space, message } from 'antd';
import { UserOutlined, LockOutlined, TwitterOutlined, GoogleOutlined } from '@ant-design/icons';
import SlideBox from '../components/general/SlideBox';
import BoxWrapper from '../components/general/BoxWrapper';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';

const Login = ({ authError, localLogin, clearAuthError }) => {
    const history = useHistory();

    const handleSubmit = (values) => {
        localLogin(values.email, values.password, () => history.push('/Login/result'));
    };

    useEffect(() => {
        if (authError) {
            message.error('Invalid email and password combination.');
            clearAuthError();
        }
    }, [authError]);

    return (
        <LayoutBlockWrapper>
            <BoxWrapper className='small-box' title='Login' style={{ margin: 'auto' }}>
                <div id='login_form'>
                    <Space size='middle' direction='vertical'>
                        <Button
                            style={{ width: '100%' }}
                            type='primary'
                            htmlType='link'
                            href='/api/auth/twitter/login'
                            className='form-button twitter-color'
                        >
                            <TwitterOutlined /> Login with Twitter
                        </Button>
                        <Button
                            style={{ width: '100%' }}
                            type='primary'
                            htmlType='link'
                            href='/api/auth/google/login'
                            className='form-button google-color'
                        >
                            <GoogleOutlined /> Login with Google
                        </Button>
                        <SlideBox
                            title={
                                <div id='local_login_btn'>
                                    <UserOutlined /> Login with E-mail
                                </div>
                            }
                            color='rgba(255, 255, 255, 0.3)'
                        >
                            <Form
                                name='normal_login'
                                className='login-form'
                                initialValues={{
                                    remember: true
                                }}
                                onFinish={handleSubmit}
                            >
                                <Form.Item
                                    name='email'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your e-mail'
                                        }
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined className='site-form-item-icon' />}
                                        placeholder='E-Mail'
                                        autoComplete='off'
                                    />
                                </Form.Item>
                                <Form.Item
                                    name='password'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password'
                                        }
                                    ]}
                                >
                                    <Input
                                        prefix={<LockOutlined className='site-form-item-icon' />}
                                        type='password'
                                        placeholder='Password'
                                        autoComplete='off'
                                    />
                                </Form.Item>
                                <Form.Item style={{ marginBottom: '0' }}>
                                    <Button
                                        style={{ width: '100%' }}
                                        type='primary'
                                        htmlType='submit'
                                        className='form-button'
                                    >
                                        Log in
                                    </Button>
                                </Form.Item>
                            </Form>
                        </SlideBox>
                    </Space>
                </div>
            </BoxWrapper>
        </LayoutBlockWrapper>
    );
};

const mapStateToProps = (state) => ({
    authError: state.auth.authError
});

const mapDispatchToProps = {
    localLogin,
    clearAuthError
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
