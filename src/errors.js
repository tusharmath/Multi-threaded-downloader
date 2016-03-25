/**
 * Created by tushar.mathur on 25/03/16.
 */

'use strict'

class MTDError extends Error {
  constructor (message) {
    super(message)
  }
}

const e = module.exports = (err) => new MTDError(err)
e.FILE_SIZE_UNKNOWN = 'File size could not be determined'
e.MTDError = MTDError
