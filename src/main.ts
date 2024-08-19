import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
const app = createApp(App)

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VueVirtualScroller from 'vue-virtual-scroller'
app.use(VueVirtualScroller)

import 'floating-vue/dist/style.css'
import FloatingVue from 'floating-vue'
app.use(FloatingVue)

import rate from 'vue-rate'
import 'vue-rate/dist/vue-rate.css'
app.use(rate)

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
app.use(ContextMenu)

import { Language } from "@/i18n/i18n";
const i18n = new Language().i18n;
console.log(i18n.locale)
app.use(i18n);

app.use(router)
app.mount('#app')