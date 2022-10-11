<template>
  <v-container>
    <!--    <v-row>-->
    <!--      <v-col>-->
    <!--        <v-btn color="primary" @click="unlock()">-->
    <!--          Unlock fridge-->
    <!--        </v-btn>-->
    <!--      </v-col>-->

    <!--      <v-col>-->
    <!--        <v-btn color="primary" @click="lock()">-->
    <!--          Lock fridge-->
    <!--        </v-btn>-->
    <!--      </v-col>-->
    <!--    </v-row>-->

    <v-row align="center" class="mb-4">
      <h2 class="mr-4">Bar items</h2>

      <v-btn color="primary" size="x-small" @click="vm.addItemDialogVisible = true">New item</v-btn>
    </v-row>

    <v-progress-circular v-if="vm.loading" :loading="vm.loading" height="100" color="white" indeterminate />
    <v-expansion-panels v-else>
      <v-expansion-panel v-for="item in vm.items" :key="item.ID" cols="4">
        <v-expansion-panel-title>
          <b class="text-left">{{ item.name }}</b>
          <span class="ml-4 text-grey">{{ item.type }}</span>

          <v-spacer />

          <span class="mr-4 text-grey-darken-3">{{ item.price }} ClubCoin</span>

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
    </v-row>

    <v-progress-circular v-if="vm.loading" :loading="vm.loading" height="100" color="white" indeterminate />
    <v-row v-else>
      <v-col v-for="member in vm.members" :key="member.ID" cols="12" sm="4">
        <v-card class="pb-4">
          <v-card-title>
            {{ member.firstName }} {{ member.lastName }}
          </v-card-title>

          <v-card-subtitle>
            {{ member.credit }} kr.
          </v-card-subtitle>

          <!--          <v-card-actions>-->
          <!--            <v-spacer />-->
          <!--            <v-btn size="x-small" @click="vm.memberInfoDialogVisible = true; vm.pickedMember = member" variant="outlined" color="primary">-->
          <!--              More info-->
          <!--            </v-btn>-->
          <!--          </v-card-actions>-->
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-12" />

    <!-- TRANSACTION LIST -->
    <!--    <v-row align="center" class="mb-4">-->
    <!--      <h2 class="mr-4">Transactions</h2>-->
    <!--    </v-row>-->

    <!--    <v-progress-circular v-if="vm.loading" :loading="vm.loading" height="100" color="white" indeterminate />-->
    <!--    <v-row v-else>-->
    <!--      <pre style="color: white">{{ vm.transactions }}</pre>-->
    <!--    </v-row>-->

    <!-- ADD ITEM DIALOG -->
    <v-dialog v-model="vm.addItemDialogVisible">
      <v-card width="600" height="600">
        <BarItem :item="vm.newItem" />
      </v-card>
    </v-dialog>

    <!-- MEMBER INFORMATION DIALOG -->
    <v-dialog v-model="vm.memberInfoDialogVisible">
      <v-card width="600" height="600">
        <v-row class="text-center">
          <v-col cols="6">
            {{ vm.pickedMember.firstName }}
          </v-col>

          <v-col cols="6">
            {{ vm.pickedMember.lastName }}
          </v-col>

          <v-col cols="6">
            {{ vm.pickedMember.email }}
          </v-col>

          <v-col cols="6">
            {{ vm.pickedMember.phone }}
          </v-col>

          <v-col cols="6">
            {{ vm.pickedMember.credit }} kr.
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import BarItem from "@/components/BarItem.vue";
import type Item from "@/interfaces/Item";
import type Member from "@/interfaces/Member";
import type Transaction from "@/interfaces/Transaction";
import { getMembers, getTransactions } from "@/config/firebase";
import { getItems } from "@/services/api";
import { onMounted, provide, reactive } from "vue";

const vm = reactive({
  addItemDialogVisible: false,
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

  vm.loading = false;
});

async function fetchItems(): Promise<void> {
  vm.items = await getItems();
}

provide<() => Promise<void>>("fetchItems", fetchItems);
</script>
