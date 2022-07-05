<script setup lang="ts">
import { getItems, getMembers } from "@/config/firebase";
import { onMounted, ref } from "vue";

const items = ref<Record<string, unknown>[]>([]);
const loading = ref(true);
const members = ref<Record<string, unknown>[]>([]);

onMounted(async () => {
  items.value = await getItems();
  members.value = await getMembers();

  loading.value = false;
});

</script>

<template>
  <header>
    <img alt="S9 Logo" class="logo" src="./assets/logo.png" width="125" height="125" />
  </header>

  <main>
    <v-row align="center" class="mb-4">
      <h2 class="mr-4">Bar items</h2>

      <v-btn color="primary" size="x-small">New item</v-btn>
    </v-row>

    <v-progress-circular v-if="loading" :loading="loading" height="100" color="white" indeterminate />
    <v-expansion-panels v-else>
      <v-expansion-panel v-for="item in items" :key="item.name" cols="4">
        <v-expansion-panel-title>
          <b>{{ item.name }}</b>
          <v-spacer />
          {{ item.currentInventory }} left in the bar
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-row>
            <v-col cols="2">
              <v-img :src="item.imageURL" />
            </v-col>

            <v-col>
              <h3>Pris {{ item.price }}</h3>
              <v-btn color="primary" large>Kjøp!</v-btn>
            </v-col>

            <v-col cols="12">
              <pre>{{ item }}</pre>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-divider class="my-12" />

    <v-row align="center" class="mb-4">
      <h2 class="mr-4">Club members</h2>

      <v-btn color="primary" size="x-small">New member</v-btn>
    </v-row>

    <v-progress-circular v-if="loading" :loading="loading" height="100" color="white" indeterminate />
    <v-row v-else>
      <v-col v-for="member in members" :key="member.ID" cols="4">
        <v-card>
          <v-card-title>
            {{ member.firstName }} {{ member.lastName }}
          </v-card-title>

          <v-card-actions>
            <v-row>
              <v-col>
                <v-btn>Knapp 1</v-btn>
              </v-col>

              <v-col>
                <v-btn>Knapp 2</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12">

      </v-col>
    </v-row>
  </main>
</template>

<style>
@import './assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
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

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
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
