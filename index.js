/**
 * Created by tushar.mathur on 21/01/16.
 */

'use strict'

import * as ob from './src/observables'
import Mtd from './src/mtd'

exports.createDownload = (options) => new Mtd(ob, options)
