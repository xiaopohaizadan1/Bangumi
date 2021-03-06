/*
 * @Author: czy0729
 * @Date: 2019-07-13 22:44:24
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-12-20 22:39:25
 */
import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { Touchable, Flex, Text, Mesume } from '@components'
import { _ } from '@stores'
import { open } from '@utils'
import { appNavigate } from '@utils/app'
import { observer } from '@utils/decorators'
import { info } from '@utils/ui'
import { t } from '@utils/fetch'
import { HOST, LIMIT_TOPIC_PUSH } from '@constants'

function List({ style }, { $, navigation }) {
  const styles = memoStyles()
  const { title: group } = $.groupInfo
  const { list, _loaded } = $.group
  if (_loaded && !list.length) {
    return (
      <Flex style={styles.empty} direction='column' justify='center'>
        <Mesume />
        <Text style={_.mt.sm} type='sub'>
          好像什么都没有
        </Text>
      </Flex>
    )
  }

  return (
    <View style={style}>
      {list.map(({ title, href, replies, time, userName }, index) => {
        const topicId = href.replace('/group/topic/', 'group/')
        const readed = $.readed(topicId)
        const isReaded = !!readed.time

        // 处理 (+30) +10 样式
        const replyText = `+${replies}`
        let replyAdd
        if (isReaded) {
          if (replies > readed.replies) {
            replyAdd = `+${replies - readed.replies}`
          }
        }
        return (
          <Touchable
            key={href}
            style={[styles.item, isReaded && styles.readed]}
            highlight
            onPress={() => {
              if (replies > LIMIT_TOPIC_PUSH) {
                const url = `${HOST}${href}`
                t('小组.跳转', {
                  to: 'WebBrowser',
                  url
                })

                info('该帖评论多, 自动使用浏览器打开')
                setTimeout(() => {
                  open(url)
                }, 1600)
              } else {
                // 记录帖子查看历史详情
                $.onItemPress(topicId, replies)
                appNavigate(
                  href,
                  navigation,
                  {
                    _title: title,
                    _replies: `(+${replies})`,
                    _group: group,
                    _time: time
                  },
                  {
                    id: '小组.跳转'
                  }
                )
              }
            }}
          >
            <View style={[styles.wrap, !!index && styles.border]}>
              <Text size={16}>
                {title}
                <Text
                  type={isReaded ? 'sub' : 'main'}
                  size={12}
                  lineHeight={16}
                >
                  {' '}
                  ({replyText})
                </Text>
                {!!replyAdd && (
                  <Text type='main' size={12} lineHeight={16}>
                    {' '}
                    {replyAdd}
                  </Text>
                )}
              </Text>
              <Text style={_.mt.sm} type='sub' size={12}>
                {time} / <Text size={12}>{userName}</Text>
              </Text>
            </View>
          </Touchable>
        )
      })}
    </View>
  )
}

List.contextTypes = {
  $: PropTypes.object,
  navigation: PropTypes.object
}

export default observer(List)

const memoStyles = _.memoStyles(_ => ({
  item: {
    paddingLeft: _.md
  },
  wrap: {
    paddingVertical: _.md,
    paddingRight: _.wind
  },
  border: {
    borderTopColor: _.colorBorder,
    borderTopWidth: _.hairlineWidth
  },
  readed: {
    backgroundColor: _.colorBg
  },
  empty: {
    minHeight: 240
  }
}))
