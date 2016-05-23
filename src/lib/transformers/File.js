/**
 * Created by tushar.mathur on 23/05/16.
 */

'use strict'

const O = require('rx').Observable
const {toBuffer} = require('../utils')

exports.createFileTransformer = ({fs}) => {
  return {
    fsOpen$: O.fromNodeCallback(fs.open),
    fsWrite$: O.fromNodeCallback(fs.write),
    fsTruncate$: O.fromNodeCallback(fs.truncate),
    fsRename$: O.fromNodeCallback(fs.rename),
    fsStat$: O.fromNodeCallback(fs.fstat),
    fsRead$: O.fromNodeCallback(fs.read),

    fsReadBuffer$ ({fd$, buffer$, offset$}) {
      return O
        .combineLatest(fd$, O.zip(buffer$, offset$))
        .flatMap(([fd, [buffer, offset]]) => this.fsRead$(fd, buffer, 0, buffer.length, offset))
    },
    fsWriteBuffer$ ({fd$, buffer$, offset$}) {
      return O
        .combineLatest(fd$, O.zip(buffer$, offset$))
        .flatMap(([fd, [buffer, offset]]) =>
          this.fsWrite$(fd, buffer, 0, buffer.length, offset)
        )
    },
    fsWriteJSON$ ({fd$, json$, offset$}) {
      const buffer$ = json$.map(toBuffer)
      return this.fsWriteBuffer$({fd$, buffer$, offset$})
    },
    fsReadJSON$ ({fd$, buffer$, offset$}) {
      return this
        .fsReadBuffer$({fd$, buffer$, offset$})
        .map(x => JSON.parse(x[1].toString()))
    }
  }
}
