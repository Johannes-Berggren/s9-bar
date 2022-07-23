<template>
  <v-container>
    <v-row>
      <v-col v-for="item in vm.items" :key="item.ID" cols="6" sm="4">
        <v-card @click="openItem(item)" class="py-3">
          <v-img :src="item.imageURL" height="250px" />

          <v-card-title>
            {{ item.name }}
          </v-card-title>

          <v-card-subtitle>
            {{ item.price }} ClubCoin
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="vm.purchaseDialogVisible" width="600">
      <v-card v-if="vm.page === 1" class="pa-4 text-center">
        <v-row class="mb-4" dense>
          <v-col cols="12">
            <h2>Buy</h2>
          </v-col>
          <v-col>
            <v-btn
              variant="icon"
              @click="vm.amount--"
              class="ml-auto"
              color="primary"
              size="x-large"
            >
              <v-icon>
                mdi-minus-circle
              </v-icon>
            </v-btn>
          </v-col>

          <v-col cols="1">
            <h1>{{ vm.amount }}</h1>
          </v-col>

          <v-col>
            <v-btn
              class="mr-auto"
              variant="icon"
              @click="vm.amount++"
              color="primary"
              size="x-large"
            >
              <v-icon>
                mdi-plus-circle
              </v-icon>
            </v-btn>
          </v-col>

          <v-col cols="12">
            <h2>{{ vm.selectedItem.name }}</h2>
          </v-col>
        </v-row>

        <v-divider class="mt-2 mb-6" />

        <code-pad style="max-width: 550px;" @success="purchaseItem" />
      </v-card>

      <v-card v-else-if="vm.page === 2" class="pa-4 text-center" >
        <h1>Enjoy, bitch!</h1>

        <v-divider class="my-4" />

        <h3>You spent {{ vm.spent }} ClubCoin.</h3>
        <h4>You have {{ vm.newCredit }} ClubCoin in your account.</h4>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import CodePad from "@/components/CodePad.vue";
import type Item from "@/interfaces/Item";
import type Member from "@/interfaces/Member";
import { getItems, updateItem, updateMember } from "@/config/firebase";
import { inject, onMounted, reactive } from "vue";

const loading = inject<(val: boolean) => void>("loading");

const vm = reactive({
  amount: 1,
  items: [] as Item[],
  newCredit: 0,
  page: 1,
  purchaseDialogVisible: false,
  selectedItem: {} as Item,
  spent: 0,
});

onMounted(async () => {
  loading && loading(true);
  const _items = await getItems();
  vm.items = _items.filter((item) => item.currentInventory);
  loading && loading(false);
});

function openItem(item: Item) {
  vm.page = 1;
  vm.purchaseDialogVisible = true;
  vm.selectedItem = item;
}

async function purchaseItem(member: Member) {
  loading && loading(true);
  vm.selectedItem.currentInventory -= vm.amount;
  vm.spent = vm.selectedItem.price * vm.amount;
  vm.newCredit = member.credit -= vm.spent;
  await updateItem(vm.selectedItem);
  await updateMember(member);
  vm.page++;
  vm.selectedItem = {} as Item;
  loading && loading(false);
}
</script>
