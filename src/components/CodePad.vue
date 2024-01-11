<template>
  <v-row class="code-pad" justify="center">
    <v-col cols="12">
      <v-row style="max-width: 500px" class="mx-auto">
        <v-col cols="10">
          <v-text-field
            :style="`color: ${ props.color }`"
            readonly
            type="password"
            v-model="vm.code"
            variant="outlined"
            label="Enter your code."
          />
        </v-col>

        <v-col cols="2">
          <v-btn @click="del()" icon class="mt-6" size="large" variant="tonal" :color="props.color">
            <v-icon>mdi-backspace</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="4" class="text-center">
      <v-btn @click="enterNumber(1)" icon size="x-large" color="#F269D4">
        <b style="color: white">1</b>
      </v-btn>
    </v-col>

    <v-col cols="4" class="text-center">
      <v-btn @click="enterNumber(2)" icon size="x-large" color="#F269D4">
        <b style="color: white">2</b>
      </v-btn>
    </v-col>

    <v-col cols="4" class="text-center">
      <v-btn @click="enterNumber(3)" icon size="x-large" color="#F269D4">
        <b style="color: white">3</b>
      </v-btn>
    </v-col>

    <v-col cols="4" class="text-center">
      <v-btn @click="enterNumber(4)" icon size="x-large" color="#F269D4">
        <b style="color: white">4</b>
      </v-btn>
    </v-col>

    <v-col cols="4" class="text-center">
      <v-btn @click="enterNumber(5)" icon size="x-large" color="#F269D4">
        <b style="color: white">5</b>
      </v-btn>
    </v-col>

    <v-col cols="4" class="text-center">
      <v-btn @click="enterNumber(6)" icon size="x-large" color="#F269D4">
        <b style="color: white">6</b>
      </v-btn>
    </v-col>

    <v-col cols="4" class="text-center">
      <v-btn @click="enterNumber(7)" icon size="x-large" color="#F269D4">
        <b style="color: white">7</b>
      </v-btn>
    </v-col>

    <v-col cols="4" class="text-center">
      <v-btn @click="enterNumber(8)" icon size="x-large" color="#F269D4">
        <b style="color: white">8</b>
      </v-btn>
    </v-col>

    <v-col cols="4" class="text-center">
      <v-btn @click="enterNumber(9)" icon size="x-large" color="#F269D4">
        <b style="color: white">9</b>
      </v-btn>
    </v-col>

    <v-col cols="4" class="text-center">
      <v-btn @click="enterNumber(0)" icon size="x-large" color="#F269D4">
        <b style="color: white">0</b>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type Alert from "@/interfaces/Alert";
import type Member from "@/interfaces/Member";
import { getMembers } from "@/services/api";
import { defineEmits, inject, reactive } from "vue";

const emit = defineEmits(["success"]);
const displayAlert = inject<(alert: Alert) => void>("displayAlert");

const props = defineProps({
  color: String,
});

const vm = reactive({
  code: "",
  members: [] as Member[],
});

async function enterNumber(num: number) {
  vm.code = vm.code + num;

  if (vm.code.length === 4) {
    vm.members = await getMembers();

    const member = vm.members.filter((m) => m.code === vm.code)[0];

    if (member) emit("success", member);
    else {
      displayAlert && displayAlert({
        color: "error",
        message: "",
        title: "Wrong code. NO DRINK FOR YOU!",
        visible: true,
      });
      vm.code = "";
    }
  }
}

function del() {
  vm.code = "";
}
</script>

<style lang="sass">
.code-pad .v-field__field
  font-size: 50px
  text-align: center

  input
    text-align: center
</style>
