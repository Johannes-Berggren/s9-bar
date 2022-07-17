<template>
  <v-container>
    <v-overlay :model-value="vm.loading" class="align-center justify-center">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <div>
      <v-row class="mx-auto" style="max-width: 400px" align="center">
        <v-col cols="4">
          <img
            alt="S9 Logo"
            class="logo"
            src="./assets/logo.png"
            width="125"
            height="125"
          />
        </v-col>

        <v-col>
          <member-info v-if="vm.signedIn" :member="vm.member" />
        </v-col>
      </v-row>

      <div>
        <code-pad v-if="!vm.signedIn" @success="signedIn" />

        <v-container v-else>
          <admin v-if="vm.member.admin" />
        </v-container>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import MemberInfo from "@/components/MemberInfo.vue";
import Admin from "@/views/Admin.vue";
import CodePad from "@/components/CodePad.vue";
import type Member from "@/interfaces/Member";
import { reactive } from "vue";

const vm = reactive({
  loading: false,
  member: {} as Member,
  signedIn: false,
});

function signedIn(member: Member) {
  vm.member = member;
  vm.signedIn = true;
}
</script>

<style lang="sass">
@import './assets/base.css'
</style>
