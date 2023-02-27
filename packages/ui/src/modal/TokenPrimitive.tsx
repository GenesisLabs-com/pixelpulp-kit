import { styled } from '../../stitches.config'
import React, { FC } from 'react'
import {
  Box,
  Flex,
  Text,
  Grid,
  FormatCurrency,
  FormatCryptoCurrency,
} from '../primitives'
// import Fees from './acceptBid/Fees'

type Props = {
  img?: string
  name?: string
  collection: string
  currencyContract?: string
  currencyDecimals?: number
  source?: string
  price?: number
  usdPrice?: number | string
  expires?: string
  warning?: string
  isOffer?: boolean
  fees?: any
  isUnavailable?: boolean
  image?: any
}

const Img = styled('img', {
  height: 56,
  width: 56,
})

const TokenPrimitive: FC<Props> = ({
  img,
  name,
  collection,
  currencyContract,
  currencyDecimals,
  expires,
  warning,
  isOffer,
  source,
  usdPrice,
  price,
  isUnavailable,
}) => {
  return (
    <Box>
      <Flex css={{ justifyContent: 'space-between', flexDirection: 'column' }}>
        <Flex css={{ alignItems: 'center' }}>
          <Box
            css={{
              display: 'flex',
              mr: '$4',
              width: 60,
            }}
          >
            {' '}
            <Img
              src={img}
              alt={name}
              css={{
                borderRadius: 12,
                overflow: 'hidden',
                visibility: !img || img.length === 0 ? 'hidden' : 'visible',
                flexShrink: 0,
                objectFit: 'cover',
                width: 60,
                height: 60,
              }}
            />
          </Box>
          <Grid css={{ rowGap: 2 }}>
            <Text
              style="h5"
              ellipsify
              color={isUnavailable ? 'blackWhite' : 'base'}
            >
              {name ? name : collection}
            </Text>
            {name && (
              <Text style="body2" color={isUnavailable ? 'subtle' : 'base'}>
                {collection}
              </Text>
            )}
          </Grid>
        </Flex>
        <Flex
          css={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            mt: '1rem',
          }}
        >
          <Flex
            align="start"
            justify="between"
            className="rk-stat-well"
            direction="column"
            css={{
              backgroundColor: 'transparent',
              pr: '1rem',
              mr: '1rem',
              borderRight: '1px solid $closeBorder',
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
              Offer Price{' '}
              {source && (
                <Img
                  src={source}
                  alt="Source Icon"
                  css={{
                    w: 23,
                    h: 23,
                    borderRadius: 99999,
                    overflow: 'hidden',
                  }}
                />
              )}
            </Flex>

            <Box
              css={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'row',
                rowGap: 4,
              }}
            >
              {price ? (
                <FormatCryptoCurrency
                  amount={price}
                  textColor={isUnavailable ? 'blackWhite' : 'base'}
                  address={currencyContract}
                  decimals={currencyDecimals}
                  logoWidth={14.5}
                />
              ) : (
                <Text
                  style="subtitle2"
                  color={isUnavailable ? 'blackWhite' : 'base'}
                >
                  --
                </Text>
              )}
              {usdPrice ? (
                <FormatCurrency
                  amount={usdPrice}
                  style="subtitle2"
                  color="blackWhite"
                />
              ) : null}
              {warning && (
                <Text style="subtitle2" color="error">
                  {warning}
                </Text>
              )}
            </Box>
          </Flex>
          <Flex
            align="start"
            justify="between"
            className="rk-stat-well"
            direction="column"
            css={{
              backgroundColor: 'transparent',
              p: 0,
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
              {!!expires && <> {expires}</>}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}

export default TokenPrimitive
