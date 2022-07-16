<template>
  <v-container>
    <v-overlay :model-value="vm.loading" class="align-center justify-center">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <div>
      <v-row class="text-center mx-auto" style="max-width: 400px" align="center">
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
          <v-row v-if="vm.member.firstName">
            <v-col cols="12">
              <h3>Welcome {{ vm.member.firstName }}</h3>
              <h4 class="mb-2">{{ vm.member.credit }} ClubCoin</h4>
            </v-col>

            <v-col cols="6">
              <v-btn size="x-small" variant="outlined" class="mx-auto" @click="createCheckoutSession()" color="rgb(255, 0, 136)">
                Top up balance
              </v-btn>
            </v-col>

            <v-col cols="6">
              <v-btn @click="createPortalSession()" variant="outlined" color="rgb(255, 0, 136)" size="x-small">
                Payment info
              </v-btn>
            </v-col>
          </v-row>
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
import { createCustomerCheckoutSession, createCustomerPortalSession } from "@/config/firebase";
import Admin from "@/views/Admin.vue";
import CodePad from "@/components/CodePad.vue";
import type Member from "@/interfaces/Member";
import { reactive } from "vue";

const vm = reactive({
  loading: false,
  member: {} as Member,
  signedIn: false,
  tab: null,
});

async function createCheckoutSession() {
  vm.loading = true;
  const session = await createCustomerCheckoutSession(vm.member.ID, vm.member.stripeID);
  if (session.url) window.open(session.url, "_self");
}

async function createPortalSession() {
  vm.loading = true;
  const session = await createCustomerPortalSession(vm.member.stripeID);
  window.open(session.url, "_self");
}

function signedIn(member: Member) {
  vm.member = member;
  vm.signedIn = true;
}
</script>

<style lang="sass">
@import './assets/base.css'
</style>
