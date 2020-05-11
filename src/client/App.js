import React from 'react';
import { renderRoutes } from 'react-router-config';

const App = ({ route }) => {
    return (
        <div className="container">
            {renderRoutes(route.routes)}
        </div>
    );
};

export default App;