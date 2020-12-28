import React, { useEffect, useRef } from 'react';

const InfiniteLoader = ({ data, page, pageName, getPage, getUpdated, resetHasMoreCheck, render }) => {
    const bottomLoader = useRef(null);

    const handleBottomObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && page.hasMore) {
            getPage();
        }
    };

    useEffect(() => {
        var options = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        };

        const bottomObserver = new IntersectionObserver(handleBottomObserver, options);
        if (bottomLoader.current) {
            bottomObserver.observe(bottomLoader.current);
        }

        return () => bottomObserver.disconnect();
    }, [page]);

    useEffect(() => {
        if (page) {
            if (page.items && page.items.length) getUpdated();
            else getPage();
        }
        return () => resetHasMoreCheck(pageName);
    }, []);

    return (
        <>
            {page && (!page.items || !page.items.length) && page.hasMore ? <></> : render(page.items, data)}
            <div ref={bottomLoader}></div>
        </>
    );
};

export default InfiniteLoader;
