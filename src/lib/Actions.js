/**
 * Created by tushar.mathur on 11/10/15.
 */

'use strict'

/**
 * Created by tushar.mathur on 08/09/15.
 */

const {BehaviorSubject} = require('rx')
const {fromJS, Map} = require('immutable')
const {ary} = require('lodash')

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
const oOrOnNext = x => storeStream.onNext(x)

// Standard
const INIT = createAction()
const UPDATE_STORE = createAction()
const INIT_STORE = createAction()
const STORE_UPDATED = createAction()
const TOGGLE_STORE = createAction()
const INCREMENT_STORE = createAction()
const DECREMENT_STORE = createAction()

// Custom
const DATA_RCVD = createAction()
const DATA_SAVED = createAction()

const actionStream = new BehaviorSubject({action: INIT, params: {}})
const storeStream = new BehaviorSubject(Map({}))
const paramsStream = (action) => actionStream.filter(x => x.action === action).pluck('params')

// Global ACTION Subscribers
storeStream.subscribe(store => STORE_UPDATED.dispatch(store))

paramsStream(INIT_STORE).map(fromJS).subscribe(oOrOnNext)
withStore(UPDATE_STORE).map(setIn).distinctUntilChanged().subscribe(oOrOnNext)
withStore(TOGGLE_STORE).subscribe(x => updateStore(x.path, !getIn(x)))
withStore(INCREMENT_STORE).subscribe(x => updateStore(x.path, getIn(x) + 1))
withStore(DECREMENT_STORE).subscribe(x => updateStore(x.path, getIn(x) - 1))

module.exports = {
  INIT,
  UPDATE_STORE,
  INIT_STORE,
  STORE_UPDATED,
  TOGGLE_STORE,
  INCREMENT_STORE,
  DECREMENT_STORE,
  DATA_RCVD,
  DATA_SAVED
}
