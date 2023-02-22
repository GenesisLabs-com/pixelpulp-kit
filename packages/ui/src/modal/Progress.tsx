import { Anchor, Box, Flex, Text } from '../primitives'
import React, { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCube, faWallet } from '@fortawesome/free-solid-svg-icons'
import { useNetwork } from 'wagmi'
import WalletIcon from '../img/WalletIcon'

type Props = {
  title: string
  txHash?: string
  blockExplorerBaseUrl?: string
}

const Progress: FC<Props> = ({ title, txHash, blockExplorerBaseUrl }) => {
  const { chain: activeChain } = useNetwork()

  return (
    <Flex
      direction="column"
      css={{
        alignItems: 'center',
        gap: '$4',
        mt: '$5',
        mb: '$3',
      }}
    >
      <Text style="h6">{title}</Text>
      <Box
        css={{
          backgroundColor: '$priceBackground',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          m: '0 0 1rem',
          textAlign: 'center',
        }}
      >
        <Box
          css={{
            color: '$neutralText',
            backgroundColor: '#7A3EDB',
            borderRadius: '2rem',
            width: '3rem',
            height: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            m: '0 0 1rem',
          }}
        >
          {txHash ? (
            <FontAwesomeIcon
              icon={faCube}
              color="#fff"
              style={{
                width: '22px',
                height: '22px',
              }}
            />
          ) : (
            <WalletIcon />
          )}
        </Box>
        <Text style="body5" color="blackWhite">
          Confirm Transaction in your wallet
        </Text>
      </Box>
      <Anchor
        color="primary"
        weight="medium"
        css={{
          fontSize: 12,
          visibility: txHash ? 'visible' : 'hidden',
        }}
        href={blockExplorerBaseUrl}
        target="_blank"
      >
        View on {activeChain?.blockExplorers?.default.name || 'Etherscan'}
      </Anchor>
    </Flex>
  )
}

export default Progress
