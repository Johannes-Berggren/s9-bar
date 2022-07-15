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
                <BarItem :item="item" />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-divider class="my-12" />

          <!-- CLUB MEMBER LIST -->
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
                      <v-btn size="small">Add credit</v-btn>
                    </v-col>

                    <v-col>
                      <v-btn size="small" @click="vm.memberInfoDialogVisible = true; vm.pickedMember = member">More
                        info
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-12" />

          <!-- TRANSACTION LIST -->
          <v-row align="center" class="mb-4">
            <h2 class="mr-4">Transactions</h2>
          </v-row>

          <v-progress-circular v-if="vm.loading" :loading="vm.loading" height="100" color="white" indeterminate />
          <v-row v-else>
            <pre style="color: white">{{ vm.transactions }}</pre>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- ADD ITEM DIALOG -->
    <v-dialog v-model="vm.addItemDialogVisible">
      <v-card width="600" height="600">
        <BarItem :item="vm.newItem" />
      </v-card>
    </v-dialog>

    <!-- ADD MEMBER DIALOG -->
    <v-dialog v-model="vm.addMemberDialogVisible">
      <v-card width="600" height="600">
        <h4>HER KAN MAN SNART LEGGE TIL MEDLEMMER</h4>
      </v-card>
    </v-dialog>

    <!-- MEMBER INFORMATION DIALOG -->
    <v-dialog v-model="vm.memberInfoDialogVisible">
      <v-card width="600" height="600">
        <pre>{{ vm.pickedMember }}</pre>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import BarItem from "@/components/BarItem.vue";
import { createCustomerPortalSession, getItems, getMembers, getTransactions } from "@/config/firebase";
import type Item from "@/interfaces/Item";
import type Member from "@/interfaces/Member";
import type Transaction from "@/interfaces/Transaction";
import { onMounted, provide, reactive } from "vue";

const vm = reactive({
  addItemDialogVisible: false,
  addMemberDialogVisible: false,
  items: [] as Item[],
  memberInfoDialogVisible: false,
  newItem: {
    ID: 0,
    currentInventory: 0,
    imageURL: "",
    name: "",
    price: 0,
    type: "",
  } as Item,
  loading: true,
  members: [] as Member[],
  pickedMember: {},
  transactions: [] as Transaction[],
});

onMounted(async () => {
  [
    vm.items,
    vm.members,
    vm.transactions,
  ] = await Promise.all([
    getItems(),
    getMembers(),
    getTransactions(),
  ]);

  console.log("mounted");

  try {
    const session = await createCustomerPortalSession("cus_JBbsa5PvlS9DKY");
    console.log(session);
  }
  catch (e) {
    console.error(e);
  }

  vm.loading = false;
});

async function fetchItems(): Promise<void> {
  vm.items = await getItems();
}

provide<() => Promise<void>>("fetchItems", fetchItems);
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
