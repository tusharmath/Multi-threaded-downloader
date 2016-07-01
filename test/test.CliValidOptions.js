/**
 * Created by tushar.mathur on 01/07/16.
 */

'use strict'

import test from 'ava'
import {CliValidOptions} from '../src/Utils'

test(t => {
  t.true(CliValidOptions({file: '/home'}))
  t.true(CliValidOptions({url: 'http://ab.com'}))
  t.false(CliValidOptions({xyz: 'xyz'}))
})
