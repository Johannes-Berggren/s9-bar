<template>
  <div class="text-center mb-3">
    <h1><b>Welcome {{ vm.member.firstName }}</b></h1>
    <h2>You have {{ vm.member.credit }} ClubCoin</h2>
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
