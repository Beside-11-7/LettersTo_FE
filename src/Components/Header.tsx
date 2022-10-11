import * as React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {StackParamsList} from '../types';

type Props = {
  navigation: NativeStackNavigationProp<StackParamsList, keyof StackParamsList>;
  title: string;
};

export function Header({navigation, title}: Props) {
  function goback() {
    navigation.pop();
  }

  return (
    <View style={styles.headerWrap}>
      <TouchableWithoutFeedback onPress={() => goback()}>
        <View style={styles.backButton}>
          <Text style={styles.backButtonText}>{' < '}</Text>
        </View>
      </TouchableWithoutFeedback>
      <Text>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    height: 52,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 10,
    width: 40,
  },
  backButtonText: {
    fontFamily: 'Galmuri11',
    fontSize: 35,
  },
});
