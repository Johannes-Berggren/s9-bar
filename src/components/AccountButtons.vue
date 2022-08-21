<template>
  <v-row class="text-center">
    <v-col cols="6">
      <v-btn
        @click="createCheckoutSession()"
        color="primary"
        size="x-large"
      >
        Buy ClubCoin
      </v-btn>
    </v-col>

    <v-col cols="6">
      <v-btn
        @click="createPortalSession()"
        color="primary"
        size="x-large"
      >
        Update S9 Membership
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
