<template>
  <div>
    <v-container>
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

            <h3 v-if="vm.member.firstName">Velkommen {{ vm.member.firstName }}</h3>
          </div>
        </v-col>

        <v-col cols="12" md="9">
          <admin v-if="vm.admin" />
          <code-pad v-else @success="signedIn" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import CodePad from "@/components/CodePad.vue";
import type Member from "@/interfaces/Member";
import Admin from "@/views/Admin.vue";
import { reactive } from "vue";

const vm = reactive({
  admin: false,
  member: {} as Member,
});

function signedIn(member: Member) {
  vm.admin = true;
  vm.member = member;
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
