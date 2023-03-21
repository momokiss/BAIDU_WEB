
<script>
import { defineComponent } from "vue"

/**
 * Base
 */
import Page from "@/components/base/Page"

/**
 * Module
 */
import ExploreBase from "@/components/modules/explore/ExploreBase"

export default defineComponent({
  name: "ExplorePage",

  components: { Page, ExploreBase },
})
</script>

<template>
  <Page>
    <ExploreBase />
  </Page>
</template>