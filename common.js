import {run} from '@cycle/core';
import {Rx} from 'rx';
import React from 'react-native';
import makeReactNativeDriver, {getBackHandler} from '@cycle/react-native/src/driver';
import Touchable from '@cycle/react-native/src/Touchable';
import ListView from '@cycle/react-native/src/ListView';
import {makeHTTPDriver} from '@cycle/http';
import NavigationStateUtils from 'NavigationStateUtils';
import styles from './styles';

const URL = 'https://api.github.com/repos/cyclejs/cycle-react-native/stargazers';

const onNavigateBack = action => {
  const backActionHandler = getBackHandler();
  if (action.type === 'back' || action.type === 'BackAction') {
    backActionHandler.send();
  }
}

const {
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

const {
  TouchableOpacity,
  TouchableWithoutFeedback
} = Touchable;

export function main({RN, HTTP}) {
  let request$ = Rx.Observable.just({url: URL});
  return {
    RN: model(intent(RN, HTTP)).map(view),
    HTTP: request$
  };
}

function intent(RN, HTTP) {
  let httpResponse$ = HTTP
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

    response: httpResponse$,

    goToSecondView: RN
      .select('listitem')
      .events('press')
      .map(profile => ({
        type: 'push',
        key: 'Profile',
        data: profile
      })),

    goToThirdView: RN
      .select('fractal')
      .events('press')
      .map(profile => ({
        type: 'push',
        key: 'Fractal'
      })),

    back: RN
      .navigateBack()
      .map({type: 'back'})
  }
}

function model({increment, response, goToSecondView, goToThirdView, back}) {

  // Initial state
  const initialNavigationState = {
    key: 'MainNavigation',
    index: 0,
    title: 'Cycle Native',
    children: [
      {key: 'Counter'}
    ]
  };

  const counter = increment
    .startWith(0)
    .scan((state, n) => state + n);


  const selectedProfile = goToSecondView
    .startWith({data: {}})
    .map(({data}) => data);

  const navigationState = Rx.Observable.merge(
    goToSecondView,
    goToThirdView,
    back
  )
    .startWith(initialNavigationState)
    .scan((prevState, action) => {
      return action.type === 'back'
        ? NavigationStateUtils.pop(prevState)
        : NavigationStateUtils.push(prevState, action)
    })

  return Rx.Observable.combineLatest(counter, response, navigationState, selectedProfile,
    (counter, response, navigationState, selectedProfile) => ({
      counter,
      response,
      navigationState,
      selectedProfile
    }));

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

function renderButton(selector, text) {
  return (
    <TouchableOpacity selector={selector}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}

function view(model) {
  return (
    <NavigationExperimental.AnimatedView
      style={{flex: 1}}
      navigationState={model.navigationState}
      onNavigate={onNavigateBack}
      renderScene={(navigationProps) => {
        const key = navigationProps.scene.navigationState.key;
        console.log('navigationProps', navigationProps);
        switch (key) {
          case 'Counter':
            return renderCard(CounterView(model), navigationProps);
          case 'Profile':
            return renderCard(ProfileView(model), navigationProps);
          case 'Fractal':
            return renderCard(FractalArchitectureExampleView(model), navigationProps);
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

function CounterView({counter, response}) {
  return (
    <ScrollView style={styles.container}>
      <Image style={styles.image} source={require("./img/logo.png")} />
      <Text style={styles.header}>RNCycle</Text>
      <Text style={styles.stars}>	★{response.length}</Text>

      {renderButton('button', counter)}

      <Text style={styles.stargazers}>Stargazers</Text>
      <ListView
        items={response}
        renderRow={item => {
          return (
            <TouchableOpacity selector='listitem' payload={item}>
              <Text style={styles.stargazer}>
                ★ {item.login}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </ScrollView>
  );
}

function ProfileView({selectedProfile}) {
  console.log(selectedProfile);
  const size = Dimensions.get('window').width / 2;
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profile}>
        <Image
          style={{
            borderRadius: size / 2
          }}
          source={{
            //uri: 'http://49.media.tumblr.com/1db4a8e1ca5078c083be764fff512c5d/tumblr_n3wqbrrbqz1sulbzio1_400.gif',
            uri: selectedProfile.avatar_url,
            width: size,
            height: size
          }}
        />
      </View>
      <Text style={styles.profileTitle}>{selectedProfile.login}</Text>
      {renderButton('fractal', 'Fractal architecture example')}
    </ScrollView>
  )
}

function FractalArchitectureExampleView(model) {
  const size = Dimensions.get('window').width;
  return (
    <View style={styles.fractal}>
      <Image
        source={{
          uri: 'http://49.media.tumblr.com/1db4a8e1ca5078c083be764fff512c5d/tumblr_n3wqbrrbqz1sulbzio1_400.gif',
          width: size,
          height: size
        }}
      />
      <Image
        source={{
          uri: 'http://49.media.tumblr.com/1db4a8e1ca5078c083be764fff512c5d/tumblr_n3wqbrrbqz1sulbzio1_400.gif',
          width: size,
          height: size
        }}
      />
    </View>
  );
}
