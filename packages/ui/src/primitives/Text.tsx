import { styled } from '../../stitches.config'

export default styled('span', {
  color: '$textColor',
  fontFamily: '$body',
  letterSpacing: 0,
  margin: 0,

  variants: {
    color: {
      base: {
        color: '$textColor',
      },
      subtle: {
        color: '$neutralText',
      },
      subtitle: {
        color: '$subtitle',
      },
      blackWhite: {
        color: '$blackwhiteColor',
      },
      error: {
        color: '$errorAccent',
      },
      errorLight: {
        color: '$errorText',
      },
      accent: {
        color: '$accentText',
      },
      success: {
        color: '$successAccent',
      },
      button: {
        color: '$buttonTextColor',
      },
      dotInactive: {
        color: '$dotInactiveColor',
      },
      dotActive: {
        color: '$dotActiveColor',
      },
    },
    style: {
      h2: {
        fontWeight: 700,
        fontSize: 48,
        fontFamily: '$headline',
      },
      h3: {
        fontWeight: 700,
        fontSize: 32,
        fontFamily: '$headline',
      },
      h4: {
        fontWeight: 600,
        fontSize: 24,
        fontFamily: '$headline',
      },
      h5: {
        fontWeight: 600,
        fontSize: 20,
        fontFamily: '$headline',
      },
      h6: {
        fontWeight: 700,
        fontSize: 16,
        fontFamily: '$headline',
      },
      subtitle1: {
        fontWeight: 600,
        fontSize: 18,
      },
      subtitle2: {
        fontWeight: 500,
        fontSize: 12,
      },
      subtitle3: {
        fontWeight: 500,
        fontSize: 18,
      },
      body1: {
        fontWeight: 400,
        fontSize: 16,
      },
      body2: {
        fontWeight: 400,
        fontSize: 12,
      },
      body3: {
        fontWeight: 400,
        fontSize: 14,
      },
      body4: {
        fontWeight: 500,
        fontSize: 14,
      },
      body5: {
        fontWeight: 600,
        fontSize: 16,
      },
      tiny: {
        fontWeight: 500,
        fontSize: 10,
        color: '$neutralSolidHover',
      },
    },
    italic: {
      true: {
        fontStyle: 'italic',
      },
    },
    ellipsify: {
      true: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      },
    },
  },

  defaultVariants: {
    style: 'body1',
    color: 'base',
  },
})
