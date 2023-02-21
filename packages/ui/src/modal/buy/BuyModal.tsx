import React, { Dispatch, ReactElement, SetStateAction, useEffect } from 'react'
import { useCopyToClipboard, useFallbackState } from '../../hooks'
import {
  Flex,
  Box,
  Text,
  Input,
  Anchor,
  Button,
  FormatCurrency,
  FormatCryptoCurrency,
  Loader,
  Select,
} from '../../primitives'
import Progress from '../Progress'
import Popover from '../../primitives/Popover'
import { Modal } from '../Modal'
import {
  faCopy,
  faCircleExclamation,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TokenLineItem from '../TokenLineItem'
import { BuyModalRenderer, BuyStep, StepData } from './BuyModalRenderer'
import { Execute } from '@reservoir0x/reservoir-sdk'
import ProgressBar from '../ProgressBar'
import { useNetwork } from 'wagmi'
import ExchangeIcon from '../../img/ExchangeIcon'

type PurchaseData = {
  tokenId?: string
  collectionId?: string
  maker?: string
  steps?: Execute['steps']
}

type Props = Pick<Parameters<typeof Modal>['0'], 'trigger'> & {
  openState?: [boolean, Dispatch<SetStateAction<boolean>>]
  tokenId?: string
  collectionId?: string
  orderId?: string
  referrerFeeBps?: number | null
  referrer?: string | null
  normalizeRoyalties?: boolean
  onGoToToken?: () => any
  onPurchaseComplete?: (data: PurchaseData) => void
  onPurchaseError?: (error: Error, data: PurchaseData) => void
  onClose?: (
    data: PurchaseData,
    stepData: StepData | null,
    currentStep: BuyStep
  ) => void
}

function titleForStep(step: BuyStep) {
  switch (step) {
    case BuyStep.AddFunds:
      return 'Add Funds'
    case BuyStep.Unavailable:
      return 'Selected item is no longer Available'
    default:
      return 'Checkout'
  }
}

export function BuyModal({
  openState,
  trigger,
  tokenId,
  collectionId,
  orderId,
  referrer,
  referrerFeeBps,
  normalizeRoyalties,
  onPurchaseComplete,
  onPurchaseError,
  onClose,
  onGoToToken,
}: Props): ReactElement {
  const [open, setOpen] = useFallbackState(
    openState ? openState[0] : false,
    openState
  )
  const { copy: copyToClipboard, copied } = useCopyToClipboard()
  const { chain: activeChain } = useNetwork()

  return (
    <BuyModalRenderer
      open={open}
      tokenId={tokenId}
      collectionId={collectionId}
      orderId={orderId}
      referrer={referrer}
      referrerFeeBps={referrerFeeBps}
      normalizeRoyalties={normalizeRoyalties}
    >
      {({
        loading,
        token,
        collection,
        listing,
        quantityAvailable,
        quantity,
        currency,
        totalPrice,
        referrerFee,
        buyStep,
        transactionError,
        hasEnoughCurrency,
        steps,
        stepData,
        feeUsd,
        totalUsd,
        usdPrice,
        isBanned,
        balance,
        address,
        blockExplorerBaseUrl,
        setQuantity,
        setBuyStep,
        buyToken,
      }) => {
        const title = titleForStep(buyStep)

        useEffect(() => {
          if (buyStep === BuyStep.Complete && onPurchaseComplete) {
            const data: PurchaseData = {
              tokenId: tokenId,
              collectionId: collectionId,
              maker: address,
            }
            if (steps) {
              data.steps = steps
            }
            onPurchaseComplete(data)
          }
        }, [buyStep])

        useEffect(() => {
          if (transactionError && onPurchaseError) {
            const data: PurchaseData = {
              tokenId: tokenId,
              collectionId: collectionId,
              maker: address,
            }
            onPurchaseError(transactionError, data)
          }
        }, [transactionError])

        const executableSteps =
          steps?.filter((step) => step.items && step.items.length > 0) || []
        const lastStepItems =
          executableSteps[executableSteps.length - 1]?.items || []
        let finalTxHash = lastStepItems[lastStepItems.length - 1]?.txHash

        let price = (listing?.price?.amount?.decimal || 0) * quantity

        if (!price && token?.token?.lastSell?.value) {
          price = token?.token.lastSell.value
        }

        const sourceImg = listing?.source
          ? (listing?.source['icon'] as string)
          : undefined

        return (
          <Modal
            trigger={trigger}
            title={title}
            onBack={
              buyStep == BuyStep.AddFunds
                ? () => {
                    setBuyStep(BuyStep.Checkout)
                  }
                : null
            }
            open={open}
            onOpenChange={(open) => {
              if (!open && onClose) {
                const data: PurchaseData = {
                  tokenId: tokenId,
                  collectionId: collectionId,
                  maker: address,
                }
                onClose(data, stepData, buyStep)
              }
              setOpen(open)
            }}
            loading={loading}
          >
            <div
              style={{
                boxSizing: 'border-box',
                padding: '1.625rem',
                width: '100%',
              }}
            >
              {buyStep === BuyStep.Unavailable && !loading && (
                <Flex direction="column">
                  <TokenLineItem
                    tokenDetails={token}
                    collection={collection}
                    isSuspicious={isBanned}
                    usdConversion={usdPrice || 0}
                    isUnavailable={true}
                    price={price}
                    currency={currency}
                    sourceImg={sourceImg}
                  />
                  <Button
                    onClick={() => {
                      setOpen(false)
                    }}
                    css={{ my: '$4', borderRadius: '0.75rem' }}
                  >
                    Close
                  </Button>
                </Flex>
              )}

              {buyStep === BuyStep.Checkout && !loading && (
                <Flex direction="column">
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
                  <TokenLineItem
                    tokenDetails={token}
                    collection={collection}
                    usdConversion={usdPrice || 0}
                    isSuspicious={isBanned}
                    price={price}
                    currency={currency}
                    sourceImg={sourceImg}
                  />
                  {quantityAvailable > 1 && (
                    <Flex
                      css={{ pt: '$4', px: '$4' }}
                      align="center"
                      justify="between"
                    >
                      <Text style="body2" color="subtle">
                        {quantityAvailable} listings are available at this price
                      </Text>
                      <Select
                        css={{ minWidth: 77, width: 'auto', flexGrow: 0 }}
                        value={`${quantity}`}
                        onValueChange={(value: string) => {
                          setQuantity(Number(value))
                        }}
                      >
                        {[...Array(quantityAvailable)].map((_a, i) => (
                          <Select.Item key={i} value={`${i + 1}`}>
                            <Select.ItemText>{i + 1}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select>
                    </Flex>
                  )}
                  {referrerFee > 0 && (
                    <>
                      <Flex
                        align="center"
                        justify="between"
                        css={{ pt: '$4', px: '$4' }}
                      >
                        <Text style="subtitle2">Referral Fee</Text>
                        <FormatCryptoCurrency
                          amount={referrerFee}
                          address={currency?.contract}
                          decimals={currency?.decimals}
                        />
                      </Flex>
                      <Flex justify="end">
                        <FormatCurrency
                          amount={feeUsd}
                          color="subtle"
                          css={{ pr: '$4' }}
                        />
                      </Flex>
                    </>
                  )}

                  <Flex
                    align="center"
                    justify="between"
                    css={{
                      backgroundColor: '$priceBackground',
                      borderBottomLeftRadius: '0.75rem',
                      borderBottomRightRadius: '0.75rem',
                      padding: '0 1rem 1rem',
                    }}
                  >
                    <Box
                      css={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid $borderColor',
                        width: '100%',
                        pt: '1rem',
                      }}
                    >
                      <Text style="subtitle2" color="subtle">
                        Total
                      </Text>
                      <Flex justify="end" direction="column">
                        <FormatCryptoCurrency
                          textStyle="h6"
                          amount={totalPrice}
                          address={currency?.contract}
                          decimals={currency?.decimals}
                        />
                        <FormatCurrency amount={totalUsd} color="subtle" />
                      </Flex>
                    </Box>
                  </Flex>

                  <Box css={{ py: '$4', width: '100%' }}>
                    {hasEnoughCurrency ? (
                      <Button
                        onClick={buyToken}
                        css={{ width: '100%', borderRadius: '0.75rem' }}
                        color="primary"
                      >
                        Checkout
                      </Button>
                    ) : (
                      <Flex direction="column" align="end">
                        <Flex align="center" css={{ mb: '$3' }}>
                          <Text css={{ mr: '$3' }} color="error" style="body2">
                            Insufficient Balance
                          </Text>

                          <FormatCryptoCurrency
                            amount={balance}
                            address={currency?.contract}
                            decimals={currency?.decimals}
                            textStyle="body2"
                          />
                        </Flex>

                        <Button
                          onClick={() => {
                            setBuyStep(BuyStep.AddFunds)
                          }}
                          css={{ width: '100%', borderRadius: '0.75rem' }}
                        >
                          Add Funds
                        </Button>
                      </Flex>
                    )}
                  </Box>
                </Flex>
              )}

              {buyStep === BuyStep.Approving && token && (
                <Flex direction="column">
                  <TokenLineItem
                    tokenDetails={token}
                    collection={collection}
                    usdConversion={usdPrice || 0}
                    isSuspicious={isBanned}
                    price={price}
                    currency={currency}
                    sourceImg={sourceImg}
                  />
                  {stepData && stepData.totalSteps > 1 && (
                    <ProgressBar
                      css={{ px: '$4', mt: '$3' }}
                      value={stepData?.stepProgress || 0}
                      max={stepData?.totalSteps || 0}
                    />
                  )}
                  {!stepData && <Loader css={{ height: 206 }} />}
                  {stepData && (
                    <Progress
                      title={stepData?.currentStep.action || ''}
                      txHash={stepData?.currentStepItem.txHash}
                      blockExplorerBaseUrl={`${blockExplorerBaseUrl}/tx/${stepData?.currentStepItem.txHash}`}
                    />
                  )}
                  <Button
                    disabled={true}
                    css={{ m: '$4', borderRadius: '0.75rem' }}
                  >
                    <Loader />
                    {stepData?.currentStepItem.txHash
                      ? 'Waiting for transaction to be validated'
                      : 'Waiting for approval...'}
                  </Button>
                </Flex>
              )}

              {buyStep === BuyStep.Complete && token && (
                <Flex direction="column">
                  <Flex
                    css={{
                      p: '$4',
                      py: '$5',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <img
                      src={token?.token?.image}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: '0.75rem',
                      }}
                    />
                    <Flex
                      css={{ mb: 24, mt: '$2', maxWidth: '100%' }}
                      align="center"
                      justify="center"
                      direction="column"
                    >
                      {!!token.token?.collection?.image && (
                        <Box css={{ mr: '$1' }}>
                          <img
                            src={token.token?.collection?.image}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                            }}
                          />
                        </Box>
                      )}

                      <Text
                        style="subtitle2"
                        css={{ maxWidth: '100%' }}
                        ellipsify
                      >
                        {token?.token?.name
                          ? token?.token?.name
                          : `#${token?.token?.tokenId}`}
                      </Text>
                      <Text style="h5" css={{ mt: 24 }}>
                        Congratulations!
                      </Text>
                    </Flex>

                    <Flex css={{ mb: '$2' }} align="center">
                      {/* <Box css={{ color: '$successAccent', mr: '$2' }}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </Box> */}
                      <Text style="body1" css={{ color: '$pColor' }}>
                        Your transaction went through successfully
                      </Text>
                    </Flex>
                    <Anchor
                      color="primary"
                      weight="medium"
                      css={{ fontSize: 16, fontWeight: 600 }}
                      href={`${blockExplorerBaseUrl}/tx/${finalTxHash}`}
                      target="_blank"
                    >
                      View on{' '}
                      {activeChain?.blockExplorers?.default.name || 'Etherscan'}
                    </Anchor>
                  </Flex>
                  <Flex
                    css={{
                      p: '$4',
                      flexDirection: 'column',
                      gap: '$3',
                      '@bp1': {
                        flexDirection: 'row',
                      },
                    }}
                  >
                    {!!onGoToToken ? (
                      <>
                        <Button
                          onClick={() => {
                            setOpen(false)
                          }}
                          css={{ flex: 1, borderRadius: '0.75rem' }}
                          color="ghost"
                        >
                          Close
                        </Button>
                        <Button
                          style={{ flex: 1, borderRadius: '0.75rem' }}
                          color="primary"
                          onClick={() => {
                            onGoToToken()
                          }}
                        >
                          Go to Token
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          setOpen(false)
                        }}
                        style={{ flex: 1, borderRadius: '0.75rem' }}
                        color="primary"
                      >
                        Close
                      </Button>
                    )}
                  </Flex>
                </Flex>
              )}

              {buyStep === BuyStep.AddFunds && token && (
                <Flex direction="column">
                  <Flex
                    css={{
                      py: '$5',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
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
                        }}
                      >
                        {/* <FontAwesomeIcon
                      icon={faExchange}
                      style={{
                        width: '32px',
                        height: '32px',
                        margin: '12px 0px',
                      }}
                    /> */}
                        <ExchangeIcon />
                      </Box>
                      <Text style="body1" css={{ my: 24 }}>
                        <Popover
                          content={
                            <Text style={'body2'}>
                              Trade one crypto for another on a crypto exchange.
                              Popular decentralized exchanges include{' '}
                              <Anchor
                                css={{ fontSize: 12 }}
                                href="https://app.uniswap.org/"
                                target="_blank"
                                color="primary"
                              >
                                Uniswap
                              </Anchor>
                              ,{' '}
                              <Anchor
                                css={{ fontSize: 12 }}
                                href="https://app.sushi.com/"
                                target="_blank"
                                color="primary"
                              >
                                SushiSwap
                              </Anchor>{' '}
                              and many others.
                            </Text>
                          }
                        >
                          <Text as="span" color="accent">
                            Exchange currencies
                          </Text>
                        </Popover>{' '}
                        or transfer funds to your
                        <br /> wallet address below:
                      </Text>
                    </Box>
                    <Box css={{ width: '100%', position: 'relative' }}>
                      <Text
                        style="h6"
                        css={{
                          display: 'block',
                          m: '0 0 1rem',
                          textAlign: 'left',
                        }}
                      >
                        Wallet Address
                      </Text>
                      <Flex
                        css={{
                          pointerEvents: 'none',
                          opacity: copied ? 1 : 0,
                          position: 'absolute',
                          inset: 0,
                          borderRadius: 8,
                          transition: 'all 200ms ease-in-out',
                          pl: '$4',
                          alignItems: 'center',
                          zIndex: 3,
                          textAlign: 'left',
                          background: '$neutralBg',
                        }}
                      >
                        <Text style={'body1'}>Copied Address!</Text>
                      </Flex>
                      <Input
                        readOnly
                        onClick={() => copyToClipboard(address as string)}
                        value={address || ''}
                        css={{
                          color: '$neutralText',
                          textAlign: 'left',
                        }}
                      />
                      <Box
                        css={{
                          position: 'absolute',
                          right: '$3',
                          top: '73%',
                          touchEvents: 'none',
                          transform: 'translateY(-50%)',
                          color: '$neutralText',
                          pointerEvents: 'none',
                        }}
                      >
                        <FontAwesomeIcon icon={faCopy} width={16} height={16} />
                      </Box>
                    </Box>
                  </Flex>
                  <Button
                    css={{ my: '$4', borderRadius: '0.75rem' }}
                    color="primary"
                    onClick={() => copyToClipboard(address as string)}
                  >
                    Copy Wallet Address
                  </Button>
                </Flex>
              )}
            </div>
          </Modal>
        )
      }}
    </BuyModalRenderer>
  )
}

BuyModal.Custom = BuyModalRenderer
