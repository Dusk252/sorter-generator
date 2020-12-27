import { useState, useEffect, createRef } from 'react';

export default function useSorterResult(sorters, results, resultId, getSorterResult, getSorter, getSorterVersion) {
    const [sorter, setSorter] = useState();
    const [result, setResult] = useState();
    const [elRefs, setElRefs] = useState();

    useEffect(() => {
        if (resultId) {
            if (results[resultId] && results[resultId].results) {
                setResult(results[resultId]);
            } else getSorterResult(resultId);
        }
    }, [results, resultId]);
    useEffect(() => {
        if (result) {
            if (!sorters[result.sorter_id]) getSorter(result.sorter_id, true, result.version_id);
            else {
                const version = sorters[result.sorter_id].info.find((el) => el.version_id === result.sorter_version_id);
                if (version && version.items && version.groups) {
                    setSorter(version);
                    setElRefs(version.items.map(() => createRef()));
                } else getSorterVersion(result.sorter_id, result.sorter_version_id);
            }
        }
    }, [result, sorters]);

    return [sorter, result, elRefs];
}
