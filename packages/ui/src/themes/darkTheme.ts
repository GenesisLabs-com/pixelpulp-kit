import {
  redDark,
  indigoDark,
  slateDark,
  indigoDarkA,
  blackA,
  green,
} from '@radix-ui/colors'

import {
  ReservoirKitOverrides,
  ReservoirKitTheme,
  sharedThemeConfig,
} from './ReservoirKitTheme'

export default function (overrides?: ReservoirKitOverrides): ReservoirKitTheme {
  let sharedTheme = sharedThemeConfig(overrides)

  return {
    colors: {
      ...redDark,
      ...indigoDark,
      ...indigoDarkA,
      ...slateDark,
      ...blackA,
      ...green,

      // accent colors
      accentBase: '$indigo1',
      accentBgSubtle: '$indigo2',
      accentBg: '$indigo3',
      accentBgHover: '$indigo4',
      accentBgActive: '$indigo5',
      accentLine: '$indigo6',
      accentBorder: '$indigo7',
      accentBorderHover: overrides?.primaryColor || '$indigo8',
      accentSolid: overrides?.primaryColor || '$indigo9',
      accentSolidHover:
        overrides?.primaryHoverColor || overrides?.primaryColor || '$indigo10',
      accentText: '$indigo11',
      accentTextContrast: '$indigo12',

      // neutral colors
      neutralBase: '$slate1',
      neutralBgSubtle: '$slate2',
      neutralBg: '$slate3',
      neutralBgHover: '$slate4',
      neutralBgActive: '$slate5',
      neutalLine: '$slate6',
      neutralBorder: '$slate7',
      neutralBorderHover: '$slate8',
      neutralSolid: '$slate9',
      neutralSolidHover: '$slate10',
      neutralText: '$slate11',
      neutralTextContrast: '$slate12',

      // secondary colors
      secondaryBase: '$indigoA1',
      secondaryBgSubtle: '$indigoA2',
      secondaryBg: '$indigoA3',
      secondaryBgHover: '$indigoA4',
      secondaryBgActive: '$indigoA5',
      secondaryLine: '$indigoA6',
      secondaryBorder: '$indigoA7',
      secondaryBorderHover: '$indigoA8',
      secondarySolid: '$indigoA9',
      secondarySolidHover: '$indigoA10',
      secondaryText: '$indigoA11',
      secondaryTextContrast: '$indigoA12',

      // general colors
      borderColor: overrides?.borderColor || '$neutralBorder',
      textColor: overrides?.textColor || 'white',
      focusColor: '$neutralTextContrast',
      errorText: '$red12',
      errorAccent: '$red10',
      successAccent: '$green10',
      subtitleColor: '#fff',
      blackwhiteColor: '#fff',

      // component colors
      reservoirLogoColor: '#ECEDEE',
      inputBackground: '#282A31  ',
      buttonTextColor: overrides?.buttonTextColor || 'white',
      buttonTextHoverColor: overrides?.buttonTextHoverColor || 'white',
      overlayBackground: overrides?.overlayBackground || '$blackA10',
      headerBackground: overrides?.headerBackground || '#19191B',
      footerBackground: overrides?.footerBackground || '#282A31',
      contentBackground: overrides?.contentBackground || '#19191B',
      priceBackground: overrides?.priceBackground || '#282A31',
      closeBorder: overrides?.closeBorder || '#A1A1A1',
      pColor: overrides?.pColor || '#979696',
      wellBackground: overrides?.wellBackground || '$neutralBase',
      boxBackground: overrides?.boxBackground || '#19191B',
      switchBorder: overrides?.switchBorder || '#A1A1A1',
      dotInactiveColor: overrides?.dotInactiveColor || '#D9D9D9',
      dotActiveColor: overrides?.dotActiveColor || '#7A3EDB',
      popoverBackground: overrides?.popoverBackground || '$neutralBgActive',
    },
    assets: {
      ethIcon: overrides?.ethIcon || 'purple',
    },
    ...sharedTheme,
  }
}
