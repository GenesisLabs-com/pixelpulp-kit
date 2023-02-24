import { useFallbackState, useReservoirClient, useTimeSince } from '../../hooks'
import React, { ReactElement, Dispatch, SetStateAction, useEffect } from 'react'
import { Flex, Text, Box, Button, Loader, Anchor } from '../../primitives'
import { CancelBidModalRenderer, CancelStep } from './CancelBidModalRenderer'
import { Modal } from '../Modal'
import TokenPrimitive from '../../modal/TokenPrimitive'
import Progress from '../Progress'
import { useNetwork } from 'wagmi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import OfferCancelledIcon from '../../img/OfferCancelledIcon'

type Props = Pick<Parameters<typeof Modal>['0'], 'trigger'> & {
  openState?: [boolean, Dispatch<SetStateAction<boolean>>]
  bidId?: string
  normalizeRoyalties?: boolean
  onClose?: (data: any, currentStep: CancelStep) => void
  onCancelComplete?: (data: any) => void
  onCancelError?: (error: Error, data: any) => void
}

export function CancelBidModal({
  openState,
  bidId,
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
    <CancelBidModalRenderer
      bidId={bidId}
      open={open}
      normalizeRoyalties={normalizeRoyalties}
    >
      {({
        loading,
        bid,
        tokenId,
        cancelStep,
        transactionError,
        stepData,
        totalUsd,
        blockExplorerBaseUrl,
        cancelOrder,
      }) => {
        const expires = useTimeSince(bid?.expiration)
        const collectionId = bid?.criteria?.data?.collection?.id
        const bidImg = tokenId
          ? `${client?.apiBase}/redirect/tokens/${collectionId}:${tokenId}/image/v1`
          : `${client?.apiBase}/redirect/collections/${collectionId}/image/v1`
        const isAttributeOffer = (bid?.criteria?.kind as any) === 'attribute'

        useEffect(() => {
          if (cancelStep === CancelStep.Complete && onCancelComplete) {
            const data = {
              bid,
              stepData: stepData,
            }
            onCancelComplete(data)
          }
        }, [cancelStep])

        useEffect(() => {
          if (transactionError && onCancelError) {
            const data = {
              bid,
              stepData: stepData,
            }
            onCancelError(transactionError, data)
          }
        }, [transactionError])

        const isBidAvailable =
          bid &&
          (bid.status === 'active' || bid.status === 'inactive') &&
          !loading

        return (
          <Modal
            trigger={trigger}
            title="Cancel your Offer"
            open={open}
            onOpenChange={(open) => {
              if (!open && onClose) {
                const data = {
                  bid,
                  stepData: stepData,
                }
                onClose(data, cancelStep)
              }
              setOpen(open)
            }}
            loading={loading}
          >
            {!isBidAvailable && !loading && (
              <Flex
                direction="column"
                justify="center"
                css={{ px: '$4', py: '$6' }}
              >
                <Text
                  style="h5"
                  color="blackWhite"
                  css={{ textAlign: 'center' }}
                >
                  Selected bid is no longer available
                </Text>
              </Flex>
            )}
            {isBidAvailable && cancelStep === CancelStep.Cancel && (
              <Flex
                direction="column"
                justify="center"
                css={{ p: '1rem 1.625rem 1.625rem' }}
              >
                {transactionError && (
                  <Flex
                    css={{
                      color: '$errorAccent',
                      borderRadius: '0.75rem',
                      p: '1rem',
                      gap: '$2',
                      background: '$priceBackground',
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
                <Box>
                  <TokenPrimitive
                    img={bidImg}
                    name={bid?.criteria?.data?.token?.name}
                    price={bid?.price?.amount?.decimal}
                    usdPrice={totalUsd}
                    collection={bid?.criteria?.data?.collection?.name || ''}
                    currencyContract={bid?.price?.currency?.contract}
                    currencyDecimals={bid?.price?.currency?.decimals}
                    expires={expires}
                    source={(bid?.source?.icon as string) || ''}
                    isOffer={true}
                  />
                </Box>
                <Text
                  style="body3"
                  color="subtle"
                  css={{ my: '2.5rem', textAlign: 'center' }}
                >
                  This will cancel your offer. You will be asked to confirm this
                  cancelation from your wallet.
                </Text>
                <Button
                  onClick={cancelOrder}
                  css={{
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: 500,
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
                  img={bidImg}
                  name={bid?.criteria?.data?.token?.name}
                  price={bid?.price?.amount?.decimal}
                  usdPrice={totalUsd}
                  collection={bid?.criteria?.data?.collection?.name || ''}
                  currencyContract={bid?.price?.currency?.contract}
                  currencyDecimals={bid?.price?.currency?.decimals}
                  expires={expires}
                  source={(bid?.source?.icon as string) || ''}
                  isOffer={true}
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
                    {isAttributeOffer && !stepData?.currentStepItem.txHash && (
                      <Flex justify="center">
                        <Text
                          style="body3"
                          color="subtle"
                          css={{ maxWidth: 400, textAlign: 'center', mx: '$3' }}
                        >
                          This will cancel your offer on all items that were
                          included in this attribute offer.
                        </Text>
                      </Flex>
                    )}
                  </>
                )}
                <Button
                  disabled={true}
                  css={{
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: 500,
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
            {cancelStep === CancelStep.Complete && (
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
                  <Text style="h5" css={{ mb: '$2' }}>
                    Offer Cancelled!
                  </Text>
                  <Text
                    style="body4"
                    css={{ maxWidth: '100%', color: '$pColor' }}
                    ellipsify
                  >
                    <>
                      Your{' '}
                      <Text style="body3" color="accent">
                        {bid?.source?.name as string}
                      </Text>{' '}
                      offer for{' '}
                      <Text style="body3" color="accent">
                        {bid?.criteria?.data?.token?.name ||
                          bid?.criteria?.data?.collection?.name}{' '}
                      </Text>
                      at {bid?.price?.amount?.decimal}{' '}
                      {bid?.price?.currency?.symbol} has been cancelled.
                    </>
                  </Text>
                </Flex>
                <Flex
                  css={{
                    alignItems: 'center',
                    flexDirection: 'column',
                    mt: '2.5rem 0 0',
                    w: '100%',
                  }}
                >
                  <Button
                    onClick={() => {
                      setOpen(false)
                    }}
                    css={{
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: 500,
                      width: '100%',
                    }}
                  >
                    Close
                  </Button>
                  <Anchor
                    color="primary"
                    css={{ fontSize: 16, fontWeight: 600, mt: '1rem' }}
                    href={`${blockExplorerBaseUrl}/tx/${stepData?.currentStepItem.txHash}`}
                    target="_blank"
                  >
                    View on{' '}
                    {activeChain?.blockExplorers?.default.name || 'Etherscan'}
                  </Anchor>
                </Flex>
              </Flex>
            )}
          </Modal>
        )
      }}
    </CancelBidModalRenderer>
  )
}

CancelBidModal.Custom = CancelBidModalRenderer
