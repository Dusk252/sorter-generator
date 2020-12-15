import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-scroll';

const InfiniteLoader = ({ data, page, pageName, getPage, getNewItems, resetHasMoreCheck, render, ToTopComponent }) => {
    const topLoader = useRef(null);
    const bottomLoader = useRef(null);
    const [hasNew, setHasNew] = useState(false);
    const [toTopVisible, setToTopVisible] = useState(false);
    const [loadingNew, setLoadingNew] = useState(false);

    const handleTopObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting) {
            setHasNew(false);
        }
    };

    const handleBottomObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && page.hasMore) {
            setLoadingNew(false);
            getPage();
        }
    };

    useEffect(() => {
        var options = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        };

        const topObserver = new IntersectionObserver(handleTopObserver, options);
        if (topLoader.current) {
            topObserver.observe(topLoader.current);
        }

        const bottomObserver = new IntersectionObserver(handleBottomObserver, options);
        if (bottomLoader.current) {
            bottomObserver.observe(bottomLoader.current);
        }

        // const getNew = setInterval(() => {
        //     setLoadingNew(true);
        //     getNewItems();
        // }, 120000);

        return () => {
            topObserver.disconnect();
            bottomObserver.disconnect();
            //clearInterval(getNew);
        };
    }, [page]);

    useEffect(() => {
        if (loadingNew) {
            setLoadingNew(false);
            setHasNew(true);
        }
    }, [page.items]);

    useEffect(() => {
        let showTimeout = null;
        if (hasNew)
            showTimeout = setTimeout(() => {
                setToTopVisible(true);
            }, 2000);
        else {
            clearTimeout(showTimeout);
            setToTopVisible(false);
        }
        return () => clearTimeout(showTimeout);
    }, [hasNew]);

    useEffect(() => {
        setLoadingNew(true);
        getNewItems();
        return () => resetHasMoreCheck(pageName);
    }, []);

    return (
        <>
            {toTopVisible ? (
                <Link
                    activeClass='active'
                    to='top'
                    className='infinite-loader-new-button'
                    style={{
                        position: 'fixed',
                        width: '150px',
                        left: 'calc(50% - 75px)',
                        top: '20px'
                    }}
                    spy={true}
                    smooth={true}
                    duration={500}
                >
                    <ToTopComponent />
                </Link>
            ) : (
                <></>
            )}
            <div id='top' ref={topLoader}></div>
            {page && (!page.items || !page.items.length) && page.hasMore ? <></> : render(page.items, data)}
            <div ref={bottomLoader}></div>
        </>
    );
};

export default InfiniteLoader;
