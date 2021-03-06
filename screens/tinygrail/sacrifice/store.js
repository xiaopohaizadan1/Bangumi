/*
 * @Author: czy0729
 * @Date: 2019-11-17 12:11:10
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-12-23 12:20:48
 */
import { Alert } from 'react-native'
import { observable, computed } from 'mobx'
import { tinygrailStore } from '@stores'
import { setStorage, getTimestamp, formatNumber, toFixed } from '@utils'
import store from '@utils/store'
import { queue, t } from '@utils/fetch'
import { info } from '@utils/ui'

const namespace = 'ScreenTinygrailSacrifice'

export default class ScreenTinygrailSacrifice extends store {
  state = observable({
    loading: false,
    amount: 0, // 只能是整数,
    isSale: false, // 股权融资
    expand: false, // 展开所有圣殿

    auctionLoading: false,
    auctionAmount: 0,
    auctionPrice: 0,

    lastAuction: {
      price: '',
      amount: '',
      time: 0
    }
  })

  init = async () => {
    const lastAuction = this.getStorage(
      undefined,
      `${namespace}|lastAuction|${this.monoId}`
    ) || {
      price: '',
      amount: '',
      time: 0
    }
    this.setState({
      lastAuction
    })

    return this.refresh()
  }

  refresh = () =>
    queue([
      () => tinygrailStore.fetchCharacters([this.monoId]), // 角色小圣杯信息
      () => tinygrailStore.fetchUserLogs(this.monoId), // 本角色我的交易信息
      () => tinygrailStore.fetchCharaTemple(this.monoId), // 固定资产
      () => tinygrailStore.fetchAssets(), // 自己的资产
      () => tinygrailStore.fetchIssuePrice(this.monoId),
      () => this.fetchValhallChara(),
      () => tinygrailStore.fetchAuctionList(this.monoId) // 上周拍卖信息
    ])

  fetchValhallChara = async () => {
    let res
    try {
      res = tinygrailStore.fetchValhallChara(this.monoId) // 本次拍卖信息
      const { price } = await res
      if (price) {
        this.setState({
          auctionPrice: toFixed(price + 0.01, 2)
        })
      }
    } catch (error) {
      // do nothing
    }
    return res
  }

  // -------------------- get --------------------
  @computed get monoId() {
    const { monoId = '' } = this.params
    return monoId.replace('character/', '')
  }

  @computed get hash() {
    return tinygrailStore.hash
  }

  @computed get chara() {
    return tinygrailStore.characters(this.monoId)
  }

  @computed get userLogs() {
    return tinygrailStore.userLogs(this.monoId)
  }

  @computed get charaTemple() {
    return tinygrailStore.charaTemple(this.monoId)
  }

  @computed get assets() {
    return tinygrailStore.assets
  }

  @computed get valhallChara() {
    return tinygrailStore.valhallChara(this.monoId)
  }

  @computed get auctionList() {
    return tinygrailStore.auctionList(this.monoId)
  }

  @computed get issuePrice() {
    return tinygrailStore.issuePrice(this.monoId)
  }

  // -------------------- action --------------------
  /**
   * 资产重组
   */
  doSacrifice = async () => {
    const { loading } = this.state
    if (loading) {
      return
    }

    this.setState({
      loading: true
    })

    const { amount, isSale } = this.state
    if (!amount) {
      info('请输入数量')
      this.setState({
        loading: false
      })
      return
    }

    t('资产重组.资产重组', {
      monoId: this.monoId,
      amount,
      isSale
    })

    const { State, Value, Message } = await tinygrailStore.doSacrifice({
      monoId: this.monoId,
      amount,
      isSale
    })

    if (State !== 0) {
      info(Message)
      this.setState({
        loading: false
      })
      return
    }

    Alert.alert(
      '小圣杯助手',
      isSale
        ? `融资完成！获得资金 ₵${formatNumber(Value.Balance)}`
        : `融资完成！获得资金 ₵${formatNumber(Value.Balance)} ${
            Value.Items.length ? '掉落道具' : ''
          } ${Value.Items.map(item => `「${item.Name}」×${item.Count}`).join(
            ' '
          )}`,
      [
        {
          text: '知道了'
        }
      ]
    )
    this.setState({
      loading: false
    })
    this.refresh()
  }

  /**
   * 竞拍
   */
  doAuction = async () => {
    const { auctionLoading } = this.state
    if (auctionLoading) {
      return
    }

    this.setState({
      auctionLoading: true
    })

    const { auctionAmount, auctionPrice } = this.state
    if (!auctionPrice) {
      info('请输入价格')
      this.setState({
        auctionLoading: false
      })
      return
    }

    if (!auctionAmount) {
      info('请输入数量')
      this.setState({
        auctionLoading: false
      })
      return
    }

    t('资产重组.竞拍', {
      monoId: this.monoId
    })

    const { State, Value, Message } = await tinygrailStore.doAuction({
      monoId: this.monoId,
      price: auctionPrice,
      amount: auctionAmount
    })

    if (State !== 0) {
      info(Message)
      this.setState({
        auctionLoading: false
      })
      return
    }

    info(Value)
    this.cacheLastAuction(auctionPrice, auctionAmount)
    this.setState({
      auctionLoading: false,
      auctionAmount: 0
    })
    this.refresh()
  }

  // -------------------- page --------------------
  /**
   * 金额格式过滤
   */
  moneyNatural = v => {
    if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
      if (v === '.') {
        return '0.'
      }

      if (!v) {
        return ''
      }

      return this.prev
    }

    this.prev = v
    return v
  }

  /**
   * 数量改变
   */
  changeAmount = amount => {
    let _amount = parseInt(amount)

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(_amount)) {
      _amount = 0
    }

    this.setState({
      amount: _amount
    })
  }

  /**
   * 竞拍价钱改变
   */
  changeAuctionPrice = value => {
    const state = {
      auctionPrice: this.moneyNatural(value)
    }

    this.setState(state)
  }

  /**
   * 竞拍数量改变
   */
  changeAuctionAmount = amount => {
    let _amount = parseInt(amount)

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(_amount)) {
      _amount = 0
    }

    this.setState({
      auctionAmount: _amount
    })
  }

  /**
   * 减少
   */
  stepMinus = () => {
    const { auctionPrice } = this.state
    let _value =
      parseFloat(this.moneyNatural(auctionPrice) || auctionPrice) - 0.1
    if (_value < 0) {
      _value = 1
    }

    this.setState({
      auctionPrice: toFixed(_value, 2)
    })
  }

  /**
   * 增加
   */
  stepPlus = () => {
    const { auctionPrice } = this.state
    const _value =
      parseFloat(this.moneyNatural(auctionPrice) || auctionPrice) + 0.1

    this.setState({
      auctionPrice: toFixed(_value, 2)
    })
  }

  /**
   * 展开/收起所有圣殿
   */
  toggleExpand = () => {
    const { expand } = this.state
    t('资产重组.展开收起圣殿', {
      expand: !expand
    })

    this.setState({
      expand: !expand
    })
  }

  /**
   * 记忆上次出价
   */
  cacheLastAuction = (price, amount) => {
    const data = {
      price,
      amount,
      time: getTimestamp()
    }
    this.setState({
      lastAuction: data
    })

    const key = `${namespace}|lastAuction|${this.monoId}`
    setStorage(key, data)
  }

  /**
   * 切换股权融资
   */
  switchIsSale = () => {
    const { isSale } = this.state
    this.setState({
      isSale: !isSale
    })
  }
}
