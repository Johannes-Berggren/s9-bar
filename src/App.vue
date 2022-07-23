<template>
  <v-container>
    <v-overlay :model-value="vm.loading" class="align-center justify-center">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <div>
      <v-row class="mx-auto" id="header" align="center">
        <v-col cols="2">
          <img
            alt="S9 Logo"
            class="logo"
            src="./assets/logo.png"
            width="125"
            height="125"
          />
        </v-col>

        <v-col cols="8">
          <h1 v-if="!vm.signedIn && !vm.codePadVisible" class="mb-3 text-center">Select drink.</h1>
          <member-info v-else-if="vm.signedIn" :member="vm.member" />
        </v-col>

        <v-col col="1">
          <v-btn
            v-if="!vm.signedIn"
            size="small"
            color="primary"
            @click="vm.codePadVisible = true"
            class="ml-auto"
          >Sign in
          </v-btn>

          <v-btn
            v-else
            size="small"
            color="primary"
            @click="vm.member = undefined; vm.signedIn = false; vm.codePadVisible = false"
            class="ml-auto"
          >Sign out
          </v-btn>
        </v-col>
      </v-row>

      <div>
        <bar v-if="!vm.codePadVisible" />
        <code-pad v-else-if="!vm.signedIn" @success="signedIn" />
        <admin v-else-if="vm.member.admin" />
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import Admin from "@/views/Admin.vue";
import Bar from "@/views/Bar.vue";
import CodePad from "@/components/CodePad.vue";
import MemberInfo from "@/components/MemberInfo.vue";
import type Member from "@/interfaces/Member";
import { provide, reactive } from "vue";

const vm = reactive({
  codePadVisible: false,
  loading: false,
  member: {} as Member,
  signedIn: false,
});

function loading(val: boolean) {
  vm.loading = val;
}

function signedIn(member: Member) {
  vm.member = member;
  vm.signedIn = true;
}

provide("loading", loading);
</script>

<style lang="sass">
@import './assets/base.css'

#header
  position: sticky
  top: 0
  background-color: #000e42
  z-index: 10
</style>
