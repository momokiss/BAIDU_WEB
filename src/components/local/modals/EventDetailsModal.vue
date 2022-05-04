<script setup>
import { computed } from "vue"
import { DateTime } from "luxon"

/**
 * UI
 */
import Modal from "@/components/ui/Modal"

/**
 * Services
 */
import { toReadableDuration } from "@/services/utils/date"

const props = defineProps({ show: { type: Boolean }, event: { type: Object } })

const eventDuration = computed(() =>
  toReadableDuration({ seconds: props.event.measurePeriod }),
)
</script>

<template>
  <Modal :show="show" width="500" closable @onClose="$emit('onClose')">
    <div :class="$style.title">Event details</div>

    <div :class="$style.subtitle">General</div>
    <div :class="$style.params">
      <div :class="$style.param">
        <span>
          <Icon name="hash" size="12" />Event ID
        </span>
        <span>{{ event.id }}</span>
      </div>

      <div :class="$style.param">
        <span>
          <Icon :name="
            (event.status == 'NEW' && 'event_new') ||
            (event.status == 'STARTED