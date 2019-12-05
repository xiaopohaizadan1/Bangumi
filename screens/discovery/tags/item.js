/*
 * @Author: czy0729
 * @Date: 2019-10-03 15:46:57
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-12-05 09:47:19
 */
import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Touchable, Text, Flex } from '@components'
import { _ } from '@stores'
import { formatNumber } from '@utils'
import { HTMLDecode } from '@utils/html'

const width = _.window.width * 0.2
const marginLeft = (_.window.width - 4 * width) / 5

function Item({ type, name, nums }, { navigation }) {
  const styles = memoStyles()
  let numsText = nums
  if (nums > 1000) {
    numsText = `${formatNumber(nums / 1000, 1)}K`
  }
  const tag = HTMLDecode(name)
  return (
    <Touchable
      style={styles.container}
      onPress={() =>
        navigation.push('Tag', {
          type,
          tag
        })
      }
    >
      <Flex style={styles.item} direction='column' justify='center'>
        <Text align='center' bold>
          {tag}
        </Text>
        <Text style={_.mt.xs} type='sub' align='center'>
          {numsText}
        </Text>
      </Flex>
    </Touchable>
  )
}

Item.contextTypes = {
  $: PropTypes.object,
  navigation: PropTypes.object
}

export default observer(Item)

const memoStyles = _.memoStyles(_ => ({
  container: {
    marginTop: _.wind,
    marginLeft
  },
  item: {
    width,
    height: width,
    backgroundColor: _.colorPlain,
    borderRadius: _.radiusSm,
    borderWidth: _.hairlineWidth,
    borderColor: _.colorBorder
  }
}))
