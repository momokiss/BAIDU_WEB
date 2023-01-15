import { createApp, h } from "vue"
import { createMetaManager } from "vue-meta"
import { createPinia } from "pinia"

/** Analytics */
import VueGtag from "vue-gtag"
import amplitude from "amplitude-js"
amplitude.getInstance().init("a515d3d1969a8f25c340476842b19836")

import "@/services/sdk"

import App from "./App.vue"
import router fro