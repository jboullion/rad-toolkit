<template>
  <v-dialog
    id="component-dialog"
    v-if="component"
    v-model="openDialog"
    scrollable
  >
    <v-card>
      <v-card-title>{{ component.name }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-table>
          <tbody>
            <tr v-for="property in basicProperties">
              <th>{{ property.title }}</th>
              <td>
                <p v-if="property.sortProperty !== 'url'">
                  {{
                    component[property.sortProperty as keyof typeof component]
                  }}
                </p>
                <a v-else :href="component.url" target="_blank">View</a>
              </td>
            </tr>

            <tr v-for="property in properties" :key="property.sortProperty">
              <th>
                {{ property.title }}
                {{ property.unit ? "(" + property.unit + ")" : "" }}
              </th>
              <td>
                <p>
                  {{
                    component.properties[
                      property.sortProperty as keyof ComponentProperties
                    ]
                  }}
                </p>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="red" @click="$emit('close')" block> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {
  Component,
  ComponentProperties,
  ComponentTableProps,
} from "@/types/components";
import { ref, watch } from "vue";
import { basicProperties } from "@/types/properties";

const props = defineProps<{
  showDialog: boolean;
  component: Component | null;
  properties: ComponentTableProps[];
}>();

const emit = defineEmits<{
  (event: "close", ...args: any[]): void;
}>();

const openDialog = ref(false);

watch(
  () => props.showDialog,
  (val) => {
    openDialog.value = val;
  }
);

watch(
  () => openDialog.value,
  (val) => {
    if (!val) {
      emit("close");
    }
  }
);
</script>

<style>
#component-dialog.v-dialog .v-overlay__content {
  width: 800px !important;
  max-width: 100% !important;
}

#component-dialog.v-dialog
  .v-table
  > .v-table__wrapper
  > table
  > tbody
  > tr
  > th {
  font-size: 1rem;
}

#component-dialog.v-dialog
  .v-table
  > .v-table__wrapper
  > table
  > tbody
  > tr
  > td {
  white-space: normal;
  padding: 15px;
}
</style>
