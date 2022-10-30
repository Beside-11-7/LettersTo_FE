import React, {useEffect, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StatusBar, View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Pressable, Image} from 'react-native';
import type {StackParamsList} from '../../types/stackParamList';
import useStore from '../../Store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LinearGradient} from 'expo-linear-gradient';
import {cards} from './CardData.json';
import {Card} from '../../Components/Card';
import {SCREEN_HEIGHT} from '../../constants';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<StackParamsList, 'Home'>;

export function Home({navigation}: Props) {
  const {setIsLoggedIn} = useStore();

  const cardColor = [
    'rgba(255, 68, 204, 0.25)',
    'rgba(140, 117, 255, 0.25)',
    'rgba(255, 224, 68, 0.25)',
    'rgba(193, 255, 68, 0.25)',
    'rgba(68, 239, 255, 0.25)',
    'rgba(140, 117, 255, 0.25)',
  ];
  const cardAngle = [-5, 5, 5, -5, 15, 5];

  function logout() {
    AsyncStorage.removeItem('accessToken');
    AsyncStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
  }

  async function goToMyPage() {
    navigation.navigate('MyPage');
  }

  return (
    <LinearGradient locations={[0, 0.1, 0.8, 1]} colors={['#FFCCEE', '#FFFFFF', '#FFFFFF', '#FFFFCC']} style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* <Text>Home Screen</Text> */}
        {/* <Button title="로그아웃" onPress={logout} /> */}
        {/* <Button title="마이페이지" onPress={goToMyPage} /> */}
        <LinearGradient colors={['rgba(255, 204, 238, 1)', 'rgba(255, 255, 255, 0)']} style={styles.header}>
          <View style={styles.headerInner}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity>
                <Image source={require('../../Assets/alert_off.png')} style={{height: 28, width: 28}} />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity>
                <Image source={require('../../Assets/menu.png')} style={{height: 28, width: 28}} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        <ScrollView style={styles.scrollView}>
          <View style={styles.cardList}>
            {
              cards.map((item, idx) => (
                <Card
                  key={idx}
                  title={item.title}
                  stampId={item.stampId}
                  from={item.fromInfo}
                  topic={item.topic}
                  personality={item.personality}
                  color={cardColor[idx % 6]}
                  style={[
                    idx % 2 === 0 ? {left: '27.7%', marginTop: -36} : {left: '-6.4%', marginTop: -152},
                    {transform: [{ rotate: `${cardAngle[idx % 6]}deg` }]}
                  ]}
                />
              ))
            }
          </View>
        </ScrollView>
        <View style={styles.tabBottom}>
          <View style={styles.tabArea}>
            <TouchableOpacity>
              <View style={styles.tabActive}>
                <Image source={require('../../Assets/triangle.png')} style={[styles.triangle, {right: '100%'}]} />
                <Text style={styles.tabActiveText}>편지탐색</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.tabInactive}>
                <Image source={require('../../Assets/triangle.png')} style={[styles.triangle, {left: 0, transform: [{scaleX: -1}]}]} />
                <Text style={styles.tabInactiveText}>내 사서함</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.floatArea}>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]}>
            <Image source={require('../../Assets/refresh.png')} style={{height: 28, width: 28}} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnSecondary]}>
            <Image source={require('../../Assets/write.png')} style={{height: 28, width: 28}} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {position: 'absolute', zIndex: 10, width: '100%'},
  headerInner: {height: 52, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16},
  tabBottom: {width: '100%', height: 37, backgroundColor: '#0000CC'},
  tabArea: {position: 'absolute', bottom: '100%', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'flex-end'},
  tabActive: {width: 164, height: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0000CC', borderTopLeftRadius: 10, borderTopRightRadius: 10},
  tabInactive: {width: 164, height: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderBottomWidth: 0, borderColor: '#0000CC', borderTopLeftRadius: 10, borderTopRightRadius: 10},
  tabActiveText: {fontFamily: 'Galmuri11', fontSize: 15, color:'#FFFFFF'},
  tabInactiveText: {fontFamily: 'Galmuri11', fontSize: 15, color:'#0000CC'},
  scrollView: {width: '100%'},
  cardList: {paddingTop: 112, paddingBottom: 60},
  floatArea: {position: 'absolute', right: 24, bottom: 100},
  btn: {width: 48, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 8, borderRadius: 24},
  btnPrimary: {backgroundColor: '#0000CC'},
  btnSecondary: {backgroundColor: '#FFFFCC', borderWidth: 1, borderColor: '#0000CC'},
  triangle: {position: 'absolute', bottom: 0, width: 4, height: 5}
});
