import React from 'react';
import { Typography } from 'antd';

const BoxWrapper = ({ id, className, title, titleAlign = 'center', children }) => {
    return (
        <section id={id} className={`box-wrapper ${className}`}>
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
