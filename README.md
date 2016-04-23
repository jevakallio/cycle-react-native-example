# Cycle React Native Example


## Quick Start

Start by installing React Native [prerequisites](https://facebook.github.io/react-native/docs/getting-started.html)

Then clone the repository and install dependencies:
```
$ git clone git@github.com:jevakallio/cycle-react-native-example.git
$ cd cycle-react-native
$ npm install
```

### iOS

```
react-native run-ios
```

### Android

```
react-native run-android
```


## Troubleshooting

**Error:** Could not find com.android.support:support-v4:21.0.3.

You're missing a part of the Android SDK, in this case it was the Android Support Repository. Open the SDK manager (`android`) and install the missing package.
