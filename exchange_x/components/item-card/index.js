const { TRADE_METHOD_MAP } = require("../../constants/dict");

Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },
  data: {
    tradeMethodTextMap: TRADE_METHOD_MAP
  },
  methods: {
    onTap() {
      const id = this.data.item && this.data.item.id;
      this.triggerEvent('select', id);
    }
  }
});
