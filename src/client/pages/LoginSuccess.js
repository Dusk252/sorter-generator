import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { getNewToken } from './../store/auth/authActions';
import BoxWrapper from './../components/general/BoxWrapper';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';

const LoginSuccess = ({ authError, getNewToken }) => {
    const history = useHistory();
    useEffect(() => {
        const timer = setTimeout(() => {
            getNewToken(() => history.push('/'));
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <LayoutBlockWrapper>
            <BoxWrapper className='small-box' title='Login Successful'>
                <div>Welcome back!</div>
                <div>You will be redirected soon...</div>
            </BoxWrapper>
        </LayoutBlockWrapper>
    );
};

const mapStateToProps = (state) => ({
    authError: state.auth.authError
});

const mapDispatchToProps = {
    getNewToken
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginSuccess);
