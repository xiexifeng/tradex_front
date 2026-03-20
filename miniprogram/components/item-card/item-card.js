const { getValueText } = require('../../constants/stuff.js');

Component({
  properties: {
    item: { type: Object, value: {} },
  },
  data: {
    shortName: '',
    tradeTagType: 'default',
    tradeMethodText: '',
  },
  observers: {
    item(val) {
      if (!val || !val.id) return;
      const name = val.userNickname || '';
      const shortName = name.length > 20 ? `${name.slice(0, 20)}...` : name;
      let tradeTagType = 'default';
      switch (val.tradeMethod) {
        case 'ITEM_TO_MONEY':
          tradeTagType = 'danger';
          break;
        case 'ITEM_TO_POINTS':
          tradeTagType = 'warning';
          break;
        case 'ITEM_TO_ITEM':
          tradeTagType = 'primary';
          break;
        default:
          break;
      }
      this.setData({
        shortName,
        tradeTagType,
        tradeMethodText: getValueText(val.tradeMethod, 'tradeMethod'),
      });
    },
  },
  methods: {
    onTap() {
      const id = this.data.item && this.data.item.id;
      if (id) this.triggerEvent('select', { id });
    },
  },
});
