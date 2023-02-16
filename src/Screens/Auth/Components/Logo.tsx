import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
const logoImage = require('../../../Assets/logo/logo_main.gif');

export const Logo = React.memo(() => (
  <View style={styles.logo}>
    <Image source={logoImage} style={styles.logoImage} />
  </View>
));

const styles = StyleSheet.create({
  logo: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {height: 220, width: 200},
});
