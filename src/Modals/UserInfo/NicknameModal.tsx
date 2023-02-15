import React from 'react';
import {
  Pressable,
  Text,
  View,
  Modal,
  StyleSheet,
  TextInput,
  Image,
  Animated,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation, useQueryClient} from 'react-query';
import {patchUserInfo} from '../../APIs/member';
import {BottomButton} from '../../Components/Button/Bottom/BottomButton';
import Toast from '../../Components/Toast/toast';
import {useKeyboard} from '../../Hooks/Hardware/useKeyboard';
import {useNickname} from '../../Hooks/UserInfo/useNickname';

type Props = {
  currentNickname: string;
  isModalVisible: boolean;
  onPressClose: () => void;
};

export const NicknameModal = ({
  currentNickname,
  isModalVisible,
  onPressClose,
}: Props) => {
  const {
    nickname,
    tempNickname,
    disable,
    alterOpacity,
    nicknameValidationResult,
    onChangeNickname,
    initializeNicknameModal,
  } = useNickname(currentNickname);

  const queryClient = useQueryClient();

  const {keyboardHeight, keyboardVisible} = useKeyboard();

  const {bottom: SAFE_AREA_BOTTOM} = useSafeAreaInsets();

  const hideModal = () => {
    initializeNicknameModal();
    onPressClose();
  };

  const {mutate: updateNickname} = useMutation(
    ['nickname', nickname],
    async () => {
      return await patchUserInfo({nickname});
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userInfo');
        hideModal();
      },
      onError: (error: any) => {
        console.error(error.message);
        Toast.show('문제가 발생했습니다');
      },
    },
  );

  return (
    <Modal
      statusBarTranslucent={true} // android
      animationType="slide"
      transparent={true}
      onRequestClose={hideModal}
      visible={isModalVisible}>
      <View style={styles.container}>
        <View style={[styles.modalView, {paddingBottom: SAFE_AREA_BOTTOM}]}>
          <View style={styles.header}>
            <Pressable onPress={hideModal}>
              <Image
                source={require('../../Assets/close.png')}
                style={styles.closeButton}
              />
            </Pressable>
            <Text style={styles.title}>별명 변경</Text>
            <View style={styles.headerBlank} />
          </View>
          <ScrollView
            alwaysBounceVertical={false}
            style={[
              styles.nickname,
              {paddingBottom: (keyboardVisible ? 30 : 100) + keyboardHeight},
            ]}>
            <TextInput
              style={styles.nicknameInput}
              value={tempNickname}
              onChangeText={onChangeNickname}
              placeholder="새로운 별명을 입력해주세요."
            />

            <Animated.View style={[styles.alert, {opacity: alterOpacity}]}>
              {nicknameValidationResult && (
                <Text
                  style={
                    nicknameValidationResult.valid
                      ? styles.alertSuccess
                      : styles.alertFail
                  }>
                  {nicknameValidationResult.message}
                </Text>
              )}
            </Animated.View>
          </ScrollView>

          <BottomButton
            disable={disable}
            buttonText="변경하기"
            onPress={updateNickname}
          />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {height: 28, width: 28},
  title: {
    fontFamily: 'Galmuri11',
    fontSize: 15,
    color: '#0000cc',
  },
  headerBlank: {width: 28},
  nickname: {
    marginBottom: 10,
    marginHorizontal: 24,
  },
  nicknameInput: {
    padding: 17,
    height: 54,
    borderWidth: 1,
    borderColor: '#0000cc',
    borderRadius: 10,
    fontFamily: 'Galmuri11',
    color: '#0000cc',
  },
  alert: {
    marginTop: 10,
  },
  alertSuccess: {
    fontFamily: 'Galmuri11',
    color: '#44ccff',
  },
  alertFail: {
    fontFamily: 'Galmuri11',
    color: '#ff44cc',
  },
  changeButton: {
    marginHorizontal: 16,
    borderRadius: 10,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeButtonText: {fontFamily: 'Galmuri11', color: 'white'},
});
