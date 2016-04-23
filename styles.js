import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  profile: {
    flex: 1,
    alignItems: 'center'
  },
  profileTitle: {
    padding: 20,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold'
  },
  container: {
    backgroundColor: 'white',
    marginTop: 64,
    flex: 1,
    padding: 20
  },
  image: {
    margin: 0,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center'
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
  },
  stars: {
    color: 'rgb(255, 222, 0)',
    fontSize: 30,
    textAlign: 'center'
  },
  button: {
    marginTop: 100,
    backgroundColor: 'green',
    padding: 20,
    flexDirection: 'column',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 20,
    color: 'white'
  },
  huge: {
    fontSize: 30
  },
  presses: {
    marginTop: 60,
    textAlign: 'center'
  },
  stargazers: {
    fontSize: 30,
    marginTop: 30
  },
  stargazer: {
    fontSize: 20,
    padding: 15
  }
});
