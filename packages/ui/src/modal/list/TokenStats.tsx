import React, { FC } from 'react'
import { Flex, Box, Text } from '../../primitives'
import Token from './Token'
import Stat from '../Stat'
import { useTokens, useCollections } from '../../hooks'
// import InfoTooltip from '../../primitives/InfoTooltip'
// import TokenName from './TokenName'

type Props = {
  token?: NonNullable<NonNullable<ReturnType<typeof useTokens>>['data']>['0']
  collection?: NonNullable<ReturnType<typeof useCollections>['data']>[0]
}

const TokenStats: FC<Props> = ({ token, collection }) => {
  let attributeFloor = token?.token?.attributes
    ? Math.max(
        ...token.token.attributes.map((attr: any) =>
          Number(attr.floorAskPrice)
        ),
        0
      )
    : 0
  return (
    <Flex
      css={{
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <Token collection={collection} token={token} />
      <Box
        css={{
          display: 'flex',
          flexDirection: 'column',
          w: '100%',
        }}
      >
        <Box
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            mt: '$4',
            [`& ${Stat}:nth-child(3)`]: {
              borderRight: 'none',
            },
            [`& ${Stat}:nth-child(2)`]: {
              justifyContent: 'center',
              minWidth: '6.5rem',
            },
            [`& ${Stat}:first-child`]: {
              pl: '0',
            },
            [`& ${Stat}:last-child`]: {
              pl: '0',
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
              [`& ${Stat}:nth-child(3)`]: {
                borderRight: '1px solid $closeBorder',
                pl: '0',
              },
              [`& ${Stat}:last-child`]: {
                pl: '1rem',
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
            },
          }}
        >
          {[
            {
              id: 0,
              label: (
                <>
                  <Text
                    css={{
                      minWidth: '0',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '$pColor',
                    }}
                    ellipsify
                  >
                    Creator Royalties
                  </Text>
                  {/* <InfoTooltip
                    side="right"
                    width={200}
                    content={
                      'A fee on every order that goes to the collection creator.'
                    }
                  /> */}
                </>
              ),
              value: (collection?.royalties?.bps || 0) * 0.01 + '%',
            },
            {
              id: 1,
              label: (
                <Text
                  css={{
                    minWidth: '0',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '$pColor',
                  }}
                  ellipsify
                >
                  Last Sale
                </Text>
              ),
              value: token?.token?.lastSell?.value || null,
              asNative: true,
            },
            {
              id: 2,
              label: (
                <Text
                  css={{
                    minWidth: '0',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '$pColor',
                  }}
                  ellipsify
                >
                  Collection Floor
                </Text>
              ),
              value: collection?.floorAsk?.price?.amount?.native || 0,
              asNative: true,
            },
            {
              id: 3,
              label: (
                <>
                  <Text
                    css={{
                      minWidth: '0',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '$pColor',
                    }}
                    ellipsify
                  >
                    Highest Trait Floor
                  </Text>
                  {/* <InfoTooltip
                    side="right"
                    width={200}
                    content={
                      'The floor price of the most valuable trait of a token.'
                    }
                  /> */}
                </>
              ),
              value:
                attributeFloor ||
                collection?.floorAsk?.price?.amount?.native ||
                0,
              asNative: true,
            },
          ].map((stat) => (
            <Stat key={stat.id} {...stat} />
          ))}
        </Box>
      </Box>
    </Flex>
  )
}

export default TokenStats
