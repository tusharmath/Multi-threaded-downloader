/**
 * Created by tushar.mathur on 11/10/15.
 */

'use strict'

/**
 * Created by tushar.mathur on 08/09/15.
 */

const {BehaviorSubject} = require('rx')
const Immutable = require('immutable')

class Action {
  dispatch (params) {
    actionStream.onNext({action: this, params})
  }

  get observable () {
    return paramsStream(this)
  }
}

// Helpers
const updateStore = (path, value) => UPDATE_STORE.dispatch({path, value})
const selector = (x, store) => ({path: x.path, store, value: x.value})
const setIn = x => x.store.setIn(x.path, x.value)
const getIn = x => x.store.getIn(x.path)
const createAction = () => new Action()
const withStore = (action) => paramsStream(action).withLatestFrom(storeStream, selector)

export const INIT = createAction()
export const UPDATE_STORE = createAction()
export const STORE_UPDATED = createAction()
export const TOGGLE_STORE = createAction()
export const INCREMENT_STORE = createAction()
export const DECREMENT_STORE = createAction()

export const actionStream = new BehaviorSubject({action: INIT, params: {}})
export const storeStream = new BehaviorSubject(Immutable.Map({}))
export const paramsStream = (action) => actionStream.filter(x => x.action === action).pluck('params')

// Global ACTION Subscribers
storeStream.subscribe(store => STORE_UPDATED.dispatch({store}))
withStore(UPDATE_STORE).map(setIn).distinctUntilChanged().subscribe(x => storeStream.onNext(x))
withStore(TOGGLE_STORE).subscribe(x => updateStore(x.path, !getIn(x)))
withStore(INCREMENT_STORE).subscribe(x => updateStore(x.path, getIn(x) + 1))
withStore(DECREMENT_STORE).subscribe(x => updateStore(x.path, getIn(x) - 1))
