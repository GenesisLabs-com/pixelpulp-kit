import React, {
  ReactElement,
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import { styled } from '../../../stitches.config'
import {
  Flex,
  Text,
  FormatWrappedCurrency,
  Box,
  Input,
  Select,
  DateInput,
  Button,
  ErrorWell,
  Loader,
  FormatCurrency,
  FormatCryptoCurrency,
  CryptoCurrencyIcon,
} from '../../primitives'

import { Modal, ModalSize } from '../Modal'
import {
  BidModalRenderer,
  BidStep,
  BidData,
  Trait,
  StepData,
} from './BidModalRenderer'
import TokenStats from './TokenStats'
import dayjs from 'dayjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendar,
  faClose,
  faChevronDown,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons'
import Flatpickr from 'react-flatpickr'
import TransactionProgress from '../TransactionProgress'
import ProgressBar from '../ProgressBar'
import getLocalMarketplaceData from '../../lib/getLocalMarketplaceData'
import TransactionBidDetails from './TransactionBidDetails'
import AttributeSelector from './AttributeSelector'
import Popover from '../../primitives/Popover'
import PseudoInput from '../../primitives/PseudoInput'
import { useFallbackState } from '../../hooks'
import SuccessIcon from '../../img/SuccessIcon'

type BidCallbackData = {
  tokenId?: string
  collectionId?: string
  bidData: BidData | null
}

type Props = Pick<Parameters<typeof Modal>['0'], 'trigger'> & {
  openState?: [boolean, Dispatch<SetStateAction<boolean>>]
  tokenId?: string
  collectionId?: string
  attribute?: Trait
  normalizeRoyalties?: boolean
  onViewOffers?: () => void
  onClose?: (
    data: BidCallbackData,
    stepData: StepData | null,
    currentStep: BidStep
  ) => void
  onBidComplete?: (data: any) => void
  onBidError?: (error: Error, data: any) => void
}

function titleForStep(step: BidStep) {
  switch (step) {
    case BidStep.SetPrice:
      return 'Make an Offer'
    case BidStep.Offering:
      return 'Complete Offer'
    case BidStep.Complete:
      return 'Offer Submitted'
  }
}

const ContentContainer = styled(Flex, {
  width: '100%',
  flexDirection: 'column',
  // '@bp1': {
  //   flexDirection: 'row',
  // },
})

const MainContainer = styled(Flex, {
  flex: 1,
  borderColor: '$borderColor',
  borderTopWidth: 1,
  borderLeftWidth: 0,
  '@bp1': {
    borderTopWidth: 0,
    borderLeftWidth: 1,
  },

  defaultVariants: {
    direction: 'column',
  },
})

const minimumDate = dayjs().add(1, 'h').format('MM/DD/YYYY h:mm A')
export function BidModal({
  openState,
  trigger,
  tokenId,
  collectionId,
  attribute,
  normalizeRoyalties,
  onViewOffers,
  onClose,
  onBidComplete,
  onBidError,
}: Props): ReactElement {
  const [open, setOpen] = useFallbackState(
    openState ? openState[0] : false,
    openState
  )

  const datetimeElement = useRef<Flatpickr | null>(null)
  const [stepTitle, setStepTitle] = useState('')
  const [localMarketplace, setLocalMarketplace] = useState<ReturnType<
    typeof getLocalMarketplaceData
  > | null>(null)
  const [attributesSelectable, setAttributesSelectable] = useState(false)

  useEffect(() => {
    setLocalMarketplace(getLocalMarketplaceData())
  }, [])
  const [attributeSelectorOpen, setAttributeSelectorOpen] = useState(false)

  return (
    <BidModalRenderer
      open={open}
      tokenId={tokenId}
      collectionId={collectionId}
      attribute={attribute}
      normalizeRoyalties={normalizeRoyalties}
    >
      {({
        token,
        collection,
        attributes,
        bidStep,
        expirationOption,
        expirationOptions,
        wrappedBalance,
        wrappedContractName,
        wrappedContractAddress,
        bidAmount,
        bidAmountUsd,
        hasEnoughNativeCurrency,
        hasEnoughWrappedCurrency,
        amountToWrap,
        balance,
        uniswapConvertLink,
        transactionError,
        stepData,
        bidData,
        isBanned,
        setBidAmount,
        setExpirationOption,
        setBidStep,
        setTrait,
        trait,
        placeBid,
      }) => {
        const [expirationDate, setExpirationDate] = useState('')

        const tokenCount = collection?.tokenCount
          ? +collection.tokenCount
          : undefined

        const itemImage =
          token && token.token?.image
            ? token.token?.image
            : (collection?.image as string)

        useEffect(() => {
          if (stepData) {
            switch (stepData.currentStep.kind) {
              case 'signature': {
                setStepTitle('Confirm Offer')
                break
              }
              default: {
                setStepTitle(stepData.currentStep.action)
                break
              }
            }
          }
        }, [stepData])

        useEffect(() => {
          if (expirationOption && expirationOption.relativeTime) {
            const newExpirationTime = expirationOption.relativeTimeUnit
              ? dayjs().add(
                  expirationOption.relativeTime,
                  expirationOption.relativeTimeUnit
                )
              : dayjs.unix(expirationOption.relativeTime)
            setExpirationDate(newExpirationTime.format('MM/DD/YYYY h:mm A'))
          } else {
            setExpirationDate('')
          }
        }, [expirationOption])

        useEffect(() => {
          if (bidStep === BidStep.Complete && onBidComplete) {
            const data: BidCallbackData = {
              tokenId: tokenId,
              collectionId: collectionId,
              bidData,
            }
            onBidComplete(data)
          }
        }, [bidStep])

        useEffect(() => {
          if (transactionError && onBidError) {
            const data: BidCallbackData = {
              tokenId: tokenId,
              collectionId: collectionId,
              bidData,
            }
            onBidError(transactionError, data)
          }
        }, [transactionError])

        useEffect(() => {
          if (open && attributes && !tokenId && attribute) {
            setTrait(attribute)
          } else {
            setTrait(undefined)
          }

          if (open && attributes && !tokenId) {
            let attributeCount = 0
            for (let i = 0; i < attributes.length; i++) {
              attributeCount += attributes[i].attributeCount || 0
              if (attributeCount >= 2000) {
                break
              }
            }
            if (attributeCount >= 2000) {
              setAttributesSelectable(false)
            } else {
              setAttributesSelectable(true)
            }
          } else {
            setAttributesSelectable(false)
          }
        }, [open, attributes])

        return (
          <Modal
            size={bidStep !== BidStep.Complete ? ModalSize.LG : ModalSize.MD}
            trigger={trigger}
            title={titleForStep(bidStep)}
            open={open}
            onOpenChange={(open) => {
              if (!open && onClose) {
                const data: BidCallbackData = {
                  tokenId: tokenId,
                  collectionId: collectionId,
                  bidData,
                }
                onClose(data, stepData, bidStep)
              }

              setOpen(open)
            }}
            loading={!collection}
            onPointerDownOutside={(e) => {
              if (
                e.target instanceof Element &&
                datetimeElement.current?.flatpickr?.calendarContainer &&
                datetimeElement.current.flatpickr.calendarContainer.contains(
                  e.target
                )
              ) {
                e.preventDefault()
              }
            }}
            onFocusCapture={(e) => {
              e.stopPropagation()
            }}
          >
            {bidStep === BidStep.SetPrice && collection && (
              <ContentContainer>
                <TokenStats
                  token={token ? token : undefined}
                  collection={collection}
                  trait={trait}
                />
                <MainContainer css={{ p: '1rem 1.625rem 1.625rem' }}>
                  {isBanned && (
                    <ErrorWell
                      message="Token is not tradable on OpenSea"
                      css={{ mb: '$2', p: '$2', borderRadius: 4 }}
                    />
                  )}
                  <Flex justify="between">
                    <Text style="body1" color="blackWhite">
                      Offer Amount
                    </Text>
                    <Text
                      as={Flex}
                      css={{ gap: '$1' }}
                      align="center"
                      color="blackWhite"
                      style="body2"
                    >
                      Balance:{' '}
                      <FormatWrappedCurrency
                        logoWidth={10}
                        textStyle="body2"
                        amount={wrappedBalance?.value}
                      />{' '}
                    </Text>
                  </Flex>
                  <Flex css={{ mt: '$2', gap: 20 }}>
                    <Text
                      as={Flex}
                      css={{
                        gap: '$2',
                        flexShrink: 0,
                        backgroundColor: '$priceBackground',
                        borderRadius: '0.75rem',
                        px: '0.5rem',
                        w: 107,
                      }}
                      align="center"
                      style="subtitle3"
                      color="blackWhite"
                      justify="center"
                    >
                      <CryptoCurrencyIcon
                        css={{
                          color: '$neutralText',
                          backgroundColor: '#7A3EDB',
                          borderRadius: '2rem',
                          width: '2rem',
                          height: '2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: '0.25rem',
                        }}
                        address={wrappedContractAddress}
                      />
                      {wrappedContractName}
                    </Text>
                    <Input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => {
                        setBidAmount(e.target.value)
                      }}
                      placeholder="Enter price here"
                      containerCss={{
                        width: '100%',
                      }}
                      css={{
                        color: '$neutralText',
                        textAlign: 'left',
                      }}
                    />
                  </Flex>
                  <FormatCurrency
                    css={{
                      marginLeft: 'auto',
                      mt: '$2',
                      display: 'inline-block',
                      minHeight: 15,
                    }}
                    style="body2"
                    color="blackWhite"
                    amount={bidAmountUsd}
                  />
                  {attributes &&
                    attributes.length > 0 &&
                    (attributesSelectable || trait) &&
                    !tokenId && (
                      <>
                        <Text style="body1" color="blackWhite">
                          Attributes
                        </Text>
                        <Popover.Root
                          open={attributeSelectorOpen}
                          onOpenChange={
                            attributesSelectable
                              ? setAttributeSelectorOpen
                              : undefined
                          }
                        >
                          <Popover.Trigger asChild>
                            <PseudoInput>
                              <Flex
                                justify="between"
                                css={{
                                  gap: '$2',
                                  alignItems: 'center',
                                  color: '$neutralText',
                                }}
                              >
                                {trait ? (
                                  <>
                                    <Box
                                      css={{
                                        maxWidth: 385,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      <Text color="accent" style="subtitle1">
                                        {trait?.key}:{' '}
                                      </Text>
                                      <Text style="subtitle1">
                                        {trait?.value}
                                      </Text>
                                    </Box>
                                    <Flex
                                      css={{
                                        alignItems: 'center',
                                        gap: '$2',
                                      }}
                                    >
                                      {trait?.floorAskPrice && (
                                        <Box css={{ flex: 'none' }}>
                                          <FormatCryptoCurrency
                                            amount={trait?.floorAskPrice}
                                            maximumFractionDigits={2}
                                            logoWidth={11}
                                          />
                                        </Box>
                                      )}
                                      <FontAwesomeIcon
                                        style={{
                                          cursor: 'pointer',
                                        }}
                                        onClick={(e) => {
                                          e.preventDefault()
                                          setTrait(undefined)
                                        }}
                                        icon={faClose}
                                        width={16}
                                        height={16}
                                      />
                                    </Flex>
                                  </>
                                ) : (
                                  <>
                                    <Text
                                      css={{
                                        color: '$neutralText',
                                      }}
                                    >
                                      All Attributes
                                    </Text>
                                    <FontAwesomeIcon
                                      icon={faChevronDown}
                                      width={16}
                                      height={16}
                                    />
                                  </>
                                )}
                              </Flex>
                            </PseudoInput>
                          </Popover.Trigger>
                          <Popover.Content sideOffset={-50}>
                            <AttributeSelector
                              attributes={attributes}
                              tokenCount={tokenCount}
                              setTrait={setTrait}
                              setOpen={setAttributeSelectorOpen}
                            />
                          </Popover.Content>
                        </Popover.Root>
                      </>
                    )}

                  <Text
                    style="body1"
                    color="blackWhite"
                    css={{ mt: '$4', mb: '$2' }}
                  >
                    Expiration Date
                  </Text>
                  <Flex css={{ gap: 20, mb: '$4' }}>
                    <Select
                      css={{
                        flex: 1,
                        borderRadius: '0.75rem',
                        '@bp1': {
                          width: 160,
                          flexDirection: 'row',
                        },
                      }}
                      value={expirationOption?.text || ''}
                      onValueChange={(value: string) => {
                        const option = expirationOptions.find(
                          (option) => option.value == value
                        )
                        if (option) {
                          setExpirationOption(option)
                        }
                      }}
                    >
                      {expirationOptions.map((option) => (
                        <Select.Item key={option.text} value={option.value}>
                          <Select.ItemText>{option.text}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select>
                    <DateInput
                      ref={datetimeElement}
                      icon={
                        <FontAwesomeIcon
                          icon={faCalendar}
                          width={14}
                          height={16}
                        />
                      }
                      value={expirationDate}
                      options={{
                        minDate: minimumDate,
                        enableTime: true,
                        minuteIncrement: 1,
                      }}
                      defaultValue={expirationDate}
                      onChange={(e: any) => {
                        if (Array.isArray(e)) {
                          const customOption = expirationOptions.find(
                            (option) => option.value === 'custom'
                          )
                          if (customOption) {
                            setExpirationOption({
                              ...customOption,
                              relativeTime: e[0] / 1000,
                            })
                          }
                        }
                      }}
                      containerCss={{
                        width: 46,
                        '@bp1': {
                          flex: 1,
                          width: '100%',
                        },
                      }}
                      css={{
                        borderRadius: '0.75rem',
                        padding: 0,
                        '@bp1': {
                          padding: '12px 16px 12px 48px',
                        },
                      }}
                    />
                  </Flex>
                  {bidAmount === '' && (
                    <Button
                      disabled={true}
                      css={{
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        fontWeight: 500,
                        width: '100%',
                      }}
                    >
                      Enter a Price
                    </Button>
                  )}

                  {bidAmount !== '' && hasEnoughWrappedCurrency && (
                    <Button
                      onClick={placeBid}
                      css={{
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        fontWeight: 500,
                        width: '100%',
                        mt: 'auto',
                      }}
                    >
                      {token && token.token
                        ? 'Make an Offer'
                        : trait
                        ? 'Make an Attribute Offer'
                        : 'Make a Collection Offer'}
                    </Button>
                  )}

                  {bidAmount !== '' && !hasEnoughWrappedCurrency && (
                    <Box css={{ width: '100%', mt: 'auto' }}>
                      {!hasEnoughNativeCurrency && (
                        <Flex
                          css={{ gap: '$2', mt: 10, alignItems: 'center' }}
                          justify="center"
                        >
                          <Text style="body2" color="error">
                            {balance?.symbol || 'ETH'} Balance
                          </Text>
                          <FormatCryptoCurrency amount={balance?.value} />
                        </Flex>
                      )}
                      <Flex
                        css={{
                          gap: '$2',
                          mt: 10,
                          overflow: 'hidden',
                          flexDirection: 'column-reverse',
                          '@bp1': {
                            flexDirection: 'row',
                          },
                        }}
                      >
                        <Button
                          css={{
                            flex: '1 0 auto',
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            fontWeight: 500,
                            width: '100%',
                          }}
                          color="secondary"
                          onClick={() => {
                            window.open(uniswapConvertLink, '_blank')
                          }}
                        >
                          Convert Manually
                        </Button>
                        <Button
                          css={{
                            flex: 1,
                            maxHeight: 44,
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            fontWeight: 500,
                            width: '100%',
                          }}
                          disabled={!hasEnoughNativeCurrency}
                          onClick={placeBid}
                        >
                          <Text style="h6" color="button" ellipsify>
                            Convert {amountToWrap} {balance?.symbol || 'ETH'}{' '}
                            for me
                          </Text>
                        </Button>
                      </Flex>
                    </Box>
                  )}
                </MainContainer>
              </ContentContainer>
            )}

            {bidStep === BidStep.Offering && collection && (
              <ContentContainer>
                <TransactionBidDetails
                  token={token ? token : undefined}
                  collection={collection}
                  bidData={bidData}
                />
                <MainContainer css={{ p: '1rem 1.625rem 1.625rem' }}>
                  <ProgressBar
                    value={stepData?.stepProgress || 0}
                    max={stepData?.totalSteps || 0}
                  />
                  {transactionError && <ErrorWell css={{ mt: 24 }} />}
                  {stepData && (
                    <>
                      <Text
                        css={{ textAlign: 'center', mt: 48, mb: 28 }}
                        style="subtitle1"
                      >
                        {stepTitle}
                      </Text>
                      {stepData.currentStep.kind === 'signature' && (
                        <TransactionProgress
                          justify="center"
                          fromImg={itemImage || ''}
                          toImg={localMarketplace?.icon || ''}
                        />
                      )}
                      {stepData.currentStep.kind !== 'signature' && (
                        // <WethApproval style={{ margin: '0 auto' }} />
                        <Flex align="center" justify="center">
                          <Flex
                            css={{ background: '$neutalLine', borderRadius: 8 }}
                          >
                            <CryptoCurrencyIcon
                              css={{ height: 56, width: 56 }}
                              address={wrappedContractAddress}
                            />
                          </Flex>
                        </Flex>
                      )}
                      <Text
                        css={{
                          textAlign: 'center',
                          mt: 24,
                          maxWidth: 395,
                          mx: 'auto',
                          mb: '$4',
                        }}
                        style="body3"
                        color="subtle"
                      >
                        {stepData?.currentStep.description}
                      </Text>
                    </>
                  )}
                  {!stepData && (
                    <Flex
                      css={{ height: '100%' }}
                      justify="center"
                      align="center"
                    >
                      <Loader />
                    </Flex>
                  )}
                  {!transactionError && (
                    <Button
                      css={{
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        fontWeight: 500,
                        width: '100%',
                        mt: 'auto',
                      }}
                      disabled={true}
                    >
                      <Loader />
                      Waiting for Approval
                    </Button>
                  )}
                  {transactionError && (
                    <Flex
                      css={{
                        mt: 'auto',
                        gap: 10,
                      }}
                    >
                      <Button
                        color="secondary"
                        css={{
                          flex: 1,
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          fontWeight: 500,
                          width: '100%',
                        }}
                        onClick={() => setBidStep(BidStep.SetPrice)}
                      >
                        Edit Bid
                      </Button>
                      <Button
                        css={{
                          flex: 1,
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          fontWeight: 500,
                          width: '100%',
                        }}
                        onClick={placeBid}
                      >
                        Retry
                      </Button>
                    </Flex>
                  )}
                </MainContainer>
              </ContentContainer>
            )}

            {bidStep === BidStep.Complete && (
              <Flex
                direction="column"
                align="center"
                css={{ p: '1rem 1.625rem 1.625rem' }}
              >
                <Box
                  css={{
                    color: '$successAccent',
                    mb: 30,
                    width: 106,
                    height: 106,
                  }}
                >
                  {/* <FontAwesomeIcon icon={faCheckCircle} size="3x" /> */}
                  <SuccessIcon />
                </Box>
                <Text
                  style="h4"
                  color="blackWhite"
                  css={{ mb: '$2', textAlign: 'center' }}
                  as="h5"
                >
                  Success <br />
                  Offer Made
                </Text>
                <Text
                  style="body3"
                  as="p"
                  css={{
                    mb: 24,
                    maxWidth: 300,
                    overflow: 'hidden',
                    color: '$pColor',
                  }}
                >
                  Your offer has been made successfully
                </Text>
                {onViewOffers ? (
                  <Button
                    css={{
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: 500,
                      width: '100%',
                    }}
                    onClick={() => {
                      onViewOffers()
                    }}
                  >
                    View Offers
                  </Button>
                ) : (
                  <Button
                    css={{
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: 500,
                      width: '100%',
                    }}
                    onClick={() => {
                      setOpen(false)
                    }}
                  >
                    Close
                  </Button>
                )}
              </Flex>
            )}
          </Modal>
        )
      }}
    </BidModalRenderer>
  )
}

BidModal.Custom = BidModalRenderer
