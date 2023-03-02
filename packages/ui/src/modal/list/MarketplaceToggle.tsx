import React from 'react'

import { Box, Text, Flex, Switch } from '../../primitives'
import { Marketplace } from '../../hooks/useMarketplaces'

type MarketPlaceToggleProps = {
  marketplace: Marketplace
  onSelection: () => void
}

const MarketplaceToggle = ({
  marketplace,
  onSelection,
  ...props
}: MarketPlaceToggleProps) => (
  <Flex
    {...props}
    align="center"
    css={{ w: '100%', justifyContent: 'space-between' }}
  >
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Flex css={{ mr: '$2', display: 'flex', alignItems: 'center' }}>
        <img
          src={marketplace.imageUrl}
          style={{ height: 32, width: 32, borderRadius: 4 }}
        />
      </Flex>
      <Flex direction="column">
        <Text style="body4" color="blackWhite" css={{ flex: 1 }}>
          {marketplace.name}
        </Text>
        <Text
          style="subtitle2"
          color="subtle"
          css={{ color: '$pColor', mr: '$2' }}
        >
          Marketplace fee: {(marketplace.feeBps || 0) * 100}%
        </Text>
      </Flex>
    </Box>
    <Switch checked={marketplace.isSelected} onCheckedChange={onSelection} />
  </Flex>
)

export default MarketplaceToggle
