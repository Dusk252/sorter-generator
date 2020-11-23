import React from 'react';
import { useDispatch } from 'react-redux';
import { changeRoute } from '../../store/app/appActions';

const Link = ({ to, children, ...props }) => {
    const dispatch = useDispatch();

    const handleClick = (e) => {
        if (e.ctrlKey && e.type == 'click') return;
        e.preventDefault();
        e.stopPropagation();
        dispatch(changeRoute(to));
    };
    return (
        <a href={to} onClick={handleClick} {...props}>
            {children}
        </a>
    );
};

export default Link;
