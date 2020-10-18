import React, { useEffect, useRef } from 'react';

const InfiniteLoader = ({ data, page, pageName, getPage, resetHasMoreCheck, ListItem }) => {
    const loader = useRef(null);

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && page.hasMore) {
            getPage(page.currentPage + 1);
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
    }, [page]);

    useEffect(() => {
        return () => resetHasMoreCheck(pageName);
    }, []);

    return (
        <>
            {page.items.map((id) => {
                return <div key={id}>{<ListItem data={data[id]}></ListItem>}</div>;
            })}
            <div ref={loader}></div>
        </>
    );
};

export default InfiniteLoader;
