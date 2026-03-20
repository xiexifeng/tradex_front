Component({
  properties: {
    images: {
      type: Array,
      value: []
    },
    itemTitle: {
      type: String,
      value: ""
    },
    tags: {
      type: Array,
      value: []
    },
    autoplay: {
      type: Boolean,
      value: true
    },
    interval: {
      type: Number,
      value: 3000
    },
    circular: {
      type: Boolean,
      value: true
    },
    showDots: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    onPreview(e) {
      const idx = Number(e.currentTarget.dataset.index);
      const urls = this.data.images || [];
      if (!urls.length || Number.isNaN(idx)) return;

      wx.previewImage({
        current: urls[idx],
        urls
      });
    }
  }
});

