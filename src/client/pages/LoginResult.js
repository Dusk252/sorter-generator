import { push } from 'connected-react-router';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { getNewToken, clearAuthError } from '../store/auth/authActions';
import { Spin, Alert } from 'antd';
import BoxWrapper from '../components/general/BoxWrapper';
import LayoutBlockWrapper from '../components/general/LayoutBlockWrapper';

const LoginResult = ({ isFetching, authError, getNewToken, clearAuthError, push }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getNewToken(true);
    }, []);

    useEffect(() => {
        if (!isFetching) setLoading(false);
    }, [isFetching]);

    const handleReturn = () => {
        clearAuthError();
        push('/login');
    };

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <LayoutBlockWrapper>
                <BoxWrapper className='small-box' style={{ margin: 'auto' }}>
                    {loading && !authError ? (
                        <div style={{ textAlign: 'center' }}>
                            <Spin tip='Logging in...'></Spin>
                        </div>
                    ) : authError ? (
                        <>
                            <Alert
                                message='Error'
                                description='Authentication failed. We could not log you in.'
                                type='error'
                                showIcon
                            />
                            <br />
                            <div style={{ textAlign: 'center' }}>
                                Click <a onClick={handleReturn}>here</a> to return to the login page.
                            </div>
                        </>
                    ) : (
                        <>
                            <Alert message='Success' description='Login Successful! Welcome back.' type='success' showIcon />
                            <br />
                            <div style={{ textAlign: 'center' }}>You will be redirected soon...</div>
                        </>
                    )}
                </BoxWrapper>
            </LayoutBlockWrapper>
        </>
    );
};

const mapStateToProps = (state) => ({
    authError: state.auth.authError,
    isFetching: state.auth.isFetching
});

const mapDispatchToProps = {
    getNewToken,
    clearAuthError,
    push
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginResult);
