import axios from 'axios';

export const FETCH_ARTICLES = 'fetch_articles';

export const fetchArticles = source => async dispatch => {
    let url;
    if (source) {
        url = `https://newsapi.org/v2/top-headlines?sources=`;
    } else {
        url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=`;
    }

    const res = await axios.get(url);

    dispatch({
        type: FETCH_ARTICLES,
        payload: res.data.articles
    });
};