<template>
  <form id="updateAction">
    <h2>Update Action</h2>
    <div class="col-2">
      <select v-model="action">
        <option value="">Select an Action</option>
        <option
          v-for="action_option in actions"
          v-bind:key="action_option.id"
          v-bind:value="action_option.id"
        >
          {{ action_option.name }}</option
        >
      </select>
    </div>
    <div v-if="this.action === this.exception" class="col-1 inputGroup">
      <input v-model="reason" type="string" required />
      <label>Reason for exception.</label>
    </div>
    <div>
      <button @click="submit">Submit</button>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import moment, { unix } from 'moment';
import { Action, Task, BrewhopsCookie } from '../../types';
import { HttpResponse } from 'vue-resource/types/vue_resource';
import { ACTION } from '../../utils';

interface IUpdateAction {
  actions: Action[];
  action: string | number;
  exception: number;
  reason: string;
}

export default Vue.extend({
  name: 'update-action',
  props: {
    tank: {
      type: Object,
      required: true
    },
    activeTask: {
      type: Object,
      required: false
    },
    batch: {
      type: Object,
      required: true
    }
  },
  data(): IUpdateAction {
    return {
      actions: [],
      action: '',
      exception: ACTION.EXCEPTION,
      reason: ''
    };
  },
  async beforeMount() {
    try {
      const headers = {
        Authorization: `Bearer ${Cookie.getJSON('loggedIn').token}`
      };
      const actionsResponse: HttpResponse = await this.$http.get(
        `${process.env.API}/actions`,
        headers
      );
      const actions: Action[] = actionsResponse.data;
      this.actions = actions;
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  },
  methods: {
    async submit() {
      const cookie: BrewhopsCookie = Cookie.getJSON('loggedIn');
      const headers = {
        Authorization: `Bearer ${cookie.token}`
      };

      // if there is a current task to edit
      if (this.activeTask && this.activeTask.action_id !== this.action) {
        const task: Task = this.activeTask;
        task.completed_on = moment().toISOString();

        if (this.action === this.exception && this.reason) {
          task.exception_reason = this.reason;
        }

        try {
          const response = await this.$http.patch(`${process.env.API}/tasks`, task, { headers });
        } catch (err) {
          // tslint:disable:no-console
          console.error(err);
        }
      }

      // if there is no current task
      if ((!this.activeTask || this.activeTask.action_id !== this.action) && this.action) {
        let task: Task = {
          added_on: moment().toISOString(),
          assigned: true,
          batch_id: this.batch ? this.batch.id : undefined,
          action_id: Number(this.action),
          employee_id: Number(cookie.id)
        };

        if (this.action === this.exception && this.reason) {
          task.exception_reason = this.reason;
        }

        try {
          const response = await this.$http.post(`${process.env.API}/tasks`, task, { headers });
        } catch (err) {
          console.error(err);
        }
      }

      this.$emit('newDataCallback');
    }
  }
});
</script>
<style lang="stylus" scoped>
#updateAction
  padding 15px
  grid-area entry
  display flex
  flex-direction column
  justify-content center
  align-items center
  text-align center
  +less-than(tablet)
    width 90vw
  margin auto
  min-width 350px
  max-width 500px
  button
    margin-top 30px
</style>
