import { BigNumberish } from 'ethers'
import { formatBN } from '../lib/numbers'
import React, { FC } from 'react'
import { Flex, Text } from './index'

type Props = {
  amount: BigNumberish | null | undefined
  maximumFractionDigits?: number
  decimals?: number
  css?: Parameters<typeof Text>['0']['css']
  textStyle?: Parameters<typeof Text>['0']['style']
  textColor?: Parameters<typeof Text>['0']['color']
  children?: React.ReactNode
}

const FormatCrypto: FC<Props> = ({
  amount,
  maximumFractionDigits = 4,
  decimals = 18,
  css,
  textStyle = 'subtitle1',
  textColor = 'blackwhite',
  children,
}) => {
  const value = formatBN(amount, maximumFractionDigits, decimals)
  return (
    <Flex align="center" css={{ gap: '$1' }}>
      <Text style={textStyle} color="blackWhite" css={css} as="p">
        {value}
      </Text>
      {value !== '-' ? children : null}
    </Flex>
  )
}

export default FormatCrypto
