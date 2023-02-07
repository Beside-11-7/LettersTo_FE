import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  ImageBackground,
  Animated,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import type {StackParamsList} from '../../types/stackParamList';
import {LinearGradient} from 'expo-linear-gradient';
import {Header} from '../../Components/Headers/Header';
import {SCREEN_HEIGHT} from '../../Constants/screen';
import {useLocation} from '../../Hooks/UserInfo/useLocation';
import {SignUpButton} from '../../Components/Button/Bottom/SignUpButton';
import {useAuthAction, useAuthStore} from '../../Store/auth';
import {useMutation} from 'react-query';
import {signUp} from '../../APIs/member';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from '../../Components/Toast/toast';

type Props = NativeStackScreenProps<StackParamsList, 'LocationForm'>;

export function LocationForm({navigation}: Props) {
  const [openRegion, setOpenRegion] = useState(false);
  const [openCity, setOpenCity] = useState(false);

  const {
    regions,
    selectedRegionId,
    setSelectedRegionId,
    cities,
    selectedCityId,
    setSelectedCityId,
    noticeOpacity,
    onStartNotice,
    disable,
  } = useLocation();

  const {setGeolocationIdInRegisterInfo, startLoading} = useAuthAction();
  const registerInfo = useAuthStore(state => state.registerInfo);

  useEffect(() => {
    if (selectedRegionId && selectedCityId) {
      setGeolocationIdInRegisterInfo(selectedCityId);
    }
  }, [selectedRegionId, selectedCityId, setGeolocationIdInRegisterInfo]);

  const {mutate: mutateSignUp, isLoading} = useMutation(
    ['signup', selectedCityId],
    async () => {
      console.log(registerInfo);
      if (
        !registerInfo.nickname ||
        !registerInfo.topicIds.length ||
        !registerInfo.personalityIds.length ||
        !registerInfo.geolocationId
      ) {
        throw new Error('회원가입 정보 유실');
      }

      const {accessToken, refreshToken} = await signUp(registerInfo);
      if (!accessToken || !refreshToken) {
        throw new Error('회원가입 실패');
      }

      await Promise.all([
        AsyncStorage.setItem('accessToken', accessToken),
        AsyncStorage.setItem('refreshToken', refreshToken),
      ]);

      startLoading();
    },
  );

  const onPressSignUp = async () => {
    if (isLoading) {
      return Toast.show('처리중이에요!');
    }

    mutateSignUp();
  };

  return (
    <LinearGradient colors={['#ffccee', 'white', 'white', 'white', '#ffffcc']}>
      <SafeAreaView
        style={
          Platform.OS === 'android'
            ? styles.container_android
            : styles.container_ios
        }>
        <Header navigation={navigation} title={''} />
        <View style={styles.titleBox}>
          <View style={styles.titleWrap}>
            <Text style={styles.titleText}>편지를 받을 지역을</Text>
            <View style={styles.counterWrap}>
              <Text style={styles.titleText}>선택해주세요</Text>
              <TouchableWithoutFeedback onPress={onStartNotice}>
                <Image
                  style={styles.noticeButtonImage}
                  source={require('../../Assets/notice.png')}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
          <Animated.View
            style={[
              Platform.OS === 'ios' ? styles.notice_ios : styles.notice_android,
              {
                opacity: noticeOpacity,
              },
            ]}>
            <ImageBackground
              style={styles.noticeBGImage}
              source={require('../../Assets/noticeBalloon.png')}>
              <Text style={styles.noticeText}>
                편지를 배달하는 시간을 계산하기 위해 사용돼요!
              </Text>
            </ImageBackground>
          </Animated.View>
        </View>

        <View style={styles.locationWrap}>
          <View style={styles.regionBox}>
            <DropDownPicker
              open={openRegion}
              value={selectedRegionId}
              items={regions}
              setOpen={setOpenRegion}
              setValue={setSelectedRegionId}
              autoScroll={true}
              placeholder="시 · 도 선택"
              zIndex={2}
              style={styles.picker}
              textStyle={styles.pickerText}
            />
          </View>
          {((Platform.OS === 'ios' && !openRegion) ||
            Platform.OS === 'android') && (
            <View>
              <DropDownPicker
                disabled={!selectedRegionId}
                open={openCity}
                value={selectedCityId}
                items={cities}
                setOpen={setOpenCity}
                setValue={setSelectedCityId}
                autoScroll={true}
                placeholder="군 · 구 선택"
                zIndex={1}
                style={styles.picker}
                textStyle={styles.pickerText}
              />
            </View>
          )}
        </View>
        {/* <SignUpButton1 disableSignUp={disable} /> */}
        <SignUpButton disable={disable} onPress={onPressSignUp} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container_ios: {height: SCREEN_HEIGHT},
  container_android: {height: SCREEN_HEIGHT, paddingVertical: 15},
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    position: 'relative',
  },
  titleWrap: {
    height: 100,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    fontFamily: 'Galmuri11',
    color: '#0000cc',
    marginTop: 8,
  },
  counterWrap: {flexDirection: 'row', alignItems: 'center'},
  noticeButtonImage: {marginLeft: 3, height: 20, width: 20},
  notice_ios: {
    position: 'absolute',
    bottom: -7,
    left: 27,
    width: 288,
    height: 35,
    zIndex: 100,
  },
  notice_android: {
    position: 'absolute',
    bottom: -10,
    left: 18,
    width: 288,
    height: 35,
    zIndex: 100,
  },
  noticeBGImage: {
    width: 288,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#0000cc',
  },
  locationWrap: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 15,
  },
  regionBox: {
    marginBottom: 12,
    // zIndex: 2,
  },
  cityBox: {
    // zIndex: 1,
  },
  picker: {
    borderRadius: 10,
    borderColor: '#0000cc',
  },
  pickerText: {
    fontFamily: 'Galmuri11',
    color: '#0000cc',
  },
});
