const keyMirror = require('keyMirror');

export const MESSAGES = keyMirror({
    REQUEST_START: null,
    REQUEST_END: null
});

export const startRequest = () => ({ type: MESSAGES.REQUEST_START });
export const endRequest = () => ({ type: MESSAGES.REQUEST_END });
