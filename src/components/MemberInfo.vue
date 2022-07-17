<template>
  <v-row v-if="vm.member.firstName">
    <v-col cols="12">
      <h3>Welcome {{ vm.member.firstName }}</h3>
      <h4>{{ vm.member.credit }} ClubCoin</h4>
    </v-col>

    <v-col cols="4">
      <v-btn
        size="x-small"
        variant="outlined"
        @click="createCheckoutSession()"
        color="rgb(255, 0, 136)"
      >
        Top up balance
      </v-btn>
    </v-col>

    <v-col cols="4">
      <v-btn @click="createPortalSession()" variant="outlined" color="rgb(255, 0, 136)" size="x-small">
        Payment info
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { createCustomerCheckoutSession, createCustomerPortalSession } from "@/config/firebase";
import type Member from "@/interfaces/Member";
import { onMounted, type PropType, reactive } from "vue";

const props = defineProps({
  member: Object as PropType<Member>,
});

const vm = reactive({
  loading: false,
  member: {} as Member | undefined,
  signedIn: false,
  tab: null,
});

onMounted(() => {
  vm.member = props.member;
  console.log(vm.member);
});

async function createCheckoutSession() {
  if (vm.member?.ID) {
    vm.loading = true;
    const session = await createCustomerCheckoutSession(vm.member.ID, vm.member.stripeID);
    if (session.url) window.open(session.url, "_self");
  }
}

async function createPortalSession() {
  if (vm.member?.ID) {
    vm.loading = true;
    const session = await createCustomerPortalSession(vm.member.stripeID);
    window.open(session.url, "_self");
  }
}
</script>
