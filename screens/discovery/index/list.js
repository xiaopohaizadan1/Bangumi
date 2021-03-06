/*
 * @Author: czy0729
 * @Date: 2019-05-29 04:03:46
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-12-19 20:02:20
 */
import React from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { LinearGradient } from 'expo-linear-gradient'
import { Image, Text } from '@components'
import { SectionTitle, IconHeader } from '@screens/_'
import { _ } from '@stores'
import { findBangumiCn, getCoverLarge, getCoverMedium } from '@utils/app'
import { t } from '@utils/fetch'
import { HOST, IMG_DEFAULT } from '@constants'
import { MODEL_SUBJECT_TYPE } from '@constants/model'

const imageBigWidth = _.window.width - _.wind * 2
const imageBigHeight = imageBigWidth * 1.28
const imageWidth = _.window.width * 0.32
const imageHeight = imageWidth * 1.28
const linearColorLg = [
  'rgba(0, 0, 0, 0)',
  'rgba(0, 0, 0, 0)',
  'rgba(0, 0, 0, 0)',
  'rgba(0, 0, 0, 0.8)'
]
const linearColorSm = [
  'rgba(0, 0, 0, 0)',
  'rgba(0, 0, 0, 0)',
  'rgba(0, 0, 0, 0.8)'
]

function List({ style, type }, { $, navigation }) {
  if (!$.home[type].length) {
    return null
  }

  const styles = memoStyles()
  const data = $.home[type].sort(() => 0.5 - Math.random())
  const title = MODEL_SUBJECT_TYPE.getTitle(type)
  return (
    <>
      <SectionTitle
        style={styles.section}
        right={
          <IconHeader
            name='right'
            color={_.colorTitle}
            onPress={() => {
              t('发现.跳转', {
                to: 'WebView',
                title
              })
              navigation.push('WebView', {
                uri: `${HOST}/${type}`,
                title
              })
            }}
          />
        }
      >
        {title}
      </SectionTitle>
      {[0].map(item => {
        const src = getCoverLarge(data[item].cover) || IMG_DEFAULT
        const cn = findBangumiCn(data[item].title)
        return (
          <View key={item} style={styles.big}>
            <Image
              src={src}
              size={imageBigWidth}
              height={imageBigHeight}
              radius={_.radiusMd}
              placeholder={false}
              onPress={() => {
                t('发现.跳转', {
                  to: 'Subject',
                  from: title,
                  type: 'lg',
                  subjectId: data[item].subjectId
                })
                navigation.push('Subject', {
                  subjectId: data[item].subjectId,
                  _jp: data[item].title,
                  _cn: cn,
                  _image: src
                })
              }}
            />
            <LinearGradient
              colors={linearColorLg}
              pointerEvents='none'
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.desc} pointerEvents='none'>
              <Text style={styles.info} type={_.select('plain', 'title')} bold>
                {data[item].info}
              </Text>
              <Text
                style={[styles.title, _.mt.xs]}
                size={26}
                type={_.select('plain', 'title')}
                bold
              >
                {cn}
              </Text>
            </View>
          </View>
        )
      })}
      <ScrollView
        style={style}
        contentContainerStyle={styles.contentContainerStyle}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {data
          .filter((item, index) => index > 0)
          .map(item => {
            const src = getCoverMedium(item.cover) || IMG_DEFAULT
            const cn = findBangumiCn(item.title)
            return (
              <View key={item.subjectId} style={styles.image}>
                <Image
                  src={src}
                  size={imageWidth}
                  height={imageHeight}
                  radius={_.radiusSm}
                  placeholder={false}
                  onPress={() => {
                    t('发现.跳转', {
                      to: 'Subject',
                      from: title,
                      type: 'sm',
                      subjectId: item.subjectId
                    })
                    navigation.push('Subject', {
                      subjectId: item.subjectId,
                      _jp: item.title,
                      _cn: cn,
                      _image: src
                    })
                  }}
                />
                <LinearGradient
                  colors={linearColorSm}
                  pointerEvents='none'
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.desc} pointerEvents='none'>
                  <Text
                    style={styles.info}
                    size={12}
                    type={_.select('plain', 'title')}
                    numberOfLines={1}
                  >
                    {item.info}
                  </Text>
                  <Text
                    style={[styles.title, _.mt.xs]}
                    type={_.select('plain', 'title')}
                    numberOfLines={1}
                    bold
                  >
                    {cn}
                  </Text>
                </View>
              </View>
            )
          })}
      </ScrollView>
    </>
  )
}

List.contextTypes = {
  $: PropTypes.object,
  navigation: PropTypes.object
}

List.defaultProps = {
  type: 'anime'
}

export default observer(List)

const memoStyles = _.memoStyles(_ => ({
  contentContainerStyle: {
    padding: _.wind,
    paddingRight: 0
  },
  section: {
    marginTop: _.wind,
    marginHorizontal: _.wind
  },
  big: {
    marginTop: _.wind,
    marginHorizontal: _.wind,
    backgroundColor: _.colorIcon,
    borderRadius: _.radiusMd,
    overflow: 'hidden'
  },
  desc: {
    position: 'absolute',
    zIndex: 1,
    right: _.wind,
    bottom: _.wind,
    left: _.wind
  },
  info: {
    opacity: 0.88
  },
  title: {
    opacity: 0.92
  },
  image: {
    marginRight: _.wind,
    backgroundColor: _.colorIcon,
    borderRadius: _.radiusSm,
    overflow: 'hidden'
  }
}))
