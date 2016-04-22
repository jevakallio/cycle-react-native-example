import {Rx, run} from '@cycle/core';
import React from 'react-native';
import makeReactNativeDriver from '@cycle/react-native/src/driver';

let {StyleSheet, TouchableOpacity, Text, View, ScrollView, Image, AlertIOS} = React;

function main({RN}) {
  return {
    RN: model(intent(RN)).map(view)
  };
}

function intent(inputs) {
  return {
    increment: inputs
      .select('button')
      .events('press')
      .map(ev => +1)
  }
}

function model({increment}) {
  return increment
    .startWith(0)
    .scan((state, n) => state + n)
}

function view(state) {
  return (
    <ScrollView>
      <TouchableOpacity selector="button">
        <Text style={styles.button}>
          Increment
        </Text>
      </TouchableOpacity>
      <Text>
        You have clicked the button {state} times.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 100,
    backgroundColor: 'red',
    color: 'white',
    padding: 20
  }
});

run(main, {
  RN: makeReactNativeDriver('RNCycle'),
});
