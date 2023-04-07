import {onPressFeedback} from '@utils/hyperlink';
import React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';

export const FeedbackItem = React.memo(() => {
  return (
    <TouchableWithoutFeedback onPress={onPressFeedback}>
      <View style={styles.feedbackItem}>
        <Image
          style={styles.pin}
          source={require('@assets/Icon/pin/pin.png')}
        />
        <Image
          style={styles.logo}
          source={require('@assets/Image/logo/logo_small.png')}
        />
        <View style={styles.contents}>
          <View style={styles.title}>
            <Text style={styles.titleText}>
              ‘Letters to’ 의 어떤 부분이 개선되면 좋을까요?
            </Text>
          </View>
          <View style={styles.team}>
            <Text style={styles.teamText}>Team Letters To</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  feedbackItem: {
    minHeight: 100,
    borderBottomColor: '#0000cc40',
    borderBottomWidth: 0.5,
    backgroundColor: '#ffffcc',
    paddingHorizontal: 24,
    paddingVertical: 16,
    position: 'relative',
    flexDirection: 'row',
  },
  pin: {
    position: 'absolute',
    top: 18,
    right: 24,
    height: 24,
    width: 24,
  },
  logo: {height: 36, width: 36},
  contents: {marginLeft: 12, marginRight: 24},
  title: {
    height: 36,
    justifyContent: 'center',
    marginRight: 50,
  },
  titleText: {
    fontFamily: 'Galmuri11',
    fontSize: 14,
    color: '#0000cc',
  },
  team: {minHeight: 30, justifyContent: 'center'},
  teamText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000cc',
  },
});
