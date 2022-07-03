const NodeCache = require( "node-cache" );
const memCache = new NodeCache({ stdTTL: 30, checkperiod: 40 });

export default memCache;