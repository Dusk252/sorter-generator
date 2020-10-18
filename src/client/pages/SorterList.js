import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSortersPage, resetHasMoreCheck } from '../store/pagination/paginationActions';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';
import InfiniteLoader from './../components/general/InfiniteLoader';

const SorterItem = ({ data }) => data.baseInfo.name;

const SorterList = ({ sorters, sortersPage, getSortersPage }) => {
    console.log(sorters);
    return (
        <LayoutBlockWrapper>
            <div className='userList'>
                <InfiniteLoader
                    data={sorters}
                    page={sortersPage}
                    pageName='sorters'
                    getPage={getSortersPage}
                    resetHasMoreCheck={resetHasMoreCheck}
                    ListItem={SorterItem}
                ></InfiniteLoader>
            </div>
        </LayoutBlockWrapper>
    );
};

const mapStateToProps = (state) => ({
    sortersPage: state.pages.sorters,
    sorters: state.sorters.sorterList
});

const mapDispatchToProps = {
    getSortersPage,
    resetHasMoreCheck
};

export default connect(mapStateToProps, mapDispatchToProps)(SorterList);
