import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'

import './style/fonts.css'
import './style/tokens.css'
import './style/base.css'
import './style/vp.css'

import Layout from './Layout.vue'

import Mark from './components/Mark.vue'
import Wordmark from './components/Wordmark.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('Mark', Mark)
    app.component('Wordmark', Wordmark)
  }
} satisfies Theme
