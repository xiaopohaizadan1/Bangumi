/*
 * @Author: czy0729
 * @Date: 2019-08-24 23:07:43
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-01-01 21:41:58
 */
import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react'
import { Flex, Text, Touchable } from '@components'
import { _ } from '@stores'
import { toFixed } from '@utils'
import { caculateICO } from '@utils/app'

const colorDarkText = 'rgb(99, 117, 144)'

export default
@observer
class StockPreview extends React.Component {
  static defaultProps = {
    style: undefined,
    id: 0,
    bids: 0,
    asks: 0,
    change: 0,
    current: 0,
    fluctuation: 0,
    total: 0,
    marketValue: 0,
    users: 0,
    theme: 'light',
    _loaded: false
  }

  state = {
    showDetail: false
  }

  toggleNum = () => {
    const { showDetail } = this.state
    this.setState({
      showDetail: !showDetail
    })
  }

  renderICO() {
    const { total } = this.props
    const { level, next } = caculateICO(this.props)
    const percent = toFixed((total / next) * 100, 0)

    let backgroundColor
    switch (level) {
      case 0:
        backgroundColor = '#aaa'
        break
      case 1:
        backgroundColor = _.colorBid
        break
      case 2:
        backgroundColor = _.colorPrimary
        break
      case 3:
        backgroundColor = '#ffdc51'
        break
      case 4:
        backgroundColor = _.colorWarning
        break
      case 5:
        backgroundColor = _.colorMain
        break
      default:
        backgroundColor = _.colorAsk
        break
    }

    return (
      <Flex style={this.styles.ico}>
        <Text
          style={[
            this.styles.iconText,
            this.isDark && this.styles.iconTextDark
          ]}
          size={10}
          align='center'
        >
          lv.{level} {percent}%
        </Text>
        <View
          style={[this.styles.icoBar, this.isDark && this.styles.icoBarDark]}
        >
          <View
            style={[
              this.styles.icoProcess,
              {
                width: `${percent}%`,
                backgroundColor
              }
            ]}
          />
        </View>
      </Flex>
    )
  }

  get isDark() {
    const { theme } = this.props
    return theme === 'dark'
  }

  render() {
    const {
      style,
      current,
      fluctuation,
      change,
      bids,
      asks,
      users,
      _loaded
    } = this.props
    if (!_loaded) {
      return null
    }

    if (users) {
      return this.renderICO()
    }

    const { showDetail } = this.state
    const fluctuationStyle = [this.styles.fluctuation, _.ml.sm]
    if (fluctuation < 0) {
      fluctuationStyle.push(this.styles.danger)
    } else if (fluctuation > 0) {
      fluctuationStyle.push(this.styles.success)
    } else {
      fluctuationStyle.push(
        this.isDark ? this.styles.defaultDark : this.styles.sub
      )
    }

    let showFloor = true
    let bidsPercent = 0
    let asksPercent = 0
    if (!bids && !asks) {
      showFloor = false
    } else if (bids && !asks) {
      bidsPercent = 100
    } else if (!bids && asks) {
      asksPercent = 100
    } else {
      // const distance = Math.abs(bids - asks)
      const total = (bids + asks) * 1.1
      bidsPercent = (bids / total) * 100
      asksPercent = (asks / total) * 100
    }

    let fluctuationText = '-%'
    let realChange = '0.00'
    if (showDetail) {
      if (fluctuation > 0) {
        realChange = `+${toFixed(
          current - current / (1 + fluctuation / 100),
          2
        )}`
      } else if (fluctuation < 0) {
        realChange = `-${toFixed(current / (1 + fluctuation / 100), 2)}`
      }
    } else if (fluctuation > 0) {
      fluctuationText = `+${toFixed(fluctuation, 2)}%`
    } else if (fluctuation < 0) {
      fluctuationText = `${toFixed(fluctuation, 2)}%`
    }

    let fluctuationSize = 12
    if (fluctuationText.length > 8) {
      fluctuationSize = 10
    } else if (fluctuationText.length > 7) {
      fluctuationSize = 11
    }

    const hasNoChanged = (showDetail ? realChange : fluctuationText) === '-%'
    return (
      <Touchable
        style={[this.styles.container, style]}
        onPress={this.toggleNum}
      >
        <Flex justify='end'>
          <Text
            style={[
              !hasNoChanged && this.styles.current,
              {
                color: this.isDark ? _.__colorPlain__ : _.colorDesc
              }
            ]}
            lineHeight={16}
            align='right'
          >
            ₵{toFixed(current, 2)}
          </Text>
          {!hasNoChanged && (
            <Text
              style={[
                {
                  color: _.colorTinygrailPlain
                },
                fluctuationStyle
              ]}
              size={fluctuationSize}
              lineHeight={16}
              align='center'
            >
              {showDetail ? realChange : fluctuationText}
            </Text>
          )}
        </Flex>
        <Flex style={this.styles.wrap} justify='end'>
          {showDetail && (
            <Text
              style={{
                paddingLeft: _.wind,
                paddingRight: _.sm,
                color: this.isDark ? colorDarkText : _.colorSub,
                backgroundColor: this.isDark
                  ? _.colorTinygrailContainer
                  : _.colorPlain
              }}
              size={12}
            >
              量{change}
            </Text>
          )}
          {showFloor ? (
            <Flex>
              {showDetail && (
                <Text
                  style={{
                    color: _.colorBid
                  }}
                  size={12}
                >
                  {bids}
                </Text>
              )}
              <Flex
                style={[
                  showDetail ? this.styles.floorShowDetail : this.styles.floor,
                  _.ml.xs
                ]}
                justify='between'
              >
                <View
                  style={[
                    this.styles.bids,
                    {
                      width: `${bidsPercent}%`
                    }
                  ]}
                />
                <View
                  style={[
                    this.styles.asks,
                    {
                      width: `${asksPercent}%`
                    }
                  ]}
                />
              </Flex>
              {showDetail && (
                <Text
                  style={[
                    this.styles.small,
                    _.ml.xs,
                    {
                      color: _.colorAsk
                    }
                  ]}
                  size={12}
                >
                  {asks}
                </Text>
              )}
            </Flex>
          ) : (
            <Text
              style={[
                _.ml.sm,
                {
                  minWidth: 40,
                  color: this.isDark ? colorDarkText : _.colorSub
                }
              ]}
              size={11}
              align='right'
            >
              没挂单
            </Text>
          )}
        </Flex>
      </Touchable>
    )
  }

  get styles() {
    return memoStyles()
  }
}

const memoStyles = _.memoStyles(_ => ({
  container: {
    height: '100%',
    paddingVertical: _.wind,
    paddingHorizontal: _.sm
  },
  current: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: 72
  },
  fluctuation: {
    minWidth: 64,
    paddingHorizontal: _.xs,
    borderRadius: 2,
    overflow: 'hidden'
  },
  danger: {
    backgroundColor: _.colorAsk
  },
  success: {
    backgroundColor: _.colorBid
  },
  sub: {
    backgroundColor: _.colorSub
  },
  defaultDark: {
    backgroundColor: _.colorTinygrailText
  },
  wrap: {
    position: 'absolute',
    right: _.sm,
    bottom: _.wind,
    height: 16
  },
  floor: {
    width: 64
  },
  floorShowDetail: {
    width: 36
  },
  bids: {
    height: 2,
    backgroundColor: _.colorBid,
    borderRadius: 2,
    overflow: 'hidden'
  },
  asks: {
    height: 2,
    backgroundColor: _.colorAsk,
    borderRadius: 2,
    overflow: 'hidden'
  },
  ico: {
    height: '100%',
    paddingRight: _.wind
  },
  icoBar: {
    width: 96,
    height: 16,
    backgroundColor: _.colorBorder,
    borderRadius: 8,
    overflow: 'hidden'
  },
  icoBarDark: {
    backgroundColor: _.colorTinygrailBorder
  },
  icoProcess: {
    height: 16,
    borderRadius: 8,
    overflow: 'hidden'
  },
  iconText: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: _.sm
  },
  iconTextDark: {
    color: _.colorTinygrailPlain
  }
}))
