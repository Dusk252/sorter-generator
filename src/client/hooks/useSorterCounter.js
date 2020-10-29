import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { incrementViewCount, incrementTakeCount } from './../store/sorters/sortersActions';

export default function useSorterCounter(sorterId, type) {
    const dispatch = useDispatch();

    useEffect(() => {
        switch (type) {
            case 'VIEW':
                dispatch(incrementViewCount(sorterId));
            case 'TAKE':
                dispatch(incrementTakeCount(sorterId));
            // case 'FAVORITE':
            //     dispatch(toggleFavorite(sorterId));
        }
    }, []);
}
