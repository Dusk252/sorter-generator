import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import BoxWrapper from '../components/general/BoxWrapper';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';

const Home = () => (
    <>
        <Helmet>
            <title>Home</title>
        </Helmet>
        <LayoutBlockWrapper>
            <BoxWrapper>
                <p>Welcome to the alpha version of this thing.</p>
                <p>Enjoy your stay, I guess?</p>
            </BoxWrapper>
        </LayoutBlockWrapper>
    </>
);

export default Home;
