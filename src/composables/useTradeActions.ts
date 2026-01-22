import { showToast, showDialog } from 'vant'
import { acceptTransferApply, rejectTransferApply, completeTrade, cancelTrade } from '@/api/stuff'

export const useTradeActions = () => {
  // 接受交易
  const handleAcceptTrade = async (tradeId: string, onSuccess?: () => void) => {
    try {
      await showDialog({
        title: '确认接受',
        message: '确定要接受这个交易吗？',
        showCancelButton: true,
      })
      
      const res = await acceptTransferApply({ tradeId })
      if (res.success) {
        showToast('已接受交易')
        onSuccess?.()
      } else {
        showToast(res.desc || '接受交易失败')
      }
    } catch (error) {
      if (error !== 'cancel') {
        showToast('接受交易失败')
      }
    }
  }

  // 拒绝交易
  const handleRejectTrade = async (tradeId: string, onSuccess?: () => void) => {
    try {
      await showDialog({
        title: '确认拒绝',
        message: '确定要拒绝这个交易吗？',
        showCancelButton: true,
      })
      
      const res = await rejectTransferApply({ 
        tradeId, 
        rejectReason: '用户拒绝交易'
      })
      if (res.success) {
        showToast('已拒绝交易')
        onSuccess?.()
      } else {
        showToast(res.desc || '拒绝交易失败')
      }
    } catch (error) {
      if (error !== 'cancel') {
        showToast('拒绝交易失败')
      }
    }
  }

  // 确认交易
  const handleConfirmTrade = async (tradeId: string, onSuccess?: () => void) => {
    try {
      await showDialog({
        title: '确认完成',
        message: '确定要完成这个交易吗？',
        showCancelButton: true,
      })
      
      const res = await completeTrade({ tradeId })
      if (res.success) {
        showToast('交易已完成')
        onSuccess?.()
      } else {
        showToast(res.desc || '确认交易失败')
      }
    } catch (error) {
      if (error !== 'cancel') {
        showToast('确认交易失败')
      }
    }
  }

  // 取消交易
  const handleCancelTrade = async (tradeId: string, onSuccess?: () => void) => {
    try {
      await showDialog({
        title: '确认取消',
        message: '确定要取消这个交易吗？',
        showCancelButton: true,
      })
      
      const res = await cancelTrade({ 
        tradeId, 
        cancelReason: '用户取消交易'
      })
      if (res.success) {
        showToast('已取消交易')
        onSuccess?.()
      } else {
        showToast(res.desc || '取消交易失败')
      }
    } catch (error) {
      if (error !== 'cancel') {
        showToast('取消交易失败')
      }
    }
  }

  return {
    handleAcceptTrade,
    handleRejectTrade,
    handleConfirmTrade,
    handleCancelTrade
  }
} 