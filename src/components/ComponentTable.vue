<template>
  <v-table>
    <thead>
      <tr>
        <th>
          <v-btn
            color="red"
            @click="$emit('compare')"
            :disabled="selectedComponents.length < 2"
          >
            <v-icon large class="mr-2"> mdi-compare-horizontal </v-icon>
            {{ selectedComponents.length }}</v-btn
          >
        </th>
        <th class="text-left" @click="$emit('sort', 'name')">Name</th>
        <th
          v-for="property in properties"
          class="text-left"
          @click="$emit('sort', property.sortProperty)"
        >
          {{ property.title }}
          {{ property.unit ? "(" + property.unit + ")" : "" }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(component, index) in components"
        :key="index"
        class="component"
      >
        <td class="component__compare">
          <v-checkbox
            label=""
            v-model="selectedComponents"
            :true-value="component"
            false-value=""
            @change="$emit('compareComponents', selectedComponents)"
          ></v-checkbox>
        </td>
        <td
          class="pointer component__name py-2"
          @click="$emit('showComponent', component)"
        >
          <h3>
            <a
              v-if="component.url"
              :href="component.url"
              target="_blank"
              @click.stop
              >{{ component.name }}</a
            >
            <span v-else>{{ component.name }}</span>
          </h3>
          <span><b>Part #:</b> {{ component.partnum }}</span
          ><br />
          <span><b>Manufacturer:</b> {{ component.manufacturer }}</span>
        </td>
        <td
          v-for="property in properties"
          class="pointer"
          :class="`component__${property.sortProperty}`"
          @click="$emit('showComponent', component)"
        >
          <p>
            {{ displayComponentProperty(component, property.sortProperty) }}
          </p>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Component,
  ComponentProperties,
  ComponentTableProps,
} from "@/types/components";
import { formatProperty } from "@/utils/utils";

defineProps<{
  components: Component[];
  properties: ComponentTableProps[];
}>();

defineEmits<{
  (event: "sort", ...args: any[]): void;
  (event: "showComponent", args: Component): void;
  (event: "compareComponents", ...args: any[]): void;
  (event: "compare", ...args: any[]): void;
}>();

const selectedComponents = ref<string[]>([]);

function displayComponentProperty(
  component: Component,
  property: string
): string {
  const rawProperty =
    component.properties[property as keyof ComponentProperties];

  if (!rawProperty) return "";

  if (typeof rawProperty === "number") {
    return formatProperty(rawProperty, property);
  }

  if (Array.isArray(rawProperty)) {
    return rawProperty
      .map((p) => {
        if (typeof p === "number") {
          return formatProperty(p, property);
        }

        return p;
      })
      .join(", ");
  }

  return rawProperty.toString();
}
</script>

<style>
.v-table {
  margin: 50px 0;
}

.v-table .v-table__wrapper {
  max-height: 80vh;
  overflow-y: auto;
}

.v-table__wrapper thead {
  position: relative;
  z-index: 1;
}

.v-table__wrapper thead th {
  position: sticky;
  top: 0;
  background: rgb(var(--v-theme-surface));
  min-width: 80px;
  white-space: nowrap;
  cursor: pointer;
}

.v-table__wrapper tbody td {
  white-space: nowrap;
}

.component__compare > .v-input {
  display: flex;
  justify-content: center;
}

.component__name {
  white-space: nowrap;
}

.component__description {
  min-width: 500px;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}

.v-table__wrapper tbody td p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.v-input__details {
  display: none;
}
</style>
