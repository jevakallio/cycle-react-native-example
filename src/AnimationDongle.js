import React from 'react-native';

import createAnimationDongle from './createAnimationDongle';

const {Animated} = React;

export default {
  View: createAnimationDongle(Animated.View),
  Text: createAnimationDongle(Animated.Text),
  Image: createAnimationDongle(Animated.Image)
};
