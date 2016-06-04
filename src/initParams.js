import _ from 'lodash'
const defaultOptions = {range: 3}

export default (options) => _.defaults(
    options,
    defaultOptions,
    {mtdPath: options.path + '.mtd'}
)
