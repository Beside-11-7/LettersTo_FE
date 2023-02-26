import React from 'react';
import {View, Modal, StyleSheet, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation, useQueryClient} from 'react-query';
import {patchUserInfo} from '../../APIs/member';
import {ModalHeader} from '../../Components/Headers/ModalHeader';
import Toast from '../../Components/Toast/toast';
import {useKeyboard} from '../../Hooks/Hardware/useKeyboard';
import {useNickname} from '../../Hooks/UserInfo/useNickname';
import {NicknameAvailableAlert} from '../../Components/UserInfo/Alert/NicknameAvailableAlert';
import {NicknameInput} from '../../Screens/SignUp/NicknameForm/Components/NicknameInput';
import {UpdateButton} from '../../Components/Button/Bottom/UpdateButton';

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
        hideModal();
        Toast.show(error.response.data.message);
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
          <ModalHeader title={'별명 변경'} onPressClose={hideModal} />
          <ScrollView
            alwaysBounceVertical={false}
            style={[
              {paddingBottom: (keyboardVisible ? 30 : 100) + keyboardHeight},
            ]}>
            <NicknameInput
              value={tempNickname}
              placeholder="새로운 별명을 입력해주세요."
              onChangeNickname={onChangeNickname}
            />
            <NicknameAvailableAlert
              nicknameValidation={nicknameValidationResult}
              alterOpacity={alterOpacity}
            />
          </ScrollView>

          <UpdateButton disable={disable} onPressUpdate={updateNickname} />
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
});
