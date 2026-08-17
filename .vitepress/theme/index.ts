import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'

import './style/fonts.css'
import './style/tokens.css'
import './style/base.css'
import './style/vp.css'

import Layout from './Layout.vue'

import Mark from './components/Mark.vue'
import Wordmark from './components/Wordmark.vue'
import MessageBlock from './components/MessageBlock.vue'
import CopyLine from './components/CopyLine.vue'

import HomeHero from './components/HomeHero.vue'
import MessageAnatomy from './components/MessageAnatomy.vue'
import WalletComparison from './components/WalletComparison.vue'
import HomeWhy from './components/HomeWhy.vue'
import HomeFlow from './components/HomeFlow.vue'
import HomeLibraries from './components/HomeLibraries.vue'
import HomeAdoption from './components/HomeAdoption.vue'
import HomeClose from './components/HomeClose.vue'

import Ecosystem from './components/Ecosystem.vue'
import Validator from './components/Validator.vue'
import Builder from './components/Builder.vue'
import BlogIndex from './components/BlogIndex.vue'
import PostMeta from './components/PostMeta.vue'
import BrandKit from './components/BrandKit.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    /* Brand */
    app.component('Mark', Mark)
    app.component('Wordmark', Wordmark)

    /* Shared */
    app.component('MessageBlock', MessageBlock)
    app.component('CopyLine', CopyLine)

    /* Landing */
    app.component('HomeHero', HomeHero)
    app.component('MessageAnatomy', MessageAnatomy)
    app.component('WalletComparison', WalletComparison)
    app.component('HomeWhy', HomeWhy)
    app.component('HomeFlow', HomeFlow)
    app.component('HomeLibraries', HomeLibraries)
    app.component('HomeAdoption', HomeAdoption)
    app.component('HomeClose', HomeClose)

    /* Pages */
    app.component('Ecosystem', Ecosystem)
    app.component('Validator', Validator)
    app.component('Builder', Builder)
    app.component('BlogIndex', BlogIndex)
    app.component('PostMeta', PostMeta)
    app.component('BrandKit', BrandKit)
  }
} satisfies Theme
