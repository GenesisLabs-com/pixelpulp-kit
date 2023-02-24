import React, { FC, ReactElement } from 'react'
import {
  Flex,
  Text,
  FormatCryptoCurrency,
  FormatWrappedCurrency,
} from '../primitives'

type StatProps = {
  label: string | ReactElement
  value: string | number | null
  asNative?: boolean
  asWrapped?: boolean
}

const Stat: FC<StatProps> = ({
  label,
  value,
  asNative = false,
  asWrapped = false,
  ...props
}) => (
  <Flex
    align="start"
    justify="between"
    className="rk-stat-well"
    direction="column"
    css={{
      backgroundColor: 'transparent',
      p: 0,
      // borderRight: '1px solid $closeBorder',
      // [`& :last-child)`]: {
      //   borderRight: 'none',
      // },
      overflow: 'hidden',
    }}
    {...props}
  >
    <Flex
      css={{
        flex: 1,
        minWidth: '0',
        alignItems: 'center',
        gap: '$2',
        mr: '$1',
      }}
    >
      {label}
    </Flex>
    {asNative && !asWrapped && (
      <FormatCryptoCurrency amount={value} textStyle="subtitle1" />
    )}
    {asWrapped && !asNative && (
      <FormatWrappedCurrency amount={value} textStyle="subtitle1" />
    )}
    {!asNative && !asWrapped && (
      <Text
        style="subtitle1"
        as="p"
        css={{
          marginLeft: '0',
        }}
        ellipsify
      >
        {value ? value : '-'}
      </Text>
    )}
  </Flex>
)

Stat.toString = () => '.rk-stat-well'

export default Stat
