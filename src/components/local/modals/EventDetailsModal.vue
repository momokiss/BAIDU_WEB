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
            (event.status == 'STARTED' && 'event_active') ||
            (event.status == 'FINISHED' && 'event_finished')
          " size="12" />Status
        </span>
        <span>{{ event.status }}</span>
      </div>

      <div :class="$style.param">
        <span>
          <Icon name="sides" size="12" />Target Dynamics
        </span>
        <span>{{ event.targetDynamics }}</span>
      </div>

      <div :class="$style.param">
        <span>
          <Icon name="money" size="12" />Total Value Locked
        </span>
        <span>{{ event.totalValueLocked }}</span>
      </div>

      <div :class="$style.param">
        <span>
          <Icon name="time" size="12" />Measure Period
        </span>
        <span>{{ eventDuration }}</span>
      </div>
    </div>

    <div :class="$style.subtitle">Time</div>
    <div :class="$style.params">
      <div :class="$style.param">
        <span>
          <Icon name="time" size="12" />Created At
        </span>
        <span>{{ DateTime.fromISO(event.createdTime).toHTTP() }}</span>
      </div>
      <div :class="$style.param">
        <span>
          <Icon name="time" size="12" />Bets Close Time
        </span>
        <span>{{
          