/**
 * Created by tushar.mathur on 23/05/16.
 */

'use strict'

exports.createHttpExecutor = () => {
  return {
    destroy (request$) {
      request$.subscribe(request => request.destroy())
    }
  }
}

