import {InvitationCode} from '@type/types';
import {axiosInstance} from '@utils/http';

export async function generateInvitationCode() {
  return await axiosInstance.post('/friend-invitation-code/generate');
}

export async function getInvitationCode(invitationCode?: string) {
  return await axiosInstance.get<InvitationCode>('/friend-invitation-code', {
    params: {invitationCode},
  });
}

export async function applyInvitationCode(invitationCode: string) {
  return await axiosInstance.post<InvitationCode>(
    `/friend/apply-invitation-code?invitationCode=${invitationCode}`,
  );
}
