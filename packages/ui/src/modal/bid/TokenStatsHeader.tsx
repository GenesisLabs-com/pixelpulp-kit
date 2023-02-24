import { useTokens, useCollections } from '../../hooks'
import React, { FC } from 'react'
import { styled } from '../../../stitches.config'
import { Box, Text } from '../../primitives'
import optimizeImage from '../../lib/optimizeImage'

const Img = styled('img', {
  width: '100%',
  '@bp1': {
    height: 60,
    width: 60,
  },
  borderRadius: '0.75rem',
})

type Props = {
  token?: NonNullable<NonNullable<ReturnType<typeof useTokens>>['data']>['0']
  collection: NonNullable<ReturnType<typeof useCollections>['data']>[0]
}

const TokenStatsHeader: FC<Props> = ({ token, collection }) => {
  const img = optimizeImage(
    token?.token?.image ? token.token.image : (collection?.image as string),
    600
  )

  return (
    <Box
      css={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%',
      }}
    >
      {/* <Text
        style="subtitle2"
        color="subtle"
        css={{ mb: '$1', display: 'block' }}
      >
        {token ? 'Item' : 'Collection'}
      </Text> */}
      <Box
        css={{
          display: 'flex',
          mr: '$4',
          width: 60,
        }}
      >
        <Img
          src={img}
          css={{
            visibility: !img || img.length === 0 ? 'hidden' : 'visible',
            objectFit: 'cover',
          }}
        />
      </Box>
      <Box
        css={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Text
          style="h5"
          css={{
            color: 'blackWhite',
          }}
          ellipsify
        >
          {token?.token
            ? token.token.name || `#${token.token.tokenId}`
            : collection?.name}
        </Text>
        {token && (
          <Text style="subtitle2" as="p" ellipsify>
            {token?.token?.collection?.name}
          </Text>
        )}
      </Box>
    </Box>
  )
}

export default TokenStatsHeader
