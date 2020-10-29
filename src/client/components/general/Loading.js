import { useNProgress } from '@tanem/react-nprogress';
import PropTypes from 'prop-types';
import React from 'react';

const Container = ({ children, isFinished, animationDuration }) => (
    <div
        style={{
            opacity: isFinished ? 0 : 1,
            pointerEvents: 'none',
            transition: `opacity ${animationDuration}ms linear`,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%'
        }}
    >
        {children}
    </div>
);

const Bar = ({ progress, animationDuration }) => (
    <div
        style={{
            background: '#6b478a',
            height: 3,
            marginLeft: `${(-1 + progress) * 100}%`,
            transition: `margin-left ${animationDuration}ms linear`,
            width: '100%',
            zIndex: 1031
        }}
    >
        <div
            style={{
                boxShadow: '0 0 10px #6b478a, 0 0 5px #6b478a',
                display: 'block',
                height: '100%',
                opacity: 1,
                position: 'absolute',
                right: 0,
                transform: 'rotate(3deg) translate(0px, -4px)',
                width: 100
            }}
        />
    </div>
);

const Loading = ({ isAnimating }) => {
    const { animationDuration, isFinished, progress } = useNProgress({
        isAnimating
    });

    return (
        <Container isFinished={isFinished} animationDuration={animationDuration}>
            <Bar progress={progress} animationDuration={animationDuration} />
        </Container>
    );
};

Loading.propTypes = {
    isAnimating: PropTypes.bool.isRequired
};

Container.propTypes = {
    animationDuration: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired,
    isFinished: PropTypes.bool.isRequired
};

Bar.propTypes = {
    animationDuration: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired
};

export default Loading;
