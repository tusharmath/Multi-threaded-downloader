/**
 * Created by tushar.mathur on 10/06/16.
 */

'use strict'

import R from 'ramda'
import {Observable as O} from 'rx'
export const map = R.curry((func, $) => $.map(func))
export const flatMap = R.curry((func, $) => $.flatMap(func))
export const withLatestFrom = R.curry((list, $) => $.withLatestFrom(...list))
export const zip = R.curry((list, $) => $.zip(...list))
export const zipWith = R.curry((func, list, $) => $.zip(...list, func))
export const filter = R.curry((func, $) => $.filter(func))
export const distinctUntilChanged = $ => $.distinctUntilChanged()
export const pluck = R.curry((path, $) => $.pluck(path))
export const scan = R.curry((func, $) => $.scan(func))
export const scanWith = R.curry((func, m, $) => $.scan(func, m))
export const shareReplay = R.curry((count, $) => $.shareReplay(count))
export const repeat = R.curry((value, count) => O.repeat(value, count))
export const trace = R.curry((msg, $) => $.tap(x => console.log(msg, x)))
export const tap = R.curry((func, $) => $.tap(func))
export const share = ($) => $.share()
export const partition = R.curry((func, $) => $.partition(func))
export const first = $ => $.first()
export const subscribe = R.curry((observer, $) => $.subscribe(observer))
export const sample = R.curry((a$$, b$) => b$.withLatestFrom(...a$$).map(R.tail))
