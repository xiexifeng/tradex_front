<template>
  <BaseCard
    class="item-card"
    variant="interactive"
    padding="0"
    @click="$emit('select', item.id)"
  >
    <div class="image">
      <img :src="item.firstImage" :alt="item.itemTitle" />
      <div class="tags">
        <span class="pill pill-blue">{{ item.itemType }}</span>
        <span class="pill pill-orange">{{ item.depreciation }}成新</span>
      </div>
    </div>
    <div class="info">
      <h3 class="title">{{ item.itemTitle }}</h3>
      <!-- <p class="desc">{{ item.itemDescription }}</p> -->
      <div class="meta">
        <div class="price-block">
          <span v-if="item.tradeMethod === 'ITEM_TO_MONEY'" class="price">¥{{ item.transferPrice }}</span>
          <span v-else-if="item.tradeMethod === 'ITEM_TO_POINTS'" class="price">{{ item.transferPoints }}积分</span>
          <span v-else class="exchange">换{{ item.expectItem }}</span>
          
        </div>
        <van-tag plain :type="tradeTagType" size="medium">
          {{ getValueText(item.tradeMethod, 'tradeMethod') }}
        </van-tag>
      </div>
      <div class="footer">
        <div class="footer-row user-row">
          <div class="user">
            <img :src="item.userAvatar" class="avatar" />
            <span class="name">{{ shortName }}</span>
          </div>
        </div>
        <div class="footer-row stats-row">
          <div class="stats">
            <span><van-icon name="eye-o" /> {{ item.viewCount }}</span>
            <span><van-icon name="like-o" /> {{ item.loveCount }}</span>
            <span><van-icon name="star-o" /> {{ item.collectionCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import BaseCard from './BaseCard.vue'
import { getValueText } from '@/constants/stuff'

type Item = {
  id: string
  itemTitle: string
  itemDescription: string
  itemType: string
  tradeMethod: string
  transferPrice?: number | null
  transferPoints?: number | null
  expectItem?: string | null
  depreciation?: number
  userAvatar?: string
  userNickname?: string
  firstImage?: string
  viewCount?: number
  loveCount?: number
  collectionCount?: number
}

export default defineComponent({
  name: 'ItemCard',
  components: { BaseCard },
  props: {
    item: {
      type: Object as PropType<Item>,
      required: true
    }
  },
  emits: ['select'],
  setup(props) {
    const tradeTagType = computed(() => {
      switch (props.item.tradeMethod) {
        case 'ITEM_TO_MONEY':
          return 'danger'
        case 'ITEM_TO_POINTS':
          return 'warning'
        case 'ITEM_TO_ITEM':
          return 'primary'
        default:
          return 'default'
      }
    })

    const shortName = computed(() => {
      const name = props.item.userNickname || ''
      return name.length > 20 ? `${name.slice(0, 20)}...` : name
    })

    return {
      tradeTagType,
      shortName,
      getValueText
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/styles/theme.scss';

.item-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #f2f3f5;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .image {
    position: relative;
    padding-top: 100%;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .tags {
      position: absolute;
      top: 8px;
      left: 8px;
      display: flex;
      gap: 6px;
      flex-wrap: wrap;

      .pill {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
        line-height: 1;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(4px);
      }

      .pill-blue {
        background: linear-gradient(135deg, #4da1ff, #0e73ff);
      }

      .pill-orange {
        background: linear-gradient(135deg, #ffb36b, #ff6a3d);
      }
    }
  }

  .info {
    padding: 12px;

    .title {
      font-size: 16px;
      font-weight: 800;
      margin: 0;
      color: var(--van-text-color);
      @include text-ellipsis;
    }

    .desc {
      font-size: 12px;
      color: var(--van-text-color-2);
      margin: 6px 0 10px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 6px 0 10px;

      .price {
        font-size: 16px;
        font-weight: 800;
        color: #ee0a24;
      }

      .price-block {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .exchange {
        font-size: 14px;
        color: var(--van-primary-color);
      }

      .currency-tag {
        border-color: #ee0a24;
        color: #ee0a24;
      }
    }

    .footer {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #f5f5f5;

      .footer-row {
        display: flex;
        width: 100%;
      }

      .user-row {
        align-items: center;
        justify-content: flex-start;
      }

      .stats-row {
        align-items: center;
        justify-content: flex-start;
      }

      .user {
        display: flex;
        align-items: center;
        gap: 6px;

        .avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }

        .name {
          font-size: 13px;
          font-weight: 600;
          color: #3c3c3c;
        }
      }

      .stats {
        display: flex;
        gap: 8px;
        font-size: 12px;
        color: #666;

        span {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 12px;
          background: #f7f8fa;
          border: 1px solid #f0f1f3;
        }
      }
    }
  }
}
</style>
