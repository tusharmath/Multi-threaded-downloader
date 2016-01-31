const _ = require('lodash')
const defaultOptions = {range: 3}

module.exports = options => _.defaults(
    options,
    defaultOptions,
    {mtdPath: options.path + '.mtd'}
)
