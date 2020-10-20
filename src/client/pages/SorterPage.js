import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSorter } from '../store/sorters/sortersActions';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';
import Sorter from './../components/sorters/Sorter';

const SorterPage = ({ sorters, getSorter, match }) => {
    const sorterId = match.params.id;
    const [sorter, setSorter] = useState();
    useEffect(() => {
        if (sorters[sorterId] && sorters[sorterId].extended_info) setSorter(sorters[sorterId]);
        else getSorter(sorterId);
    }, [sorters]);
    return (
        sorter != null && (
            <LayoutBlockWrapper>
                <Sorter characters={sorter.extended_info.characters} />
            </LayoutBlockWrapper>
        )
    );
};

const mapStateToProps = (state) => ({
    sorters: state.sorters.sorterList
});

const mapDispatchToProps = {
    getSorter
};

export default connect(mapStateToProps, mapDispatchToProps)(SorterPage);
