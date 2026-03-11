<template>
  <div class="rank-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="拉新排行"
      left-arrow
      class="rank-nav"
      @click-left="onClickLeft"
    >
      <template #right>
        <van-icon name="share-o" size="20" class="nav-icon" @click="onShare"/>
      </template>
    </van-nav-bar>

    <div class="rank-content">
      <!-- 排行榜列表 -->
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        loading-text="加载中..."
      >
        <div class="rank-list">
          <div
            v-for="(item, index) in rankList"
            :key="item.userId"
            class="rank-item"
            :class="{ 'top-three': index < 3 }"
          >
            <!-- 排名 -->
            <div class="rank-number" :class="getRankClass(index)">
              <span v-if="index >= 3">{{ index + 1 }}</span>
              <van-icon v-else :name="getRankIcon(index)" />
            </div>

            <!-- 用户信息 -->
            <div class="user-info">
              <van-image
                round
                width="48"
                height="48"
                src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                class="avatar"
              />
              <div class="user-details">
                <div class="nickname">{{ item.nickname || '未设置昵称' }}</div>
                <div class="user-id">用户ID: {{ item.userId }}</div>
              </div>
            </div>

            <!-- 拉新数量 -->
            <div class="invite-count">
              <div class="count-value">{{ item.inviteCount }}</div>
              <div class="count-label">拉新人数</div>
            </div>
          </div>
        </div>

        <van-empty v-if="!loading && rankList.length === 0" description="暂无排行榜数据" />

        <!-- 查看上一榜单链接 -->
        <div class="latest-rank-link-wrap">
          <span class="latest-rank-link" @click="onViewLatestRank">查看上一榜单</span>
        </div>
      </van-list>
    </div>

    <!-- 上一榜单弹窗 -->
    <van-popup
      v-model:show="showLatestRankPopup"
      position="bottom"
      round
      :style="{ height: '80%' }"
      closeable
    >
      <div class="latest-rank-popup">
        <div class="latest-rank-title">上一期榜单</div>
        <div v-if="latestRankLoading" class="latest-rank-loading">
          <van-loading size="24px">加载中...</van-loading>
        </div>
        <template v-else-if="latestRankData">
          <div class="latest-rank-period">
            排行周期：{{ formatRankPeriod(latestRankData.beginTime, latestRankData.endTime) }}
          </div>
          <div class="latest-rank-list">
            <div
              v-for="(item, index) in latestRankUsers"
              :key="`${item.userId}-${index}`"
              class="rank-item"
              :class="{ 'top-three': index < 3 }"
            >
              <div class="rank-number" :class="getRankClass(index)">
                <span v-if="index >= 3">{{ index + 1 }}</span>
                <van-icon v-else :name="getRankIcon(index)" />
              </div>
              <div class="user-info">
                <van-image
                  round
                  width="40"
                  height="40"
                  src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                  class="avatar"
                />
                <div class="user-details">
                  <div class="nickname">{{ item.nickname || '未设置昵称' }}</div>
                  <div class="user-id">用户ID: {{ item.userId || '-' }}</div>
                </div>
              </div>
              <div class="invite-count">
                <div class="count-value">{{ item.inviteCount }}</div>
                <div class="count-label">拉新人数</div>
              </div>
            </div>
          </div>
          <van-empty v-if="latestRankUsers.length === 0" description="暂无排名数据" />
        </template>
      </div>
    </van-popup>

    <!-- 分享弹窗 -->
    <ShareDialog
      v-model:show="showShareDialog"
      :share-title="shareTitle"
      :share-desc="shareDesc"
      :share-image="shareImage"
      :share-url="shareUrl"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { showToast } from 'vant';
import { useRouter } from 'vue-router';
import { getInviteRank, getLatestRank, type InviteRankItem, type LatestRankData } from '@/api/user';
import { useUserStore } from '@/store/modules/user';
import ShareDialog from '@/components/ShareDialog.vue';
import { APP_CONFIG } from '@/config';

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const finished = ref(false);
const rankList = ref<InviteRankItem[]>([]);
const showShareDialog = ref(false);

// 上一榜单
const showLatestRankPopup = ref(false);
const latestRankLoading = ref(false);
const latestRankData = ref<LatestRankData | null>(null);
const latestRankUsers = computed(() => {
  const data = latestRankData.value;
  if (!data?.rankUsers?.length) return [];
  return data.rankUsers.slice(0, 19);
});

// 分享信息
const shareTitle = computed(() => '拉新排行榜 - 易物平台');
const shareDesc = computed(() => '看看谁是最强拉新达人！');
const shareImage = computed(() => 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg');
const shareUrl = computed(() => {
  const baseUrl = window.location.origin;
  const userInfo = userStore.userInfo;
  if (userInfo?.userId) {
    return `${baseUrl}/register?inviteUserId=${userInfo.userId}&inviteTime=${Date.now()}`;
  }
  return `${baseUrl}/register`;
});

// 获取排名样式类
const getRankClass = (index: number) => {
  if (index === 0) return 'rank-gold';
  if (index === 1) return 'rank-silver';
  if (index === 2) return 'rank-bronze';
  return '';
};

// 获取排名图标
const getRankIcon = (index: number) => {
  if (index === 0) return 'medal';
  if (index === 1) return 'medal';
  if (index === 2) return 'medal';
  return '';
};

// 加载排行榜数据
const loadRankList = async () => {
  if (loading.value) return;
  loading.value = true;

  try {
    const res = await getInviteRank();
    if (res.success) {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        // 接口返回的数据已经按排名排序，直接使用前10条
        rankList.value = res.data.slice(0, 10);
      } else {
        // 如果返回 null 或空数组，设置为空数组
        rankList.value = [];
      }
      finished.value = true;
    }
  } catch (error) {
    console.error('加载排行榜失败:', error);
    showToast('加载排行榜失败');
    rankList.value = [];
    finished.value = true;
  } finally {
    loading.value = false;
  }
};

// 分享
const onShare = () => {
  showShareDialog.value = true;
};

// 返回
const onClickLeft = () => {
  router.back();
};

// 格式化榜单周期
const formatRankPeriod = (beginTime: number, endTime: number) => {
  const format = (t: number) => {
    const d = new Date(t);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  return `${format(beginTime)} 至 ${format(endTime)}`;
};

// 查看上一榜单（GET 请求）
const onViewLatestRank = async () => {
  showLatestRankPopup.value = true;
  latestRankData.value = null;
  latestRankLoading.value = true;
  try {
    const res = await getLatestRank();
    if (res.success && res.data) {
      latestRankData.value = res.data;
    } else {
      showToast(res.desc || '获取上一榜单失败');
    }
  } catch (error) {
    console.error('获取上一榜单失败:', error);
    showToast('获取上一榜单失败');
  } finally {
    latestRankLoading.value = false;
  }
};

onMounted(() => {
  loadRankList();
});
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.rank-container {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.rank-nav {
  :deep(.van-nav-bar__content) {
    background: linear-gradient(to right, #1989fa, #0066ff);

    .van-nav-bar__title,
    .nav-icon {
      color: #fff;
    }
  }
}

.rank-content {
  padding: 12px;
}

.rank-list {
  .rank-item {
    display: flex;
    align-items: center;
    padding: 16px;
    margin-bottom: 12px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    &.top-three {
      background: linear-gradient(135deg, #fff9e6 0%, #fff 100%);
      border: 2px solid #ffe58f;
    }

    .rank-number {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      color: #666;
      margin-right: 12px;
      flex-shrink: 0;

      &.rank-gold {
        color: #ffd700;
        font-size: 24px;
      }

      &.rank-silver {
        color: #c0c0c0;
        font-size: 24px;
      }

      &.rank-bronze {
        color: #cd7f32;
        font-size: 24px;
      }

      .van-icon {
        font-size: 24px;
      }
    }

    .user-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;

      .avatar {
        flex-shrink: 0;
        border: 2px solid #f0f0f0;
      }

      .user-details {
        flex: 1;
        min-width: 0;

        .nickname {
          font-size: 16px;
          font-weight: 600;
          color: #323233;
          margin-bottom: 4px;
          @include text-ellipsis;
        }

        .user-id {
          font-size: 12px;
          color: #969799;
        }
      }
    }

    .invite-count {
      text-align: right;
      flex-shrink: 0;
      margin-left: 12px;

      .count-value {
        font-size: 20px;
        font-weight: 700;
        color: #1989fa;
        line-height: 1.2;
        margin-bottom: 2px;
      }

      .count-label {
        font-size: 11px;
        color: #969799;
      }
    }
  }
}

.latest-rank-link-wrap {
  text-align: center;
  padding: 20px 0;
}
.latest-rank-link {
  color: #1989fa;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
}

.latest-rank-popup {
  padding: 16px;
  padding-top: 40px;
}
.latest-rank-title {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
  text-align: center;
  margin-bottom: 12px;
}
.latest-rank-period {
  font-size: 13px;
  color: #969799;
  margin-bottom: 16px;
  text-align: center;
}
.latest-rank-loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
.latest-rank-list .rank-item {
  padding: 12px;
  margin-bottom: 8px;
}
.latest-rank-list .rank-number {
  width: 32px;
  height: 32px;
  font-size: 14px;
  margin-right: 8px;
}
.latest-rank-list .user-info .avatar {
  width: 40px;
  height: 40px;
}
.latest-rank-list .nickname {
  font-size: 14px;
}
.latest-rank-list .count-value {
  font-size: 16px;
}
</style>
