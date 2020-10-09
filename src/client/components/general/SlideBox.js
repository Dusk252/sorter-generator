import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';

const SlideBox = ({ isOpen = false, title = '', color = '#fff', children }) => {
    const [open, setOpen] = useState(isOpen);
    const [{ height }, set] = useSpring(() => ({ height: isOpen ? 'auto' : 0 }));
    const mountRef = useRef(false);
    const el = useRef(null);

    useEffect(() => {
        if (mountRef.current) {
            set({
                reset: true,
                from: { height: open ? 0 : el.current.offsetHeight },
                to: async (next) => {
                    await next({ height: open ? el.current.offsetHeight : 0 });
                    open && (await next({ height: 'auto' }));
                }
            });
        } else mountRef.current = true;
    }, [open]);

    return (
        <div>
            <div className='slidebox' style={{ borderColor: color }}>
                <div className='slidebox-title' onClick={() => setOpen((open) => !open)}>
                    {title}
                </div>
                <animated.div style={{ height }}>
                    <div ref={el} className='slidebox-content'>
                        {children}
                    </div>
                </animated.div>
            </div>
        </div>
    );
};

export default SlideBox;
