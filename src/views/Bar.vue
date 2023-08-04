<template>
  <v-container>
    <div v-for="type of ItemTypes" :key="type" class="mb-12">
      <div v-if="vm.items.filter((i) => i.type === type).length">
        <h1 class="mb-n2 text-blue-accent-1"><b>{{ type }}</b></h1>

        <v-divider class="mb-4 bg-light-blue-accent-4" />

        <v-row>
          <v-col v-for="item in vm.items.filter((i) => i.type === type)" :key="item.ID" cols="12" sm="4" md="3">
            <v-card @click="openItem(item)" class="py-3">
              <v-img :src="item.imageURL" height="250px" />

              <v-card-subtitle>

              </v-card-subtitle>

              <v-card-title>
                {{ item.brandName }}<br>
                <b>{{ item.name }}</b>
              </v-card-title>

              <v-card-subtitle>
                {{ item.externalPrice }} kr.
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>

    <v-dialog v-model="vm.purchaseDialogVisible" transition="fab-transition">
      <v-card v-if="vm.page === 1" class="text-center">
        <v-container class="my-12">
          <v-row class="mb-4" dense justify="center">
            <v-col cols="12">
              <h1>Buy</h1>
            </v-col>

            <v-col cols="1">
              <v-btn
                @click="vm.count--"
                class="ml-auto mt-n3"
                color="primary"
                variant="plain"
                size="x-large"
                icon
              >
                <v-icon size="x-large">
                  mdi-minus-circle
                </v-icon>
              </v-btn>
            </v-col>

            <v-col cols="2">
              <h1 style="font-size: 50px; margin-top: -20px; margin-bottom: -20px"><b>{{ vm.count }}</b></h1>
            </v-col>

            <v-col cols="1">
              <v-btn
                @click="vm.count++"
                class="mr-auto mt-n3"
                color="primary"
                variant="plain"
                size="x-large"
                icon
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
              <v-btn @click="setRole('member')" color="primary" size="x-large">
                <b>I'm a member</b>
              </v-btn>
            </v-col>

            <v-col cols="6">
              <v-btn @click="setRole('guest')" color="primary" size="x-large">
                <b>I'm a guest</b>
              </v-btn>
            </v-col>
          </v-row>

          <div v-if="vm.role">
            <code-pad v-if="vm.role === 'member'" style="max-width: 550px; margin: auto" @success="purchase" />

            <div v-else-if="vm.role === 'guest'">
              <h1><b>Pay {{ (vm.selectedItem.externalPrice || vm.selectedItem.price) * vm.count }} kr. with Vipps</b>
              </h1>

              <v-img src="/qr.png" width="200" class="mx-auto my-6" />

              <h2 class="text-green font-weight-bold">Completing purchase in... {{ vm.countDown }}</h2>
              <v-btn color="success" @click="completePurchase()" class="mr-2" variant="tonal">Complete now</v-btn>
              <v-btn color="error" @click="cancelPurchase()" variant="tonal">Cancel</v-btn>
            </div>
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

    <h2 class="text-center mt-12 font-weight-black">Product missing?<br>Please select a similar item.</h2>
  </v-container>
</template>

<script setup lang="ts">
import CodePad from "@/components/CodePad.vue";
import JSConfetti from "js-confetti";
import type Alert from "@/interfaces/Alert";
import type Item from "@/interfaces/Item";
import type Member from "@/interfaces/Member";
import { getItem, getItems, purchaseItem, updateItem } from "@/services/api";
import { inject, onMounted, reactive, watchEffect } from "vue";
import ItemTypes from "@/config/item-types";

const confetti = new JSConfetti();
const displayAlert = inject<(alert: Alert) => void>("displayAlert");
const loading = inject<(val: boolean) => void>("loading");

const vm = reactive({
  count: 1,
  countDown: 60,
  interval: {} as Timer,
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

watchEffect(() => {
  if (!vm.purchaseDialogVisible) {
    cancelPurchase();
  }
});

async function cancelPurchase() {
  clearInterval(vm.interval);
  vm.countDown = 60;
  vm.purchaseDialogVisible = false;
  vm.selectedItem = {} as Item;
}

async function completePurchase() {
  clearInterval(vm.interval);
  vm.countDown = 60;
  await paidWithVipps();
}

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

  const itemMember = await purchaseItem(vm.selectedItem.ID, vm.count, member.ID);

  vm.spent = vm.selectedItem.price * vm.count;
  vm.newCredit = itemMember.member.credit;

  confetti.addConfetti();
  vm.page++;

  await fetchItems();
  vm.selectedItem = {} as Item;

  loading && loading(false);

  setTimeout(() => {
    vm.purchaseDialogVisible = false;
  }, 10000);
}

function setRole(role: "member" | "guest") {
  vm.role = role;

  if (role === "guest") {
    vm.interval = setInterval(async () => {
      vm.countDown -= 1;
      if (vm.countDown <= 0) {
        clearInterval(vm.interval);
        await paidWithVipps();
      }
    }, 1000);
  }
}
</script>
