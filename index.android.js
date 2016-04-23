import {run} from '@cycle/core';
import makeReactNativeDriver from '@cycle/react-native/src/driver';
import {makeHTTPDriver} from '@cycle/http';
import {main} from './common'

run(main, {
  RN: makeReactNativeDriver('RNCycle'),
  HTTP: makeHTTPDriver()
});
