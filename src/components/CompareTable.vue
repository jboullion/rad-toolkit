<template>
  <div id="compare">
    <v-table v-for="component in components">
      <tbody>
        <tr>
          <th>Name</th>
          <td>{{ component.name }}</td>
        </tr>
        <tr>
          <th>Part #</th>
          <td>{{ component.partnum }}</td>
        </tr>
        <tr>
          <th>Description</th>
          <td>{{ component.description }}</td>
        </tr>
        <tr v-if="component.url">
          <th>URL</th>
          <td>
            <a :href="component.url">{{ component.url }}</a>
          </td>
        </tr>
        <tr>
          <th>Category</th>
          <td>{{ component.category_name }}</td>
        </tr>
        <tr>
          <th>Manufacturer</th>
          <td>{{ component.manufacturer }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import { Component } from "@/types/components";

const props = defineProps<{
  components: Component[];
}>();
</script>

<style>
#compare {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  gap: 30px;
  padding: 20px 0;
}

#compare > div {
  min-width: 500px;
  width: 500px;
}

#compare .v-table > .v-table__wrapper > table > tbody > tr > th {
  font-size: 1rem;
}

#compare .v-table > .v-table__wrapper > table > tbody > tr > td {
  padding: 15px;
}
</style>
