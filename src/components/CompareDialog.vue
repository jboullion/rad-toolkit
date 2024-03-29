<template>
  <v-row justify="center">
    <v-dialog
      v-model="openDialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="red">
          <v-btn icon dark @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Compare Components</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <!-- <v-btn variant="text" @click="$emit('close')"> Save </v-btn> -->
          </v-toolbar-items>
        </v-toolbar>
        <div id="compare">
          <v-table>
            <tbody>
              <tr v-for="property in basicProperties">
                <th>{{ property.title }}</th>
                <td
                  v-for="component in components"
                  :key="'basic-' + component.category_id"
                  style="width: 300px"
                >
                  <p v-if="property.sortProperty !== 'url'">
                    {{
                      component[property.sortProperty as keyof typeof component]
                    }}
                  </p>
                  <a
                    v-else-if="component.url"
                    :href="component.url"
                    target="_blank"
                    >View</a
                  >
                </td>
              </tr>
              <tr v-for="property in properties">
                <th>{{ property.title }}</th>
                <td
                  v-for="(component, index) in components"
                  style="width: 300px"
                >
                  {{
                    displayComponentProperty(component, property.sortProperty)
                  }}
                </td>
              </tr>
              <tr>
                <th>Files</th>
                <td
                  class="component__files"
                  v-for="component in components"
                  :key="'file-' + component.category_id"
                >
                  <span v-for="file in component.files" class="d-block"
                    ><a :href="file" target="_blank">{{
                      displayFileName(file)
                    }}</a></span
                  >
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import {
  Component,
  ComponentProperties,
  ComponentTableProps,
} from "@/types/components";
import { ref, watch } from "vue";
import { basicProperties } from "@/types/properties";
import { displayComponentProperty, displayFileName } from "@/utils/utils";

const props = defineProps<{
  showDialog: boolean;
  components: Component[];
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
#compare {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  padding: 40px 20px;
}

#compare > div {
  border: 1px solid
    rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  overflow: hidden;
  margin: 0;
}

#compare .v-table > .v-table__wrapper > table > tbody > tr > th {
  font-size: 1rem;
  height: auto;
}

#compare .v-table > .v-table__wrapper > table > tbody > tr > td {
  padding: 15px;
  word-break: break-word;
  vertical-align: top;
  max-width: 300px;
  white-space: normal;
  min-width: 150px;
}

#compare .v-table > .v-table__wrapper > table > tbody > tr:first-child p {
  font-weight: bold;
  font-size: 1rem;
}

/* #compare .v-table > .v-table__wrapper {
  max-height: none;
  overflow-y: auto;
} */

#compare
  .v-table
  > .v-table__wrapper
  > table
  > tbody
  > tr
  > td:nth-child(even) {
  background-color: #f1f1f1;
}

.v-theme--dark
  #compare
  .v-table
  > .v-table__wrapper
  > table
  > tbody
  > tr
  > td:nth-child(even) {
  background-color: #333;
}
</style>
