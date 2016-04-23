import React from 'react-native';

const {Animated} = React;

export default function createAnimationDongle(Component) {
  return React.createClass({
    getInitialState() {
      const currentValue = new Animated.Value(
        this.props.initialValue || 0
      );

      return {
        currentValue
      }
    },

    componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.state.currentValue._value) {
        this.runAnimation(nextProps);
      }
    },

    runAnimation({animation, options = {}, value}) {
      animation(this.state.currentValue, {...options,
        toValue: value
      }).start();
    },

    render() {
      const { animate } = this.props;

      const animatedStyle = Object.keys(animate).reduce((acc, key) => {
        return {...acc,
          [key]: this.state.currentValue.interpolate(animate[key])
        }
      }, {});

      const style = {...(this.props.style || {}), ...animatedStyle}

      const extraProps = {
        source: this.props.source
      };

      return (
        <Component style={style} {...extraProps}>
          {this.props.children}
        </Component>
      );
    }
  });
};
