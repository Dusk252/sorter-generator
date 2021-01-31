import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { pageTypes, getPage, getUpdatedItems, resetHasMoreCheck } from '../store/pagination/paginationActions';
import { toggleFavorite } from '../store/users/usersActions';
import BoxWrapper from '../components/general/BoxWrapper';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';
import InfiniteLoader from './../components/general/InfiniteLoader';
import SorterListItem from './../components/sorters/SorterListItem';

const SorterList = ({ sorters, sortersPage, getPage, getUpdatedItems, favorites, toggleFavorite }) => {
    return (
        <>
            <Helmet>
                <title>Sorters</title>
            </Helmet>
            <LayoutBlockWrapper>
                <div className='sorter-list'>
                    <InfiniteLoader
                        data={sorters}
                        page={sortersPage}
                        pageName='sorters'
                        getPage={() => getPage(sortersPage.items.length, sortersPage.lastUpdated, pageTypes.sorters)}
                        getUpdated={() =>
                            getUpdatedItems(sortersPage.items.length, sortersPage.lastUpdated, pageTypes.sorters)
                        }
                        resetHasMoreCheck={resetHasMoreCheck}
                        render={(items, data) =>
                            items && items.length ? (
                                items.map((id) => (
                                    <SorterListItem
                                        data={data[id]}
                                        key={id}
                                        isFavorite={favorites.includes(id)}
                                        toggleFavorite={() => {
                                            toggleFavorite(id);
                                        }}
                                    />
                                ))
                            ) : (
                                <BoxWrapper>
                                    <p>No sorters to be seen here!</p>
                                    <p>Head to "Create Sorters" to create your first one.</p>
                                </BoxWrapper>
                            )
                        }
                    ></InfiniteLoader>
                </div>
            </LayoutBlockWrapper>
        </>
    );
};

const mapStateToProps = (state) => ({
    sortersPage: state.pages.sorters,
    sorters: state.sorters.sorterList,
    favorites: state.auth.currentUser == null ? [] : state.auth.currentUser.favorite_sorters
});

const mapDispatchToProps = {
    getPage,
    getUpdatedItems,
    resetHasMoreCheck,
    toggleFavorite
};

export default connect(mapStateToProps, mapDispatchToProps)(SorterList);
