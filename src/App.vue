<template>
  <v-container>
    <v-overlay :model-value="vm.loading" class="align-center justify-center">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <div>
      <v-row class="mx-auto" id="header" align="center" dense>
        <v-col cols="12" sm="2" class="text-center text-sm-left">
          <img
            alt="S9 Logo"
            class="logo"
            src="./assets/logo.png"
            width="100"
            height="100"
          />
        </v-col>

        <v-col cols="12" sm="8" class="text-white">
          <h1 v-if="!vm.signedIn && !vm.codePadVisible" class="text-center" style="font-size: 60px">
            <b>Select drink</b>
          </h1>
          <member-info v-if="vm.signedIn" :member="vm.member" />
        </v-col>

        <v-col col="12" sm="2" class="text-center text-sm-right">
          <v-btn
            v-if="!vm.signedIn && !vm.codePadVisible"
            color="primary"
            @click="vm.codePadVisible = true"
            class="mx-auto mr-sm-0"
          >Add money
          </v-btn>

          <v-btn
            v-else-if="!vm.signedIn && vm.codePadVisible"
            size="small"
            color="primary"
            @click="vm.codePadVisible = false"
            class="mx-auto mr-sm-0"
          >
            Cancel
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

      <v-container class="mt-10">
<!--        <welcome-screen v-if="vm.activeComponent === 'welcomeScreen'" />-->
        <bar v-if="!vm.codePadVisible" />
        <code-pad v-else-if="!vm.signedIn" @success="signedIn" />

        <div v-else-if="vm.signedIn">
          <account-buttons :member="vm.member" class="mb-12" />

          <v-divider class="my-12" />

          <h1 class="text-center">Admin-area</h1>
          <admin v-if="vm.signedIn && vm.member.admin" />
        </div>
      </v-container>
    </div>

    <!-- Alert snackbar -->
    <v-snackbar
      v-model="vm.alert.visible"
      :color="vm.alert.color"
      multi-line
      shaped
    >
      <strong>{{ vm.alert.title }}</strong><br>
      {{ vm.alert.message }}
    </v-snackbar>
    <!-- Alert snackbar end -->
  </v-container>
</template>

<script setup lang="ts">
import AccountButtons from "@/components/AccountButtons.vue";
import WelcomeScreen from "@/components/WelcomeScreen.vue";
import Admin from "@/views/Admin.vue";
import Bar from "@/views/Bar.vue";
import CodePad from "@/components/CodePad.vue";
import MemberInfo from "@/components/MemberInfo.vue";
import type Alert from "@/interfaces/Alert";
import type Member from "@/interfaces/Member";
import { provide, reactive } from "vue";

const vm = reactive({
  activeComponent: "welcomeScreen",
  alert: {
    color: "success",
    message: "",
    title: "",
    visible: false,
  },
  codePadVisible: false,
  loading: false,
  member: {} as Member,
  signedIn: false,
});

// TODO: Refresh after 30 minutes of inactivity.

function displayAlert(alert: Alert): void {
  vm.alert = alert;

  setTimeout(() => {
    vm.alert.visible = false;
  }, 4000);
}

function loading(val: boolean) {
  vm.loading = val;
}

function signedIn(member: Member) {
  vm.member = member;
  vm.signedIn = true;
}

provide("displayAlert", displayAlert);
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
