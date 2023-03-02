import { useTokens, useCollections } from '../../hooks'
import React, { FC } from 'react'
import { Text, Box } from '../../primitives'

type Props = {
  token?: NonNullable<NonNullable<ReturnType<typeof useTokens>>['data']>['0']
  collection?: NonNullable<ReturnType<typeof useCollections>['data']>[0]
}

const TokenName: FC<Props> = ({ token, collection }) => {
  return (
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
  )
}

export default TokenName
