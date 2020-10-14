import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUsersPage, resetHasMoreCheck } from '../store/pagination/paginationActions';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';

const UserList = ({ users, usersPage, getUsersPage }) => {
    const loader = useRef(null);

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && usersPage.hasMore) {
            getUsersPage(usersPage.currentPage + 1);
        }
    };

    useEffect(() => {
        var options = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        };

        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) {
            observer.observe(loader.current);
        }
    }, [usersPage]);

    useEffect(() => {
        return () => resetHasMoreCheck('users');
    }, []);

    return (
        <LayoutBlockWrapper>
            <div className='userList'>
                {usersPage.items.map((userId) => {
                    return <div key={userId}>{users[userId].baseInfo.profile.username}</div>;
                })}
                <div ref={loader}></div>
            </div>
        </LayoutBlockWrapper>
    );
};

const mapStateToProps = (state) => ({
    usersPage: state.pages.users,
    users: state.users.userList
});

const mapDispatchToProps = {
    getUsersPage,
    resetHasMoreCheck
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
