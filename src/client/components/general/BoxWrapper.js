import React from 'react';
import { Typography } from 'antd';

const BoxWrapper = ({ id, className, title, titleAlign = 'center', children, style }) => {
    return (
        <section id={id} className={`box-wrapper ${className}`} style={style}>
            {title != null && (
                <header className='box-wrapper-header'>
                    <Typography.Title level={2} style={{ textAlign: titleAlign }}>
                        {title}
                    </Typography.Title>
                </header>
            )}
            {children}
        </section>
    );
};

export default BoxWrapper;
