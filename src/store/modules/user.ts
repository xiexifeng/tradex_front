import { defineStore } from 'pinia';
import type { UserInfo, LoginAccount } from '@/api/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null') as UserInfo | null,
    loginAccount: JSON.parse(localStorage.getItem('loginAccount') || 'null') as LoginAccount | null
  }),

  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },

    setLoginAccount(loginAccount: LoginAccount) {
      this.loginAccount = loginAccount;
      localStorage.setItem('loginAccount', JSON.stringify(loginAccount));
    },

    logout() {
      this.token = '';
      this.userInfo = null;
      this.loginAccount = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('loginAccount');
    }
  }
});
