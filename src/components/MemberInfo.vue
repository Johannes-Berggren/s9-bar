<template>
  <v-row v-if="vm.member.firstName" class="text-center mb-3">
    <v-col cols="12">
      <h2><b>Welcome {{ vm.member.firstName }}</b></h2>
      <h3>You have {{ vm.member.credit }} kr.</h3>
    </v-col>

    <v-col cols="12">
      <v-btn
        @click="createCheckoutSession()"
        color="primary"
        class="mx-auto"
      >
        Buy more kr.
      </v-btn>
    </v-col>

    <v-col cols="12">
      <v-btn
        @click="createPortalSession()"
        color="primary"
        class="mx-auto"
      >
        Update S9 Membership
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { createCustomerCheckoutSession, createCustomerPortalSession } from "@/config/firebase";
import type Member from "@/interfaces/Member";
import { inject, onMounted, type PropType, reactive } from "vue";

const loading = inject<(val: boolean) => void>("loading");

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
});

async function createCheckoutSession() {
  if (vm.member?.ID) {
    loading && loading(true);
    const session = await createCustomerCheckoutSession(vm.member.ID, vm.member.stripeID);
    if (session.url) window.open(session.url, "_self");
  }
}

async function createPortalSession() {
  if (vm.member?.ID) {
    loading && loading(true);
    const session = await createCustomerPortalSession(vm.member.stripeID);
    window.open(session.url, "_self");
  }
}
</script>
