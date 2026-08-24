import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'

import './style/fonts.css'
import './style/tokens.css'
import './style/base.css'
import './style/vp.css'

import Layout from './Layout.vue'

import HomeHero from './components/HomeHero.vue'
import HomeUsedBy from './components/HomeUsedBy.vue'
import WalletComparison from './components/WalletComparison.vue'
import HomeWhy from './components/HomeWhy.vue'
import HomeLibraries from './components/HomeLibraries.vue'

import Ecosystem from './components/Ecosystem.vue'
import Validator from './components/Validator.vue'
import Builder from './components/Builder.vue'
import BlogIndex from './components/BlogIndex.vue'
import BrandKit from './components/BrandKit.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    /* Landing */
    app.component('HomeHero', HomeHero)
    app.component('HomeUsedBy', HomeUsedBy)
    app.component('WalletComparison', WalletComparison)
    app.component('HomeWhy', HomeWhy)
    app.component('HomeLibraries', HomeLibraries)

    /* Pages */
    app.component('Ecosystem', Ecosystem)
    app.component('Validator', Validator)
    app.component('Builder', Builder)
    app.component('BlogIndex', BlogIndex)
    app.component('BrandKit', BrandKit)
  }
} satisfies Theme
