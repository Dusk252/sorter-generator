import React, { useState } from 'react';
import BoxWrapper from '../components/general/BoxWrapper';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';

const Home = () => {
    // const [response, setResponse] = useState('');
    // const [post, setPost] = useState('');

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ message: post })
    //     };
    //     fetch('/api/test', requestOptions)
    //         .then(res => res.json())
    //         .then(data => setResponse(data.message) + ' in client')
    //         .catch(err => console.log(err));
    // }

    return (
        <LayoutBlockWrapper>
            <BoxWrapper>
                <p>Welcome to the alpha version of this thing.</p>
                <p>Enjoy your stay, I guess?</p>
            </BoxWrapper>
        </LayoutBlockWrapper>
        // <div className="Home">
        //     <header className="Home-header">
        //         <p>
        //             Server response below:
        //   </p>
        //     </header>
        //     <p>{response}</p>
        //     <form onSubmit={handleSubmit}>
        //         <p>
        //             <strong>Post to Server:</strong>
        //         </p>
        //         <input
        //             type="text"
        //             value={post}
        //             onChange={e => setPost(e.target.value)}
        //         />
        //         <button type="submit">Submit</button>
        //     </form>
        // </div>
    );
};

export default Home;
