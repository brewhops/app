<template lang="html">
  <div>
    <p>{{ title }}</p>
    <table>
      <tr>
        <th v-for="header in headers">{{ header }}</th>
        <th v-if="editAction || deleteAction">Actions</th>
      </tr>
      <tr v-for="d in data">
        <td v-for="f in fields">{{ f(d) }}</td>
        <td class="actions" v-if="editAction || deleteAction">
          <a v-if="editAction" v-on:click="editAction(d)"
            ><font-awesome-icon :icon="['fas', 'edit']"
          /></a>
          <a v-if="deleteAction" v-on:click="deleteAction(d)"
            ><font-awesome-icon :icon="['fas', 'trash']"
          /></a>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'data-table',
  props: ['title', 'data', 'headers', 'fields', 'editAction', 'deleteAction']
});
</script>

<style lang="stylus" scoped>
p {
  color: Teal;
  font-weight: bold;
}

table {
  border-collapse: collapse;
  border: 1px solid black;
  tr {
    td, th {
      padding: 10px;
      border-left: 1px solid black;
    }
    td, .actions {
      a {
          margin: 5px;
        }
    }
  }
}
</style>
