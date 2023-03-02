import React, { FC, useEffect, useState } from 'react'
import { Flex, Box, FormatWrappedCurrency, Text } from '../../primitives'
import TokenStatsHeader from './TokenStatsHeader'
import { useTokens, useCollections } from '../../hooks'
import { BidData } from './BidModalRenderer'
import { useTimeSince } from '../../hooks'
import { formatEther } from 'ethers/lib/utils.js'
import SelectedAttribute from './SelectedAttribute'

type Props = {
  token?: NonNullable<NonNullable<ReturnType<typeof useTokens>>['data']>['0']
  collection: NonNullable<ReturnType<typeof useCollections>['data']>[0]
  bidData: BidData | null
}

const TransactionBidDetails: FC<Props> = ({ token, collection, bidData }) => {
  const [value, setValue] = useState('')
  const timeSince = useTimeSince(
    bidData?.expirationTime ? +bidData.expirationTime : 0
  )

  useEffect(() => {
    setValue(bidData ? formatEther(bidData.weiPrice) : '')
  }, [bidData])

  return (
    <Flex
      css={{
        width: '100%',
        flexDirection: 'column',
        // '@bp1': {
        //   width: 220,
        //   flexDirection: 'column',
        // },
      }}
    >
      <TokenStatsHeader collection={collection} token={token} />

      <Box
        css={{
          flex: 1,
          mb: '$3',
        }}
      >
        <SelectedAttribute
          attributeKey={bidData?.attributeKey}
          attributeValue={bidData?.attributeValue}
        />
        <Flex
          css={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            my: '1rem',
            w: '100%',
          }}
        >
          <Flex
            align="start"
            justify="between"
            className="rk-stat-well"
            direction="column"
            css={{
              borderRight: '1px solid $closeBorder',
              backgroundColor: 'transparent',
              p: 0,
              overflow: 'hidden',
              minWidth: '8rem',
            }}
          >
            <Flex
              css={{
                flex: 1,
                minWidth: '0',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '$pColor',
              }}
            >
              Offer Price
            </Flex>

            <FormatWrappedCurrency amount={+value} textStyle="subtitle1" />
          </Flex>
          <Flex
            align="start"
            justify="between"
            className="rk-stat-well"
            direction="column"
            css={{
              backgroundColor: 'transparent',
              p: '0 0 0 1rem',
              overflow: 'hidden',
            }}
          >
            <Flex
              css={{
                flex: 1,
                minWidth: '0',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '$pColor',
              }}
            >
              Expires in
            </Flex>

            <Text
              style="subtitle1"
              color="blackWhite"
              as="p"
              css={{
                marginLeft: '0',
              }}
              ellipsify
            >
              {bidData?.expirationTime
                ? `Expires ${timeSince}`
                : 'No Expiration'}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}

export default TransactionBidDetails
