<script setup lang="ts">
import { getItems, getMembers, updateItem } from "@/config/firebase";
import type Item from "@/interfaces/Item";
import type Member from "@/interfaces/Member";
import { onMounted, reactive } from "vue";

const vm = reactive({
  addItemDialogVisible: false,
  addMemberDialogVisible: false,
  items: [] as Item[],
  newItem: {
    ID: 0,
    currentInventory: 0,
    imageURL: "",
    name: "",
    price: 0,
    type: ""
  } as Item,
  loading: true,
  members: [] as Member[],
});

onMounted(async () => {
  vm.items = await getItems();
  vm.members = await getMembers();
  vm.loading = false;
});
</script>

<template>
  <header>
    <img alt="S9 Logo" class="logo" src="./assets/logo.png" width="125" height="125" />
  </header>

  <main>
    <v-row align="center" class="mb-4">
      <h2 class="mr-4">Bar items</h2>

      <v-btn color="primary" size="x-small" @click="vm.addItemDialogVisible = true">New item</v-btn>
    </v-row>

    <v-progress-circular v-if="vm.loading" :loading="vm.loading" height="100" color="white" indeterminate />
    <v-expansion-panels v-else>
      <v-expansion-panel v-for="item in vm.items" :key="item.ID" cols="4">
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

            <v-col cols="10">
              <v-row>
                <v-col>
                  <v-text-field v-model="item.name" label="Name" @change="updateItem(item)" />
                </v-col>

                <v-col>
                  <v-text-field
                    v-model="item.price"
                    label="Price"
                    prefix="BitchCoin"
                    @change="updateItem(item)"
                    type="number"
                  />
                </v-col>

                <v-col>
                  <v-text-field
                    v-model="item.currentInventory"
                    label="In the bar"
                    @change="updateItem(item)"
                    type="number"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-divider class="my-12" />

    <v-row align="center" class="mb-4">
      <h2 class="mr-4">Club members</h2>

      <v-btn color="primary" size="x-small" @click="vm.addMemberDialogVisible = true">New member</v-btn>
    </v-row>

    <v-progress-circular v-if="vm.loading" :loading="vm.loading" height="100" color="white" indeterminate />
    <v-row v-else>
      <v-col v-for="member in vm.members" :key="member.ID" cols="12" sm="6">
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
    </v-row>

    <v-dialog v-model="vm.addItemDialogVisible">
      <v-card width="600" height="600">
        <v-row>
          <v-col>
            <v-text-field v-model="vm.newItem.name" label="Name" />
          </v-col>

          <v-col>
            <v-text-field v-model="vm.newItem.price" label="Price" prefix="BitchCoin" type="number" />
          </v-col>

          <v-col>
            <v-text-field v-model="vm.newItem.currentInventory" label="In the bar" type="number" />
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <v-dialog v-model="vm.addMemberDialogVisible">
      <v-card width="600" height="600">
        <h4>HER KAN MAN SNART LEGGE TIL MEDLEMMER</h4>
      </v-card>
    </v-dialog>
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
