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
  borderRadius: '$borderRadius',
})

type Props = {
  token?: NonNullable<NonNullable<ReturnType<typeof useTokens>>['data']>['0']
  collection?: NonNullable<ReturnType<typeof useCollections>['data']>[0]
}

const Token: FC<Props> = ({ token, collection }) => {
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
        // '@bp1': {
        //   mr: 0,
        //   width: '100%',
        // },
      }}
    >
      {/* <Text
        style="subtitle2"
        color="subtle"
        css={{ mb: '$1', display: 'block' }}
      >
        Item
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
            borderRadius: '0.75rem',
          }}
          alt={token?.token?.name || `#${token?.token?.tokenId}`}
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
        >
          {token?.token?.name || `#${token?.token?.tokenId}`}
        </Text>
        <Text style="subtitle2">{token?.token?.collection?.name}</Text>
      </Box>
    </Box>
  )
}

export default Token
