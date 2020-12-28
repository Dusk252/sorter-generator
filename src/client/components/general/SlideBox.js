import React from 'react';
import { animated } from 'react-spring';
import useCollapse from './../../hooks/useCollapse';

const SlideBox = ({ isOpen = false, title = '', color = '#fff', children }) => {
    const { setOpen, ref, height } = useCollapse(isOpen);

    return (
        <div>
            <div className='slidebox' style={{ borderColor: color }}>
                <div className='slidebox-title' onClick={() => setOpen((open) => !open)}>
                    {title}
                </div>
                <animated.div style={{ height }}>
                    <div ref={ref} className='slidebox-content'>
                        {children}
                    </div>
                </animated.div>
            </div>
        </div>
    );
};

export default SlideBox;
