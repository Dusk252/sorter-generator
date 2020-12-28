import React from 'react';
import { animated } from 'react-spring';
import useCollapse from '../../hooks/useCollapse';
import { Divider } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const CollapseSection = ({ isOpen = false, title = '', children }) => {
    const { open, setOpen, ref, height } = useCollapse(isOpen);

    return (
        <>
            <div className='collapse-header' onClick={() => setOpen((open) => !open)} role='button'>
                <Divider orientation='left' className='collapse-header-divider'>
                    {title}
                </Divider>
                {open ? <UpOutlined className='collapse-header-icon' /> : <DownOutlined className='collapse-header-icon' />}
            </div>
            <animated.div style={{ height, overflow: 'hidden' }}>
                <div ref={ref} className='collapse-content'>
                    {children}
                </div>
            </animated.div>
        </>
    );
};

export default CollapseSection;
