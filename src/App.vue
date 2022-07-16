<template>
  <v-container>
    <v-overlay :model-value="vm.loading" class="align-center justify-center">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-row>
      <v-col cols="12" md="3" class="text-center">
        <div style="position: sticky; top: 40vh">
          <img
            alt="S9 Logo"
            class="logo"
            src="./assets/logo.png"
            width="125"
            height="125"
          />

          <div v-if="vm.member.firstName">
            <h3>Welcome {{ vm.member.firstName }}</h3>
            <h5>{{ vm.member.credit }} ClubCoin</h5>
            <v-btn size="x-small" variant="text" class="mx-auto" @click="createCheckoutSession()">
              Top up balance
            </v-btn>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="9">
        <code-pad v-if="!vm.signedIn" @success="signedIn" />

        <v-container v-else>
          <v-tabs v-model="vm.tab" centered stacked background-color="rgb(255, 0, 136)">
            <v-tab value="payment" color="white">
              <v-icon>
                mdi-credit-card-outline
              </v-icon>
              Betaling
            </v-tab>

            <v-tab value="admin" color="white">
              <v-icon>
                mdi-phone
              </v-icon>
              Admin
            </v-tab>
          </v-tabs>

          <v-window v-model="vm.tab">
            <v-window-item value="payment">
              <h2>Betaling</h2>
              <v-btn @click="createPortalSession()" color="primary">
                Oppdater betalingsinformasjon
              </v-btn>
            </v-window-item>

            <v-window-item value="admin">
              <admin v-if="vm.member.admin" />
            </v-window-item>
          </v-window>
        </v-container>
      </v-col>
    </v-row>
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

@media (hover: hover)
  a:hover
    background-color: hsla(160, 100%, 37%, 0.2)

@media (min-width: 1024px)
  body
    display: flex
    place-items: center

  header
    display: flex
    place-items: center
    padding-right: calc(var(--section-gap) / 2)

  header .wrapper
    display: flex
    place-items: flex-start
    flex-wrap: wrap

  .logo
    margin: 0 2rem 0 0
</style>
