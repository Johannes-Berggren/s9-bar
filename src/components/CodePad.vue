<template>
  <v-row class="code-pad" justify="center">
    <v-col cols="12">
      <div style="max-width: 400px" class="mx-auto">
        <v-text-field
          readonly
          type="password"
          v-model="vm.code"
          variant="outlined"
          label="Welcome. Enter your door code."
        />
      </div>
    </v-col>

    <v-col cols="4">
      <v-btn class="mx-auto" @click="enterNumber(1)" icon size="x-large" color="primary">
        1
      </v-btn>
    </v-col>

    <v-col cols="4">
      <v-btn class="mx-auto" @click="enterNumber(2)" icon size="x-large" color="primary">
        2
      </v-btn>
    </v-col>

    <v-col cols="4">
      <v-btn class="mx-auto" @click="enterNumber(3)" icon size="x-large" color="primary">
        3
      </v-btn>
    </v-col>

    <v-col cols="4">
      <v-btn class="mx-auto" @click="enterNumber(4)" icon size="x-large" color="primary">
        4
      </v-btn>
    </v-col>

    <v-col cols="4">
      <v-btn class="mx-auto" @click="enterNumber(5)" icon size="x-large" color="primary">
        5
      </v-btn>
    </v-col>

    <v-col cols="4">
      <v-btn class="mx-auto" @click="enterNumber(6)" icon size="x-large" color="primary">
        6
      </v-btn>
    </v-col>

    <v-col cols="4">
      <v-btn class="mx-auto" @click="enterNumber(7)" icon size="x-large" color="primary">
        7
      </v-btn>
    </v-col>

    <v-col cols="4">
      <v-btn class="mx-auto" @click="enterNumber(8)" icon size="x-large" color="primary">
        8
      </v-btn>
    </v-col>

    <v-col cols="4">
      <v-btn class="mx-auto" @click="enterNumber(9)" icon size="x-large" color="primary">
        9
      </v-btn>
    </v-col>

    <v-col cols="4">
      <v-btn class="mx-auto" @click="enterNumber(0)" icon size="x-large" color="primary">
        0
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { defineEmits, onMounted, reactive } from "vue";
import { getMembers } from "@/config/firebase";

const emit = defineEmits(["success"]);
import type Member from "@/interfaces/Member";

const vm = reactive({
  code: "",
  members: [] as Member[],
});

onMounted(async () => {
  vm.members = await getMembers();
});

function enterNumber(num: number) {
  vm.code = vm.code + num;

  if (vm.code.length === 4) {
    const member = vm.members.filter((m) => m.code === vm.code)[0];
    if (member) emit("success", member);
    else vm.code = "";
  }
}
</script>

<style lang="sass">
.code-pad .v-field__field
  font-size: 50px
  text-align: center

  input
    text-align: center
</style>
