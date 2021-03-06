/*
 * @Author: czy0729
 * @Date: 2019-03-24 05:24:48
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-12-17 19:45:43
 */
import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Expand, Text } from '@components'
import { SectionTitle } from '@screens/_'
import { _ } from '@stores'

function Summary({ style }, { $ }) {
  const { _summary } = $.params
  const { summary, _loaded } = $.subject
  if (_loaded && !_summary && !summary) {
    return null
  }

  const content = (summary || _summary || '').replace('\r\n\r\n', '\r\n')
  return (
    <View style={[_.container.wind, styles.container, style]}>
      <SectionTitle>简介</SectionTitle>
      {!!content && (
        <Expand>
          <Text style={_.mt.sm} size={15} lineHeight={22}>
            {content}
          </Text>
        </Expand>
      )}
    </View>
  )
}

Summary.contextTypes = {
  $: PropTypes.object
}

export default observer(Summary)

const styles = StyleSheet.create({
  container: {
    minHeight: 120
  }
})
