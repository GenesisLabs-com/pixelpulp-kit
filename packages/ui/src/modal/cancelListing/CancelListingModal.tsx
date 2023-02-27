import { useFallbackState, useReservoirClient, useTimeSince } from '../../hooks'
import React, { ReactElement, Dispatch, SetStateAction, useEffect } from 'react'
import { Flex, Text, Box, Button, Loader, Anchor } from '../../primitives'
import {
  CancelListingModalRenderer,
  CancelStep,
} from './CancelListingModalRenderer'
import { Modal } from '../Modal'
import TokenPrimitive from '../TokenPrimitive'
import Progress from '../Progress'
import { useNetwork } from 'wagmi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import OfferCancelledIcon from '../../img/OfferCancelledIcon'

type Props = Pick<Parameters<typeof Modal>['0'], 'trigger'> & {
  openState?: [boolean, Dispatch<SetStateAction<boolean>>]
  listingId?: string
  normalizeRoyalties?: boolean
  onClose?: (data: any, currentStep: CancelStep) => void
  onCancelComplete?: (data: any) => void
  onCancelError?: (error: Error, data: any) => void
}

export function CancelListingModal({
  openState,
  listingId,
  trigger,
  normalizeRoyalties,
  onClose,
  onCancelComplete,
  onCancelError,
}: Props): ReactElement {
  const [open, setOpen] = useFallbackState(
    openState ? openState[0] : false,
    openState
  )
  const client = useReservoirClient()
  const { chain: activeChain } = useNetwork()

  return (
    <CancelListingModalRenderer
      listingId={listingId}
      open={open}
      normalizeRoyalties={normalizeRoyalties}
    >
      {({
        loading,
        listing,
        tokenId,
        contract,
        cancelStep,
        transactionError,
        stepData,
        totalUsd,
        blockExplorerBaseUrl,
        cancelOrder,
      }) => {
        const expires = useTimeSince(listing?.expiration)
        const listingImg = tokenId
          ? `${client?.apiBase}/redirect/tokens/${contract}:${tokenId}/image/v1`
          : `${client?.apiBase}/redirect/collections/${contract}/image/v1`

        useEffect(() => {
          if (cancelStep === CancelStep.Complete && onCancelComplete) {
            const data = {
              listing,
              stepData: stepData,
            }
            onCancelComplete(data)
          }
        }, [cancelStep])

        useEffect(() => {
          if (transactionError && onCancelError) {
            const data = {
              listing,
              stepData: stepData,
            }
            onCancelError(transactionError, data)
          }
        }, [transactionError])

        const isListingAvailable =
          listing &&
          (listing.status === 'active' || listing.status === 'inactive') &&
          !loading

        return (
          <Modal
            trigger={trigger}
            title="Cancel Listing"
            open={open}
            onOpenChange={(open) => {
              if (!open && onClose) {
                const data = {
                  listing,
                  stepData: stepData,
                }
                onClose(data, cancelStep)
              }
              setOpen(open)
            }}
            loading={loading}
          >
            {!isListingAvailable && !loading && (
              <Flex
                direction="column"
                justify="center"
                css={{ px: '$4', py: '$6' }}
              >
                <Text style="h6" css={{ textAlign: 'center' }}>
                  Selected listing is no longer available
                </Text>
              </Flex>
            )}
            {isListingAvailable && cancelStep === CancelStep.Cancel && (
              <Flex direction="column" css={{ p: '1rem 1.625rem 1.625rem' }}>
                {transactionError && (
                  <Flex
                    css={{
                      color: '$errorAccent',
                      p: '$4',
                      gap: '$2',
                      background: '$wellBackground',
                    }}
                    align="center"
                  >
                    <FontAwesomeIcon
                      icon={faCircleExclamation}
                      width={16}
                      height={16}
                    />
                    <Text style="body2" color="errorLight">
                      {transactionError.message}
                    </Text>
                  </Flex>
                )}

                <TokenPrimitive
                  img={listingImg}
                  name={listing?.criteria?.data?.token?.name}
                  price={listing?.price?.amount?.decimal}
                  usdPrice={totalUsd}
                  collection={listing?.criteria?.data?.collection?.name || ''}
                  currencyContract={listing?.price?.currency?.contract}
                  currencyDecimals={listing?.price?.currency?.decimals}
                  expires={expires}
                  source={(listing?.source?.icon as string) || ''}
                />

                <Text
                  style="subtitle2"
                  css={{
                    color: 'pColor',
                    m: '$3 auto 0',
                    maxWidth: '28rem',
                    textAlign: 'center',
                  }}
                >
                  This will cancel your listing. You will be asked to confirm
                  this cancelation from your wallet.
                </Text>
                <Button
                  onClick={cancelOrder}
                  css={{
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: 500,
                    mt: '2.5rem',
                    width: '100%',
                  }}
                >
                  Continue to Cancel
                </Button>
              </Flex>
            )}
            {cancelStep === CancelStep.Approving && (
              <Flex direction="column" css={{ p: '1rem 1.625rem 1.625rem' }}>
                <TokenPrimitive
                  img={listingImg}
                  name={listing?.criteria?.data?.token?.name}
                  price={listing?.price?.amount?.decimal}
                  usdPrice={totalUsd}
                  collection={listing?.criteria?.data?.collection?.name || ''}
                  currencyContract={listing?.price?.currency?.contract}
                  currencyDecimals={listing?.price?.currency?.decimals}
                  expires={expires}
                  source={(listing?.source?.icon as string) || ''}
                />

                {!stepData && <Loader css={{ height: 206 }} />}
                {stepData && (
                  <>
                    <Progress
                      title={
                        stepData?.currentStepItem.txHash
                          ? 'Finalizing on blockchain'
                          : 'Confirm cancelation in your wallet'
                      }
                      txHash={stepData?.currentStepItem.txHash}
                      blockExplorerBaseUrl={`${blockExplorerBaseUrl}/tx/${stepData?.currentStepItem.txHash}`}
                    />
                  </>
                )}
                <Button
                  disabled={true}
                  css={{
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: 500,
                    mt: '2.5rem',
                    width: '100%',
                  }}
                >
                  <Loader />
                  {stepData?.currentStepItem.txHash
                    ? 'Waiting for transaction to be validated'
                    : 'Waiting for approval...'}
                </Button>
              </Flex>
            )}
            {/* {cancelStep === CancelStep.Complete && ( */}
            <Flex direction="column" css={{ p: '1rem 1.625rem 1.625rem' }}>
              <Flex
                css={{
                  p: '$4',
                  py: '$5',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box
                  css={{
                    w: 48,
                    h: 48,
                    m: '1.25rem auto',
                    display: 'flex',
                  }}
                >
                  <OfferCancelledIcon />
                </Box>
                <Text style="h4" css={{ color: 'pColor', mb: '$2' }}>
                  Cancelled!
                </Text>
                <Text style="body4" color="pColor" css={{ mb: 24 }}>
                  <>
                    Your{' '}
                    <Text style="body3" color="accent">
                      {listing?.source?.name as string}
                    </Text>{' '}
                    listing for{' '}
                    <Text style="body3" color="accent">
                      {listing?.criteria?.data?.token?.name ||
                        listing?.criteria?.data?.collection?.name}{' '}
                    </Text>
                    at {listing?.price?.amount?.decimal}{' '}
                    {listing?.price?.currency?.symbol} has been canceled.
                  </>
                </Text>

                <Anchor
                  color="primary"
                  weight="medium"
                  css={{ fontSize: 12 }}
                  href={`${blockExplorerBaseUrl}/tx/${stepData?.currentStepItem.txHash}`}
                  target="_blank"
                >
                  View on{' '}
                  {activeChain?.blockExplorers?.default.name || 'Etherscan'}
                </Anchor>
              </Flex>
              <Button
                onClick={() => {
                  setOpen(false)
                }}
                css={{
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: 500,
                  mt: '2.5rem',
                  width: '100%',
                }}
              >
                Close
              </Button>
            </Flex>
            {/* )} */}
          </Modal>
        )
      }}
    </CancelListingModalRenderer>
  )
}

CancelListingModal.Custom = CancelListingModalRenderer
