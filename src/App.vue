<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="3">
          <img
            alt="S9 Logo"
            class="logo"
            src="./assets/logo.png"
            width="125"
            height="125"
            style="position: sticky; top: 40vh"
          />
        </v-col>

        <!-- BAR ITEM LIST -->
        <v-col cols="12" md="9">
          <admin v-if="vm.admin" />

          <v-row v-else>
            <v-col cols="12">
              {{ vm.code }}
            </v-col>

            <v-col cols="4">
              <v-btn @click="enterNumber(1)" icon size="x-large" color="primary">
                1
              </v-btn>
            </v-col>

            <v-col cols="4">
              <v-btn @click="enterNumber(2)" icon size="x-large" color="primary">
                2
              </v-btn>
            </v-col>

            <v-col cols="4">
              <v-btn @click="enterNumber(3)" icon size="x-large" color="primary">
                3
              </v-btn>
            </v-col>

            <v-col cols="4">
              <v-btn @click="enterNumber(4)" icon size="x-large" color="primary">
                4
              </v-btn>
            </v-col>

            <v-col cols="4">
              <v-btn @click="enterNumber(5)" icon size="x-large" color="primary">
                5
              </v-btn>
            </v-col>

            <v-col cols="4">
              <v-btn @click="enterNumber(6)" icon size="x-large" color="primary">
                6
              </v-btn>
            </v-col>

            <v-col cols="4">
              <v-btn @click="enterNumber(7)" icon size="x-large" color="primary">
                7
              </v-btn>
            </v-col>

            <v-col cols="4">
              <v-btn @click="enterNumber(8)" icon size="x-large" color="primary">
                8
              </v-btn>
            </v-col>

            <v-col cols="4">
              <v-btn @click="enterNumber(9)" icon size="x-large" color="primary">
                9
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import Admin from "@/views/Admin.vue";
import { reactive } from "vue";

const vm = reactive({
  admin: false,
  code: "",
});

function enterNumber(num: number) {
  vm.code = vm.code + num;

  if (vm.code === "5647" || vm.code === "5473") vm.admin = true;
}
</script>

<style>
@import './assets/base.css';

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>
