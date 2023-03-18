<script>
/**
 * Base
 */
import Page from "@/components/base/Page"

/**
 * UI
 */
import Button from "@/components/ui/Button"

export default {
  name: "ErrorPage",

  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Page, Button },
}
</script>

<template>
  <Page>
    <div :class="$style.title">
      Sorry, <span>but there is nothing here</span>
    </div>
    <div :class="$style.description">
      The page you are trying to access does not exist. This might be
      because you have entered the 