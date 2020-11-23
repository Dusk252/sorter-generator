import React from 'react';
import { connect } from 'react-redux';
import { pageTypes, getPage, resetHasMoreCheck, getNewItems } from '../store/pagination/paginationActions';
import { ArrowUpOutlined } from '@ant-design/icons';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';
import InfiniteLoader from './../components/general/InfiniteLoader';
import SorterListItem from './../components/sorters/SorterListItem';

const ToTopComponent = () => {
    return (
        <>
            New Sorters
            <ArrowUpOutlined style={{ marginLeft: '5px' }} />
        </>
    );
};

const SorterList = ({ sorters, sortersPage, getPage, getNewItems }) => {
    return (
        <LayoutBlockWrapper>
            <div className='sorter-list'>
                <InfiniteLoader
                    data={sorters}
                    page={sortersPage}
                    pageName='sorters'
                    getPage={() => getPage(sortersPage.items.length, sortersPage.lastUpdated, pageTypes.sorters)}
                    getNewItems={() => getNewItems(sortersPage.lastUpdated, pageTypes.sorters)}
                    resetHasMoreCheck={resetHasMoreCheck}
                    ToTopComponent={ToTopComponent}
                    render={(items, data) => items.map((id) => <SorterListItem data={data[id]} key={id} />)}
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
    getPage,
    resetHasMoreCheck,
    getNewItems
};

export default connect(mapStateToProps, mapDispatchToProps)(SorterList);
