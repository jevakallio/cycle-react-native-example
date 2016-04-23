import {Rx, run} from '@cycle/core';
import React from 'react-native';
import makeReactNativeDriver from '@cycle/react-native/src/driver';
import AnimationDongle from './src/AnimationDongle';

let {Animated, StyleSheet, TouchableOpacity, Text, View, ScrollView, Image, AlertIOS, Dimensions} = React;

let windowWidth = Dimensions.get('window').width;

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
      <AnimationDongle.Image
        animation={Animated.spring}
        initialValue={0}
        value={(state % 2 === 0) ? 0 : 1}
        animate={{
          height: {
            inputRange: [0, 1],
            outputRange: [100, windowWidth]
          },
          width: {
            inputRange: [0, 1],
            outputRange: [100, windowWidth]
          }
        }}
        source={{uri: "http://i.imgur.com/spJ0lss.jpg"}}
      >
      </AnimationDongle.Image>
      <AnimationDongle.Text
        animation={Animated.spring}
        initialValue={0}
        value={(state % 2 === 0) ? 0 : 1}
        animate={{
          fontSize: {
            inputRange: [0, 1],
            outputRange: [10, 30]
          }
        }}
      >
        Whoa!!!
      </AnimationDongle.Text>
      <AnimationDongle.View
        animation={Animated.timing}
        options={{
          duration: 250
        }}
        initialValue={0}
        value={(state % 2 === 0) ? 0 : 1}
        style={{
          backgroundColor: "red",
          height: 32
        }}
        animate={{
          opacity: {
            inputRange: [0, 1],
            outputRange: [0, 1]
          },
          width: {
            inputRange: [0, 1],
            outputRange: [100, windowWidth]
          }
        }}
      >
        <Text>Whoa!!!</Text>
      </AnimationDongle.View>
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
