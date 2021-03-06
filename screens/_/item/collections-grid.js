/*
 * @Author: czy0729
 * @Date: 2019-05-26 14:45:11
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-12-23 09:47:16
 */
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react'
import { Touchable, Text, Image } from '@components'
import { _ } from '@stores'
import { getTimestamp } from '@utils'
import { getCoverMedium } from '@utils/app'
import { HTMLDecode } from '@utils/html'
import { t } from '@utils/fetch'
import { IMG_DEFAULT, EVENT } from '@constants'

const imageWidth = _.window.width * 0.2
const marginLeft = (_.window.width - 4 * imageWidth) / 5

function CollectionsGrid({
  style,
  navigation,
  id,
  cover,
  name,
  nameCn,
  time,
  isOnHold,
  event
}) {
  let holdDays
  if (isOnHold) {
    holdDays = Math.ceil((getTimestamp() - getTimestamp(time)) / 86400)
  }
  const _image = getCoverMedium(cover, false)
  const onPress = () => {
    const { id: eventId, eventData } = event
    const subjectId = String(id).replace('/subject/', '')
    t(eventId, {
      to: 'Subject',
      subjectId,
      type: 'grid',
      ...eventData
    })

    navigation.push('Subject', {
      subjectId,
      _jp: name,
      _cn: nameCn,
      _image
    })
  }
  return (
    <View style={[styles.item, style]}>
      <Image
        size={imageWidth}
        src={_image || IMG_DEFAULT}
        border
        radius
        shadow
        onPress={onPress}
      />
      <Touchable withoutFeedback onPress={onPress}>
        <Text style={_.mt.sm} size={12} numberOfLines={2}>
          {HTMLDecode(nameCn || name)}
        </Text>
        {!!holdDays && (
          <Text style={_.mt.xs} size={12} type='sub'>
            搁置{holdDays}天
          </Text>
        )}
      </Touchable>
    </View>
  )
}

CollectionsGrid.defaultProps = {
  event: EVENT
}

export default observer(CollectionsGrid)

const styles = StyleSheet.create({
  item: {
    width: imageWidth,
    marginLeft,
    marginBottom: _.wind
  }
})
