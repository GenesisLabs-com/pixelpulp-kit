import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
  useContext,
} from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Anchor, Button, Flex, Text, Loader, Box } from '../primitives'
import { styled } from '../../stitches.config'
import { Dialog } from '../primitives/Dialog'
import { ProviderOptionsContext } from '../ReservoirKitProvider'
import GenesisLabLogoWhite from '../img/GenesisLabLogoWhite'

const Title = styled(DialogPrimitive.Title, {
  margin: 0,
})

export enum ModalSize {
  MD,
  LG,
}

type Props = {
  title: string
  children: ReactNode
  size?: ModalSize
  onBack?: (() => void) | null
  loading?: boolean
} & Pick<
  ComponentPropsWithoutRef<typeof Dialog>,
  | 'onPointerDownOutside'
  | 'onOpenChange'
  | 'open'
  | 'trigger'
  | 'onFocusCapture'
>

const Logo = styled(GenesisLabLogoWhite, {
  '& .letter': {
    backgroundColor: 'yellow',
  },
})

// const Img = styled('img', {
//   height: 56,
//   width: 56,
// })

export const Modal = forwardRef<ElementRef<typeof Dialog>, Props>(
  (
    {
      title,
      children,
      trigger,
      onBack,
      open,
      size = ModalSize.MD,
      onOpenChange,
      loading,
      onPointerDownOutside,
      onFocusCapture,
    },
    forwardedRef
  ) => {
    const providerOptionsContext = useContext(ProviderOptionsContext)

    return (
      <Dialog
        ref={forwardedRef}
        trigger={trigger}
        open={open}
        onOpenChange={onOpenChange}
        size={size}
        onPointerDownOutside={onPointerDownOutside}
        onFocusCapture={onFocusCapture}
      >
        <Flex
          css={{
            p: '1.625rem',
            backgroundColor: '$headerBackground',
            alignItems: 'start',
            justifyContent: 'space-between',
            borderTopRightRadius: '0.75rem',
            borderTopLeftRadius: '0.75rem',
            '@bp0': {
              p: '1rem 0.875rem 0',
            },
          }}
        >
          <Title css={{ alignItems: 'center', display: 'flex' }}>
            {onBack && (
              <Button
                color="ghost"
                size="none"
                css={{
                  mr: '$2',
                  color: '$neutralText',
                  border: '1px solid #eee',
                }}
                onClick={onBack}
              >
                <FontAwesomeIcon icon={faChevronLeft} width={16} height={16} />
              </Button>
            )}
            <Text style="h4">{title}</Text>
          </Title>
          <DialogPrimitive.Close asChild>
            <Button
              size="none"
              css={{
                display: 'flex',
                color: '$closeBorder !important',
                borderRadius: '2rem',
                border: '2px solid $closeBorder',
                backgroundColor: 'transparent !important',
                fontSize: '0.75rem',
                width: '1.125rem',
                height: '1.125rem',
              }}
            >
              <FontAwesomeIcon
                icon={faClose}
                color="$closeBorder"
                width={10}
                height={10}
              />
            </Button>
          </DialogPrimitive.Close>
        </Flex>
        {loading && (
          <Loader
            css={{
              minHeight: 242,
              backgroundColor: '$contentBackground',
            }}
          />
        )}
        <Box css={{ maxHeight: '85vh', overflowY: 'auto' }}>{children}</Box>
        {!providerOptionsContext.disablePoweredByReservoir && (
          <Flex
            css={{
              mx: 'auto',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '$footerBackground',
              py: 10.5,
              px: '1.5rem',
              boxSizing: 'border-box',
              visibility: '$poweredByReservoirVisibility',
              borderBottomRightRadius: '0.75rem',
              borderBottomLeftRadius: '0.75rem',
              display: 'flex',
              width: '100%',
              '@bp0': {
                p: '1rem 0.875rem',
              },
            }}
          >
            <Text
              style="body3"
              css={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              Powered by
            </Text>
            <Anchor
              href="https://www.genesislab.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
              }}
            >
              <Logo />
            </Anchor>
          </Flex>
        )}
      </Dialog>
    )
  }
)
