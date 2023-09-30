<template>
  <div>
    <h1><b>Welcome {{ vm.member.firstName }}</b></h1>
    <h2 class="mb-4">You have {{ vm.member.credit }} kr. in your account.</h2>
    <h4 v-if="vm.member.credit <= 0">Remember to refill your account to avoid 10% late fee.</h4>
  </div>
</template>

<script setup lang="ts">
import type Member from "@/interfaces/Member";
import { onMounted, type PropType, reactive } from "vue";

const props = defineProps({
  member: Object as PropType<Member>,
});

const vm = reactive({
  member: {} as Member | undefined,
});

onMounted(() => {
  vm.member = props.member;
});
</script>
