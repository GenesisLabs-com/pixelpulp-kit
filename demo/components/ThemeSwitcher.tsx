import { useContext } from 'react'
import { ThemeSwitcherContext } from '../pages/_app'
import { lightTheme, darkTheme } from '@reservoir0x/reservoir-kit-ui'
import { useTheme } from 'next-themes'

const getDemoThemeFromOption = (option: string) => {
  switch (option) {
    case 'light': {
      return 'light'
    }
    case 'dark': {
      return 'dark'
    }
    case 'decent': {
      return 'light'
    }
    case 'reservoir': {
      return 'light'
    }
    default: {
      return 'dark'
    }
  }
}

const getThemeFromOption = (option: string) => {
  switch (option) {
    case 'light': {
      return lightTheme({
        ethIcon: 'glyph',
      })
    }
    case 'dark': {
      return darkTheme()
    }
    case 'decent': {
      return lightTheme({
        font: 'Poppins',
        primaryColor: '#1E1B1B',
        primaryHoverColor: '#1E1B1B',
        headerBackground: '#fff',
        contentBackground: '#000',
        footerBackground: '#fff',
        textColor: '#1E1B1B',
        pColor: '#909090',
        borderColor: 'none',
        overlayBackground: 'rgba(30, 27, 27, 0.6)',
      })
    }
    case 'reservoir': {
      return lightTheme({
        font: 'Poppins',
        primaryColor: '#7000FF',
      })
    }
    default: {
      return darkTheme()
    }
  }
}

export default () => {
  const { setTheme } = useContext(ThemeSwitcherContext)
  const { setTheme: setDemoTheme } = useTheme()

  return (
    <select
      onClick={(e) => {
        e.stopPropagation()
      }}
      onChange={(e) => {
        if (setTheme) {
          setTheme(getThemeFromOption(e.target.value))
        }
        setDemoTheme(getDemoThemeFromOption(e.target.value))
        localStorage.removeItem('demo-theme')
      }}
      style={{ position: 'fixed', top: 16, right: 16 }}
    >
      <option value="dark">Dark Theme</option>
      <option value="light">Light Theme</option>
      <option value="decent">Decent</option>
      <option value="reservoir">Reservoir</option>
    </select>
  )
}
