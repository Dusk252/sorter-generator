import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import TwitterLogin from 'react-twitter-auth';

const Login = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const authFailure = false;

    const handleSubmit = (e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        };
        fetch('/api/users/login', requestOptions)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => { console.log(err); authFailure = true; });
        history.push('/');
    }

    const handleTwitterRes = (res) => {
        res
            ? history.push('/')
            : authFailure = true;
    }

    return (
        <div className="Home">
            <header className="Home-header">
                <p>
                    User login test page
                </p>
                {authFailure ? <p style={{ color: 'red' }}>authentication failed</p> : ''}
            </header>
            <form onSubmit={handleSubmit}>
                <p>
                    <strong>Login:</strong>
                </p>
                <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            <div>test</div>
            <TwitterLogin loginUrl="/api/users/login-twitter-access"
                onFailure={e => console.log(e)} onSuccess={e => console.log(e)}
                requestTokenUrl="/api/users/login-twitter-request" />
        </div>
    );
};

export default Login;