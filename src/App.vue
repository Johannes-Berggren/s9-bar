<template>
  <v-container>
    <v-overlay :model-value="vm.loading" class="align-center justify-center">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <div>
      <v-row id="header" align="center" justify="space-between" dense>
        <v-col>
          <img
            alt="S9 Logo"
            class="logo"
            src="./assets/Futoria_Logo_Icon_White.png"
            width="150"
            height="150"
          />
        </v-col>

        <v-col cols="6" v-if="!vm.signedIn && !vm.codePadVisible" style="text-align: center; color: white;" class="pt-10">
          <h2>Welcome to The Club.</h2>
          <h1 style="font-size: 60px">
            <b>Select item</b>
          </h1>

          <member-info v-if="vm.signedIn" :member="vm.member" />
        </v-col>

        <v-col align="right">
          <v-btn
            v-if="!vm.signedIn && !vm.codePadVisible"
            color="#F269D4"
            @click="vm.codePadVisible = true"
            class="mx-auto mr-sm-0"
            size="large"
          >
            <b style="color: white">Member login</b>
          </v-btn>

          <v-btn
            v-else-if="!vm.signedIn && vm.codePadVisible"
            color="error"
            @click="vm.codePadVisible = false"
            class="mx-auto mr-sm-0"
            size="large"
          >
            <b style="color: white">Cancel</b>
          </v-btn>

          <v-btn
            v-else
            size="large"
            color="#F269D4"
            @click="vm.member = undefined; vm.signedIn = false; vm.codePadVisible = false"
            class="ml-auto"
          >
            <b style="color: white">Sign out</b>
          </v-btn>
        </v-col>
      </v-row>

      <v-container class="mt-10">
        <bar v-if="!vm.codePadVisible" />
        <code-pad v-else-if="!vm.signedIn" @success="signedIn" color="white" />

        <div v-else-if="vm.signedIn">
          <account-buttons :member="vm.member" />

          <v-divider class="my-6" />

          <div v-if="vm.signedIn && vm.member.admin">
            <h1 class="text-center text-white">Admin-area</h1>
            <admin />
          </div>
        </div>
      </v-container>
    </div>

    <!-- Alert snackbar -->
    <v-snackbar
      v-model="vm.alert.visible"
      :color="vm.alert.color"
      multi-line
      location="top"
    >
      <strong>{{ vm.alert.title }}</strong><br>
      {{ vm.alert.message }}
    </v-snackbar>
    <!-- Alert snackbar end -->
  </v-container>
</template>

<script setup lang="ts">
import AccountButtons from "@/components/AccountButtons.vue";
import Admin from "@/views/Admin.vue";
import Bar from "@/views/Bar.vue";
import CodePad from "@/components/CodePad.vue";
import MemberInfo from "@/components/MemberInfo.vue";
import type Alert from "@/interfaces/Alert";
import type Member from "@/interfaces/Member";
import { provide, reactive } from "vue";

const vm = reactive({
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
@import './styles/variables.scss'

#header
  position: sticky
  top: 0
  background-color: #4a1964
  z-index: 10
</style>
