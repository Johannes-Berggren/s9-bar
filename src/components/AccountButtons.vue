<template>
  <v-row class="text-center">
    <v-col cols="4">
      <v-btn
        @click="createCheckoutSession('price_1LictrI1MJoejWlLaZN6faHU')"
        color="#F269D4"
        size="x-large"
      >
        <b style="color: white">Add 200 kr.</b>
      </v-btn>
    </v-col>

    <v-col cols="4">
      <v-btn
        @click="createCheckoutSession('price_1LMHtpI1MJoejWlLBj1SnnjZ')"
        color="#F269D4"
        size="x-large"
      >
        <b style="color: white">Add 500 kr.</b>
      </v-btn>
    </v-col>

    <v-col cols="4">
      <v-btn
        @click="createCheckoutSession('price_1LMHu3I1MJoejWlLV6PttYx7')"
        color="#F269D4"
        size="x-large"
      >
        <b style="color: white">Add 1000 kr.</b>
      </v-btn>
    </v-col>

    <v-col cols="12">
      <v-divider class="my-6" />

      <v-btn
        @click="createPortalSession()"
        color="#F269D4"
      >
        <b style="color: white">Update S9 Membership</b>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type Member from "@/interfaces/Member";
import { createCustomerCheckoutSession, createCustomerPortalSession } from "@/services/api";
import { inject, onMounted, type PropType, reactive } from "vue";

const props = defineProps({
  member: Object as PropType<Member>,
});

const loading = inject<(val: boolean) => void>("loading");

const vm = reactive({
  member: {} as Member | undefined,
});

onMounted(() => {
  vm.member = props.member;
});

async function createCheckoutSession(priceID: string) {
  if (vm.member?.ID) {
    loading && loading(true);
    const session = await createCustomerCheckoutSession(vm.member.ID, vm.member.stripeID, priceID);
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
