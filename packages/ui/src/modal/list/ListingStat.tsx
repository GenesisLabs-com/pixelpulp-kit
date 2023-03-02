import React, { FC } from 'react'
import { Flex, Text, FormatCryptoCurrency } from '../../primitives'
import { styled } from '../../../stitches.config'
import { Listings } from './ListModalRenderer'
import { useTimeSince } from '../../hooks'
import { Currency } from '../../types/Currency'

const Img = styled('img', {
  width: 16,
  height: 16,
  ml: 5,
})

type Props = {
  listing: Listings[0]
  marketImg: string
  currency: Currency
}

const ListingStat: FC<Props> = ({ listing, marketImg, currency, ...props }) => {
  const timeSince = useTimeSince(
    listing.expirationTime ? +listing.expirationTime : 0
  )

  return (
    <Flex
      direction="row"
      className="rk-stat-well"
      css={{
        backgroundColor: '$wellBackground',
        p: '1rem',
        borderRadius: '0.75rem',
        gap: '$1',
        justifyContent: 'space-between',
      }}
      {...props}
    >
      <Flex justify="start">
        <FormatCryptoCurrency
          amount={listing.weiPrice}
          textStyle="subtitle2"
          address={currency.contract}
          decimals={currency.decimals}
        />
        <Img src={marketImg} />
      </Flex>
      <Text style="subtitle2" color="subtle" as="p">
        {listing.expirationTime ? `Expires ${timeSince}` : 'No Expiration'}
      </Text>
    </Flex>
  )
}

ListingStat.toString = () => '.rk-stat-well'

export default ListingStat
