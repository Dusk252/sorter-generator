import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const LoginSuccess = () => {
    const history = useHistory();
    useEffect(() => {
        const timer = setTimeout(() => {
            history.push('/');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='Home'>
            <header className='Home-header'>
                <p>Login Successful</p>
            </header>
        </div>
    );
};

export default LoginSuccess;
