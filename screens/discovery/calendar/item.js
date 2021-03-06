/*
 * @Author: czy0729
 * @Date: 2019-03-22 09:17:45
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-12-19 20:53:18
 */
import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Touchable, Flex, Text, Image } from '@components'
import { _ } from '@stores'
import { toFixed } from '@utils'
import { HTMLDecode } from '@utils/html'
import { getCoverMedium } from '@utils/app'
import { t } from '@utils/fetch'
import { IMG_DEFAULT } from '@constants'

const imageWidth = _.window.width * 0.288
const imageHeight = imageWidth * 1.28
const marginLeft = (_.window.width - 3 * imageWidth) / 4

function Item(
  { style, subjectId, images = {}, name, score },
  { $, navigation }
) {
  // 是否已收藏
  const { list } = $.userCollection
  const isCollected =
    list.findIndex(item => item.subject_id === subjectId) !== -1

  const { air, timeCN } = $.onAir[subjectId] || {}
  const _image = getCoverMedium(images.medium)
  const onPress = () => {
    t('每日放送.跳转', {
      to: 'Subject',
      subjectId
    })

    navigation.push('Subject', {
      subjectId,
      _cn: name,
      _image
    })
  }
  return (
    <View style={[styles.item, style]}>
      <Image
        width={imageWidth}
        height={imageHeight}
        src={_image || IMG_DEFAULT}
        radius
        shadow
        onPress={onPress}
      />
      <Touchable withoutFeedback onPress={onPress}>
        <Text
          style={_.mt.sm}
          type={isCollected ? _.select('main', 'warning') : 'desc'}
          numberOfLines={2}
        >
          {HTMLDecode(name)}
        </Text>
        <Flex style={_.mt.xs}>
          {!!air && (
            <Text style={_.mr.xs} size={12} type='sub'>
              {air}话
            </Text>
          )}
          {!!score && (
            <Text size={12} type='sub'>
              ({toFixed(score, 1)}){' '}
            </Text>
          )}
          {!!timeCN && (
            <Text size={12} type='sub'>
              {`- ${timeCN.slice(0, 2)}:${timeCN.slice(2)}`}{' '}
            </Text>
          )}
        </Flex>
      </Touchable>
    </View>
  )
}

Item.contextTypes = {
  $: PropTypes.object,
  navigation: PropTypes.object
}

export default observer(Item)

const styles = StyleSheet.create({
  item: {
    width: imageWidth,
    marginBottom: _.wind,
    marginLeft
  }
})
