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

          <!--          <v-card-actions>-->
          <!--            <v-btn color="primary" size="small" class="mx-auto" variant="rounded">-->
          <!--              Buy-->
          <!--            </v-btn>-->

          <!--            <v-spacer />-->

          <!--            <v-btn color="primary" size="small" class="mx-auto">-->
          <!--              Button 2-->
          <!--            </v-btn>-->
          <!--          </v-card-actions>-->
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="vm.purchaseDialogVisible">
      <v-card class="pa-4 text-center">
        <v-row class="mb-4">
          <v-col>
            <v-btn
              icon
              @click="vm.amount--"
              class="ml-auto"
              color="primary"
              size="large"
            >
              <v-icon>
                mdi-minus-circle
              </v-icon>
            </v-btn>
          </v-col>

          <v-col>
            <h1>Buy {{ vm.amount }} {{ vm.selectedItem.name }}</h1>
          </v-col>

          <v-col>
            <v-btn
              class="mr-auto"
              icon
              @click="vm.amount++"
              color="primary"
              size="large"
            >
              <v-icon>
                mdi-plus-circle
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <code-pad style="max-width: 550px;" @success="purchaseItem" />
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
  purchaseDialogVisible: false,
  selectedItem: {} as Item,
});

onMounted(async () => {
  loading && loading(true);
  const _items = await getItems();
  vm.items = _items.filter((item) => item.currentInventory);
  loading && loading(false);
});

function openItem(item: Item) {
  vm.purchaseDialogVisible = true;
  vm.selectedItem = item;
}

async function purchaseItem(member: Member) {
  console.log(`${member.firstName} bought ${vm.amount} ${vm.selectedItem.name}`);
  vm.selectedItem.currentInventory--;
  member.credit -= vm.selectedItem.price;
  await updateItem(vm.selectedItem);
  await updateMember(member);
  vm.purchaseDialogVisible = false;
  vm.selectedItem = {} as Item;
}
</script>
