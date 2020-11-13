import React from 'react';
import { connect } from 'react-redux';
import { pageTypes, getPage, resetHasMoreCheck } from '../store/pagination/paginationActions';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';
import InfiniteLoader from './../components/general/InfiniteLoader';

const UserItem = ({ data }) => {
    data.base_info.profile.username;
};

const UserList = ({ users, usersPage, getPage }) => {
    return (
        <LayoutBlockWrapper>
            <div className='user-list'>
                <InfiniteLoader
                    data={users}
                    page={usersPage}
                    pageName='users'
                    getPage={(page) => getPage(page, pageTypes.users)}
                    resetHasMoreCheck={resetHasMoreCheck}
                    ListItem={UserItem}
                ></InfiniteLoader>
            </div>
        </LayoutBlockWrapper>
    );
};

const mapStateToProps = (state) => ({
    usersPage: state.pages.users,
    users: state.users.userList
});

const mapDispatchToProps = {
    getPage,
    resetHasMoreCheck
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
