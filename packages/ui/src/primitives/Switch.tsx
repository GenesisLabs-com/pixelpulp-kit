import React from 'react'
import { styled } from '../../stitches.config'
import * as SwitchPrimitive from '@radix-ui/react-switch'

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: 'unset',
  cursor: 'pointer',
  width: 28,
  height: 16,
  backgroundColor: 'transparent',
  borderRadius: '9999px',
  position: 'relative',
  transition: 'background-color 250ms linear',
  border: '1px solid $switchBorder',
  $$focusColor: '$colors$accentBorder',
  '&[data-state="checked"]': { backgroundColor: '$priceBackground' },
  '&:focus-visible': {
    boxShadow: '0 0 0 2px $$focusColor',
  },
})

const Thumb = styled(SwitchPrimitive.Thumb, {
  display: 'block',
  width: 10,
  height: 10,
  backgroundColor: '$switchBorder',
  borderRadius: '9999px',
  transition: 'transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  transform: 'translateX(4px)',
  willChange: 'transform',
  $$borderColor: '$borderColor',
  //boxShadow: '0 0 0 1px $$borderColor',
  '&[data-state="checked"]': { transform: 'translateX(15px)' },
})

const Switch = (props?: SwitchPrimitive.SwitchProps) => (
  <StyledSwitch {...props}>
    <Thumb />
  </StyledSwitch>
)

export default Switch
