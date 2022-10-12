<template>
  <v-container>
    <div v-for="type of ItemTypes" :key="type" class="mb-12">
      <h2 v-if="vm.items.filter((i) => i.type === type).length" class="mb-1"><b>{{ type }}</b></h2>
      <v-row>
        <v-col v-for="item in vm.items.filter((i) => i.type === type)" :key="item.ID" cols="12" sm="4" md="3">
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
    </div>

    <v-dialog v-model="vm.purchaseDialogVisible" transition="fab-transition">
      <v-card v-if="vm.page === 1" class="text-center">
        <v-container class="my-12">
          <v-row class="mb-4" dense justify="center">
            <v-col cols="12">
              <h1>Buy</h1>
            </v-col>

            <v-col cols="2">
              <v-btn
                @click="vm.count--"
                class="ml-auto"
                color="primary"
                size="x-large"
                variant="icon"
              >
                <v-icon size="x-large">
                  mdi-minus-circle
                </v-icon>
              </v-btn>
            </v-col>

            <v-col cols="2">
              <h1 style="font-size: 50px; margin-top: -20px; margin-bottom: -20px"><b>{{ vm.count }}</b></h1>
            </v-col>

            <v-col cols="2">
              <v-btn
                @click="vm.count++"
                class="mr-auto"
                color="primary"
                size="x-large"
                variant="icon"
              >
                <v-icon size="x-large">
                  mdi-plus-circle
                </v-icon>
              </v-btn>
            </v-col>

            <v-col cols="12">
              <h1>{{ vm.selectedItem.name }}</h1>
            </v-col>
          </v-row>

          <v-divider class="mt-6 mb-12" />

          <v-row justify="center" v-if="!vm.role" class="mb-8">
            <v-col cols="6">
              <v-btn @click="vm.role = 'member'" color="primary" size="x-large">
                <b>I'm a member</b>
              </v-btn>
            </v-col>

            <v-col cols="6">
              <v-btn @click="vm.role = 'guest'" color="primary" size="x-large">
                <b>I'm a guest</b>
              </v-btn>
            </v-col>
          </v-row>

          <code-pad v-if="vm.role === 'member'" style="max-width: 550px; margin: auto" @success="purchase" />

          <div v-else-if="vm.role === 'guest'">
            <h1><b class="text-orange-darken-3">Step 1:</b> Pay {{ vm.selectedItem.price * vm.count }} kr. with Vipps</h1>

            <v-img src="/qr.png" width="200" class="mx-auto my-6" />

            <v-row class="my-12">
              <v-col cols="6" class="text-right">
                <h1><b class="text-orange-darken-3">Step 2:</b> Click here:</h1>
              </v-col>

              <v-col cols="4">
                <v-btn color="success" size="x-large" @click="paidWithVipps()">
                  <b>I have paid!</b>
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-card>

      <v-card v-else-if="vm.page === 2" class="pa-4 text-center">
        <h1>Enjoy, bitch!</h1>

        <v-divider class="my-4" />

        <h3>You spent {{ vm.spent }} kr.</h3>
        <h4 v-if="vm.role === 'member'">You have {{ vm.newCredit }} kr. in your account.</h4>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import CodePad from "@/components/CodePad.vue";
import JSConfetti from "js-confetti";
import type Alert from "@/interfaces/Alert";
import type Item from "@/interfaces/Item";
import type Member from "@/interfaces/Member";
import { getItem, getItems, purchaseItem, updateItem } from "@/services/api";
import { inject, onMounted, reactive } from "vue";
import ItemTypes from "@/config/item-types";

const confetti = new JSConfetti();
const displayAlert = inject<(alert: Alert) => void>("displayAlert");
const loading = inject<(val: boolean) => void>("loading");

const vm = reactive({
  count: 1,
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
  vm.count = 1;
  vm.purchaseDialogVisible = true;
  vm.selectedItem = item;
  getItem(item.ID);
}

async function paidWithVipps() {
  loading && loading(true);

  vm.selectedItem.currentInventory -= vm.count;
  vm.spent = vm.selectedItem.price * vm.count;

  confetti.addConfetti();
  vm.page++;

  await updateItem(vm.selectedItem);

  loading && loading(false);

  await fetchItems();
  vm.selectedItem = {} as Item;

  setTimeout(() => {
    vm.purchaseDialogVisible = false;
  }, 10000);
}

async function purchase(member: Member) {
  loading && loading(true);

  if (member.credit > (vm.selectedItem.price * vm.count)) {
    const itemMember = await purchaseItem(vm.selectedItem.ID, vm.count, member.ID);

    vm.spent = vm.selectedItem.price * vm.count;
    vm.newCredit = itemMember.member.credit;

    confetti.addConfetti();
    vm.page++;

    await fetchItems();
    vm.selectedItem = {} as Item;
  }
  else {
    displayAlert && displayAlert({
      color: "error",
      message: "Click Member login to add more money",
      title: "You're too poor!",
      visible: true,
    });
  }

  loading && loading(false);

  setTimeout(() => {
    vm.purchaseDialogVisible = false;
  }, 10000);
}
</script>
