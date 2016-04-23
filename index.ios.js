import Rx from 'rx';
import {run} from '@cycle/core';
import React from 'react-native';
import makeReactNativeDriver, {getBackHandler} from '@cycle/react-native/src/driver';
import Touchable from '@cycle/react-native/src/Touchable';
import ListView from '@cycle/react-native/src/ListView';
import NavigationStateUtils from 'NavigationStateUtils';

const backActionHandler = getBackHandler();
const onNavigateBack = action => {
  if (action.type === 'back' || action.type === 'BackAction') {
    backActionHandler.send();
  }
}

let {
  Animated,
  Dimensions,
  NavigationExperimental,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  AlertIOS
} = React;

let {
  TouchableOpacity,
  TouchableWithoutFeedback
} = Touchable;

function main({RN}) {
  return {
    RN: model(intent(RN)).map(view)
  };
}

function intent(inputs) {
  return {
    increment: inputs
      .select('increment')
      .events('press')
      .map(ev => {
        return +1;
      }),

    add: inputs
      .select('listitem')
      .events('press'),

    goToSecondView: inputs
      .select('bored')
      .events('press')
      .map(() => ({type: 'push', key: 'Second'})),

    back: inputs
      .navigateBack()
      .map({type: 'back'})
  }
}

function model({increment, add, goToSecondView, back}) {

  // Initial state
  const initialNavigationState = {
    key: 'MainNavigation',
    index: 0,
    children: [
      {key: 'Counter'}
    ]
  };

  const number = increment
    .startWith(0)
    .scan((prev, n) => prev + n);

  const list = add
    .startWith([1])
    .scan((prev, value) => [...prev, value + 1]);

  const navigationState = Rx.Observable.merge(
    goToSecondView,
    back
  )
  .startWith(initialNavigationState)
  .scan((prevState, action) => {
    return action.type === 'back'
      ? NavigationStateUtils.pop(prevState)
      : NavigationStateUtils.push(prevState, action);
  })

  return number.combineLatest(list, navigationState, (number, list, navigationState) =>
    ({number, list, navigationState}));
}

function renderCard(vdom, navigationProps) {
  return (
    <NavigationExperimental.Card
      {...navigationProps}
      key={'View:' + navigationProps.scene.navigationState.key}
      renderScene={() => vdom}
      onNavigate={onNavigateBack}
    />
  );
}

function view(model) {
  return (
    <NavigationExperimental.AnimatedView
      style={{flex: 1}}
      navigationState={model.navigationState}
      onNavigate={onNavigateBack}
      renderScene={(navigationProps) => {
        const key = navigationProps.scene.navigationState.key;
        switch (key) {
          case 'Counter':
            return renderCard(Counter(model), navigationProps);
          case 'Second':
            return renderCard(Second(model), navigationProps);
          default:
            console.error('Unexpected view', navigationProps, key);
            return renderCard(<Text>Everything is fucked</Text>, navigationProps);
        }
      }}
      renderOverlay={(props) => {
        return (
          <NavigationExperimental.Header
            {...props}
          />
        );
      }}
    />
  );
}

function Second(model) {
  return (
    <ScrollView style={styles.container}>
      <Text>{`Hello world! Counter was ${model.number}`}</Text>
      <Image source={{
        uri: 'http://49.media.tumblr.com/1db4a8e1ca5078c083be764fff512c5d/tumblr_n3wqbrrbqz1sulbzio1_400.gif',
        width: Dimensions.get('window').width - 40,
        height: Dimensions.get('window').width - 40
      }} />
    </ScrollView>
  )
}

function Counter(model) {
  const animatedStyle = {
    opacity: true,
    width: {
      inputRange: [0, 1],
      outputRange: [0, 300]
    }
  }

  return (
    <ScrollView style={styles.container}>

      <TouchableOpacity selector="increment">
        <Text style={styles.button}>
          Increment
        </Text>
      </TouchableOpacity>

      <Text>
        You have clicked the button {model.number} times.
      </Text>

      <TouchableOpacity selector="bored">
        <Text style={styles.button}>
          {`I'm bored`}
        </Text>
      </TouchableOpacity>

      <ListView
        items={model.list}
        renderRow={item => {
          return (
            <TouchableWithoutFeedback selector='listitem' payload={item + 10}>
              <Text style={styles.listItem}>
                Item #{item}
              </Text>
            </TouchableWithoutFeedback>
          );
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 64,
    flex: 1,
    padding: 20
  },
  listItem: {
    padding: 10
  },
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
