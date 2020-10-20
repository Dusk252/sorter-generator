import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSortersPage, resetHasMoreCheck } from '../store/pagination/paginationActions';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';
import InfiniteLoader from './../components/general/InfiniteLoader';
import SorterListItem from './../components/sorters/SorterListItem';

const SorterList = ({ sorters, sortersPage, getSortersPage }) => {
    return (
        <LayoutBlockWrapper>
            <div className='sorter-list'>
                <InfiniteLoader
                    data={sorters}
                    page={sortersPage}
                    pageName='sorters'
                    getPage={getSortersPage}
                    resetHasMoreCheck={resetHasMoreCheck}
                    ListItem={SorterListItem}
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
