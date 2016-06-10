/**
 * Created by tushar.mathur on 10/06/16.
 */

'use strict'

import R from 'ramda'
export const map = R.curry((func, $) => $.map(func))
export const withLatestFrom = R.curry((list, $) => $.withLatestFrom(...list))
export const zip = R.curry((list, $) => $.zip(...list))
export const filter = R.curry((func, $) => $.filter(func))
export const distinctUntilChanged = $ => $.distinctUntilChanged()
export const pluck = R.curry((path, $) => $.pluck(path))
export const scan = R.curry((func, $) => $.scan(func))
export const shareReplay = R.curry((count, $) => $.shareReplay(count))
