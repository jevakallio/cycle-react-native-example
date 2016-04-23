import {run} from '@cycle/core';
import {Rx} from 'rx';
import React from 'react-native';
import makeReactNativeDriver from '@cycle/react-native/src/driver';
import ListView from '@cycle/react-native/src/ListView';
import {makeHTTPDriver} from '@cycle/http';
import styles from './styles';

let {StyleSheet, TouchableOpacity, Text, View, ScrollView, Image, AlertIOS} = React;
const URL = 'https://api.github.com/repos/cyclejs/cycle-react-native/stargazers';

export function main({RN, HTTP}) {
  let request$ = Rx.Observable.just({url: URL});
  return {
    RN: model(intent(RN, HTTP)).map(view),
    HTTP: request$
  };
}

function intent(RN, HTTP) {
  let test$ = HTTP
    .filter(res$ => res$.request.url === URL)
    .mergeAll()
    .map(res => {
      let arr = JSON.parse(res.text)
      return arr;
    });

  return {
        increment: RN
          .select('button')
          .events('press')
          .map(ev => +1),
        response: test$
      }
}

function model({increment, response}) {
  let i = increment
    .startWith(0)
    .scan((state, n) => state + n);

  return Rx.Observable.combineLatest(i, response, (i,r) => {
    return {counter: i, test: r}
  });

}

function view({counter, test}) {
  return (
    <ScrollView>
      <Image style={styles.image} source={require("./img/logo.png")} />
      <Text style={styles.header}>RNCycle</Text>
      <Text style={styles.stars}>	★{test.length}</Text>
      <TouchableOpacity selector="button">
        <View style={styles.button}>
          <Text style={styles.buttonText}>{counter}</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.stargazers}>Stargazers</Text>
      <ListView
        items={test}
        renderRow={item => {
          return (
              <Text style={styles.stargazer}>
                {item.login}
              </Text>
          );
        }}
      />
    </ScrollView>
  );
}
