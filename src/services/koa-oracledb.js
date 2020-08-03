const oracledb = require('oracledb');
const debug = require('debug')('koa-oracle');

module.exports = KoaOracle;

/**
 * Constructor
 * @param poolAttr pool attrs (https://github.com/oracle/node-oracledb/blob/master/doc/api.md#createpool)
 */
function KoaOracle(poolAttrs) {
    this.attrs = poolAttrs;
    
    if (!this.attrs.poolAlias)
        this.attrs.poolAlias = 'default';

    oracledb.createPool(this.attrs)
        .then(() => debug('Pool Created: %s', this.attrs.poolAlias))
        .catch(err => debug('Error: %s', err.message));
}

/**
 * Creates the db connection and set it into the ctx.db variable.
 * The connection is closed after all next() calls are returned.
 */
KoaOracle.prototype.middleware = function () {
    var poolAlias = this.attrs.poolAlias;    
    return async function (ctx, next) {
        try {
            ctx.db = await oracledb.getConnection(poolAlias);
            debug('Connection Aquired: %s', poolAlias);
            await next();
        } catch (err) {
            debug('Error: %s', err.message);
            throw err;
        } finally {
            if (ctx.db) {
                try{
                    await ctx.db.close();
                    debug('Connection Closed');
                } catch(err){
                    debug('Error: %s', err.message);
                }
            }
        }
    };
};
