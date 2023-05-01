import {useFeedbackAction} from '@stores/feedback';
import {onPressFeedback} from '@utils/hyperlink';
import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

const nextImg = require('@assets/Icon/next/next_white.png');

const FEEDBACK_BUTTON_TEXT = {
  HOME: '‘Letters to’ 의 어떤 부분이 개선되면 좋을까요? 의견을 남겨주세요!',
  SIMPLE: '‘Letters to’에게 피드백을 남겨주세요!',
};

type Props = {
  screenName: 'HOME' | 'LETTERBOX' | 'MYPAGE';
};

export const FeedbackButton = React.memo(({screenName}: Props) => {
  const {clearFeedbackButtonOnHome, clearFeedbackButtonOnLetterBox} =
    useFeedbackAction();

  const buttonOpacity = useRef(new Animated.Value(1)).current;

  const buttonFadeOut = Animated.timing(buttonOpacity, {
    toValue: 0,
    duration: 1000,
    delay: 4000,
    useNativeDriver: true,
  });

  useEffect(() => {
    if (screenName === 'HOME' || screenName === 'LETTERBOX') {
      buttonFadeOut.start(result => {
        if (result.finished) {
          if (screenName === 'HOME') {
            clearFeedbackButtonOnHome();
          } else if (screenName === 'LETTERBOX') {
            clearFeedbackButtonOnLetterBox();
          }
        }
      });
    }
  }, [
    buttonFadeOut,
    clearFeedbackButtonOnHome,
    clearFeedbackButtonOnLetterBox,
    screenName,
  ]);

  return (
    <TouchableWithoutFeedback onPress={onPressFeedback}>
      <Animated.View
        style={[
          styles.feedbackButton,
          screenName === 'HOME'
            ? styles.feedbackButton_Home
            : styles.feedbackButton_Simple,
          {
            opacity: buttonOpacity,
          },
        ]}>
        <Text style={styles.feedbackButtonText}>
          {screenName === 'HOME'
            ? FEEDBACK_BUTTON_TEXT.HOME
            : FEEDBACK_BUTTON_TEXT.SIMPLE}
        </Text>
        <Image source={nextImg} style={styles.next} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  feedbackButton: {
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  feedbackButton_Home: {
    backgroundColor: '#0000cc',
  },
  feedbackButton_Simple: {
    backgroundColor: '#ff44cc',
  },
  feedbackButtonText: {
    color: 'white',
    fontFamily: 'Galmuri11',
    fontSize: 14,
    flexShrink: 1,
    marginRight: 45,
  },
  next: {height: 24, width: 24},
});
