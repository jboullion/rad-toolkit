<template>
  <v-range-slider
    v-model="range"
    :max="range[1]"
    :min="range[0]"
    :step="1"
    hide-details
    label="Voltage"
    class="align-center"
  >
    <template v-slot:prepend>
      <v-text-field
        :model-value="props.min"
        hide-details
        single-line
        type="number"
        variant="outlined"
        density="compact"
        style="width: 70px"
        @change="updateSliderMin($event)"
      ></v-text-field>
    </template>
    <template v-slot:append>
      <v-text-field
        :model-value="props.max"
        hide-details
        single-line
        type="number"
        variant="outlined"
        style="width: 70px"
        density="compact"
        @change="updateSliderMax($event)"
      ></v-text-field>
    </template>
  </v-range-slider>
</template>
<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (event: "change", ...args: any[]): void;
  (event: "update:modelValue", ...args: any[]): void;
}>();

const props = defineProps({
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 10,
  },
  modelValue: {
    type: Array,
    default: () => [0, 10],
  },
});

const range = ref([props.min, props.max]);

function updateSliderMin(val: number) {
  range.value[0] = val;
  emit("update:modelValue", range.value);
}

function updateSliderMax(val: number) {
  range.value[1] = val;
  emit("update:modelValue", range.value);
}
</script>
