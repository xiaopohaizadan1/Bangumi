/*
 * @Author: czy0729
 * @Date: 2019-03-26 02:36:03
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-12-19 15:53:30
 */
import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Expand } from '@components'
import { SectionTitle, ItemArticle } from '@screens/_'
import { _ } from '@stores'

function Blog({ style }, { $, navigation }) {
  const { blog } = $.subject
  if (!(blog || []).length) {
    return null
  }

  return (
    <Expand style={style} ratio={2}>
      <SectionTitle style={{ paddingLeft: _.wind }}>评论</SectionTitle>
      <View style={_.mt.sm}>
        {blog.map((item, index) => (
          <ItemArticle
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            style={{ paddingLeft: _.wind }}
            navigation={navigation}
            index={index}
            avatar={item.user.avatar.small}
            title={item.title}
            summary={item.summary}
            nickname={item.user.nickname}
            timestamp={item.timestamp}
            replies={item.replies}
            url={item.url}
            event={{
              id: '条目.跳转',
              data: {
                from: '评论',
                subjectId: $.subjectId
              }
            }}
          />
        ))}
      </View>
    </Expand>
  )
}

Blog.contextTypes = {
  $: PropTypes.object,
  navigation: PropTypes.object
}

export default observer(Blog)
