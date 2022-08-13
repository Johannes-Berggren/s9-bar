<template>
  <v-container>
    <v-row>
      <v-col v-for="item in vm.items" :key="item.ID" cols="12" sm="4" md="3">
        <v-card @click="openItem(item)" class="py-3">
          <v-img :src="item.imageURL" height="250px" />

          <v-card-title>
            {{ item.name }}
          </v-card-title>

          <v-card-subtitle>
            {{ item.price }} kr.
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="vm.purchaseDialogVisible">
      <v-card v-if="vm.page === 1" class="text-center">
        <v-container>
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
              <h1><b>{{ vm.amount }}</b></h1>
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

          <v-row justify="center" v-if="!vm.role">
            <v-col cols="12">
              <h2>I'm a...</h2>
            </v-col>

            <v-col cols="3">
              <v-btn @click="vm.role = 'member'" color="primary">
                Member
              </v-btn>
            </v-col>

            <v-col cols="3">
              <v-btn @click="vm.role = 'guest'" color="primary">
                Guest
              </v-btn>
            </v-col>
          </v-row>

          <code-pad v-if="vm.role === 'member'" style="max-width: 550px;" @success="purchaseItem" />

          <div v-else-if="vm.role === 'guest'" class="mt-5">
            <h1>Pay {{ vm.selectedItem.price }} with Vipps</h1>
            <v-img src="/qr.png" width="200" class="mx-auto" />
          </div>
        </v-container>
      </v-card>

      <v-card v-else-if="vm.page === 2" class="pa-4 text-center">
        <h1>Enjoy, bitch!</h1>

        <v-divider class="my-4" />

        <h3>You spent {{ vm.spent }} kr..</h3>
        <h4>You have {{ vm.newCredit }} kr. in your account.</h4>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import CodePad from "@/components/CodePad.vue";
import type Alert from "@/interfaces/Alert";
import type Item from "@/interfaces/Item";
import type Member from "@/interfaces/Member";
import { getItems, updateItem, updateMember } from "@/config/firebase";
import { inject, onMounted, reactive } from "vue";

const displayAlert = inject<(alert: Alert) => void>("displayAlert");
const loading = inject<(val: boolean) => void>("loading");

const vm = reactive({
  amount: 1,
  items: [] as Item[],
  newCredit: 0,
  page: 1,
  purchaseDialogVisible: false,
  role: "",
  selectedItem: {} as Item,
  spent: 0,
});

onMounted(async () => {
  await fetchItems();
});

async function fetchItems() {
  loading && loading(true);
  const _items = await getItems();
  vm.items = _items.filter((item) => item.currentInventory > 0);
  loading && loading(false);
}

function openItem(item: Item) {
  vm.role = "";
  vm.page = 1;
  vm.amount = 1;
  vm.purchaseDialogVisible = true;
  vm.selectedItem = item;
}

async function purchaseItem(member: Member) {
  loading && loading(true);
  if (member.credit > vm.selectedItem.price) {
    vm.selectedItem.currentInventory -= vm.amount;
    vm.spent = vm.selectedItem.price * vm.amount;
    vm.newCredit = member.credit -= vm.spent;
    await Promise.all([
      updateItem(vm.selectedItem),
      updateMember(member),
      // TODO: ADD TRANSACTION
    ]);
    await fetchItems();
    vm.page++;
    vm.selectedItem = {} as Item;
  }
  else {
    displayAlert && displayAlert({
      color: "error",
      message: "Sign in to buy more kr.",
      title: "You're too poor!",
      visible: true,
    });
  }
  loading && loading(false);
}
</script>
