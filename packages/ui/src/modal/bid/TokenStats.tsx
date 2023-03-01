import React, { ComponentPropsWithoutRef, FC } from 'react'
import { Flex, Box, Grid, Text } from '../../primitives'
import TokenStatsHeader from './TokenStatsHeader'
import Stat from '../Stat'
import { useTokens, useCollections } from '../../hooks'
import InfoTooltip from '../../primitives/InfoTooltip'
import { Trait } from './BidModalRenderer'
import SelectedAttribute from './SelectedAttribute'

type Props = {
  token?: NonNullable<NonNullable<ReturnType<typeof useTokens>>['data']>['0']
  collection: NonNullable<ReturnType<typeof useCollections>['data']>[0]
  trait?: Trait
}

const TokenStats: FC<Props> = ({ token, collection, trait }) => {
  let stats: (ComponentPropsWithoutRef<typeof Stat> & { id: number })[] = []

  stats.push(
    {
      id: 0,
      label: (
        <>
          <Text
            style="subtitle2"
            color="subtle"
            css={{ minWidth: '0' }}
            ellipsify
          >
            Creator Royalties
          </Text>
          <InfoTooltip
            side="right"
            width={200}
            content={
              'A fee on every order that goes to the collection creator.'
            }
          />
        </>
      ),
      value: (collection?.royalties?.bps || 0) * 0.01 + '%',
    },
    {
      id: 1,
      label: (
        <Text
          style="subtitle2"
          color="subtle"
          css={{ minWidth: '0' }}
          ellipsify
        >
          Highest Offer
        </Text>
      ),
      value: token
        ? token.market?.topBid?.price?.amount?.native || null
        : collection?.topBid?.price?.amount?.native || null,
      asWrapped: true,
    }
  )

  if (token) {
    stats.push({
      id: 2,
      label: (
        <Text
          style="subtitle2"
          color="subtle"
          css={{ minWidth: '0' }}
          ellipsify
        >
          List Price
        </Text>
      ),
      value: token.market?.floorAsk?.price?.amount?.native || null,
      asNative: true,
    })
  } else if (!token && collection) {
    stats.push({
      id: 2,
      label: (
        <Text
          style="subtitle2"
          color="subtle"
          css={{ minWidth: '0' }}
          ellipsify
        >
          Floor
        </Text>
      ),
      value: collection?.floorAsk?.price?.amount?.native || null,
      asNative: true,
    })
  }

  return (
    <Flex
      css={{
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <TokenStatsHeader collection={collection} token={token} />
      <Grid
        css={{
          flex: 1,
          alignContent: 'start',
          width: '100%',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
        }}
      >
        <SelectedAttribute
          attributeKey={trait?.key}
          attributeValue={trait?.value}
        />
        <Box
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'baseline',
            mt: '$4',
            [`& ${Stat}:nth-child(2)`]: {
              justifyContent: 'center',
              minWidth: '6.5rem',
            },
            [`& ${Stat}:first-child`]: {
              pl: '0',
            },
            [`& ${Stat}:last-child`]: {
              pl: '1.125rem',
              borderRight: 'none',
            },
            [`& ${Stat}`]: {
              m: '0 0 1rem',
              pl: '1rem',
              w: '33%',
              borderRight: '1px solid $closeBorder',
            },
            '@bp0': {
              [`& ${Stat}`]: {
                m: '0 0 1rem',
                pl: '1rem',
                w: '50%',
                borderRight: '1px solid $closeBorder',
              },
              [`& ${Stat}:nth-child(2)`]: {
                borderRight: 'none',
              },
              [`& ${Stat}:last-child`]: {
                pl: '0',
                borderRight: 'none',
              },
            },
            flexWrap: 'wrap',
            '@bp1': {
              m: '0',
              flexWrap: 'nowrap',
              w: 'auto',
              [`& ${Stat}:not(:last-child)`]: {
                borderRight: '1px solid $closeBorder',
              },
              [`& ${Stat}:not(:first-child)`]: {
                pl: '1.125rem',
              },
              [`& ${Stat}:nth-child(3)`]: {
                borderRight: 'none',
                pl: '1.125rem',
              },
            },
          }}
        >
          {stats.map((stat) => (
            <Stat key={stat.id} {...stat} />
          ))}
        </Box>
      </Grid>
    </Flex>
  )
}

export default TokenStats
