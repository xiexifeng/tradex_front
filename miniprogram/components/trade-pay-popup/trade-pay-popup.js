Component({
  properties: {
    show: { type: Boolean, value: false },
    payPoints: { type: Number, value: 0 },
  },
  data: {
    password: '',
  },
  observers: {
    show(val) {
      if (!val) this.setData({ password: '' });
    },
  },
  methods: {
    onPwdInput(e) {
      this.setData({ password: e.detail.value });
    },
    onClose() {
      this.triggerEvent('close');
    },
    onConfirm() {
      const { password } = this.data;
      if (!password) {
        wx.showToast({ title: '请输入交易密码', icon: 'none' });
        return;
      }
      this.triggerEvent('submit', { tradePassword: password });
    },
    noop() {},
  },
});
