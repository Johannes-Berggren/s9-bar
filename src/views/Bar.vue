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
      <v-card class="text-center">
        <h1>Buy one {{ vm.selectedItem.name }}</h1>

        <code-pad @success="purchaseItem" />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import CodePad from "@/components/CodePad.vue";
import type Item from "@/interfaces/Item";
import type Member from "@/interfaces/Member";
import { getItems } from "@/config/firebase";
import { inject, onMounted, reactive } from "vue";

const loading = inject<(val: boolean) => void>("loading");

const vm = reactive({
  items: [] as Item[],
  purchaseDialogVisible: false,
  selectedItem: {} as Item,
});

onMounted(async () => {
  loading && loading(true);
  vm.items = await getItems();
  loading && loading(false);
});

function openItem(item: Item) {
  vm.purchaseDialogVisible = true;
  vm.selectedItem = item;
}

function purchaseItem(member: Member) {
  console.log(`${member.firstName} bought one ${vm.selectedItem.name}`);
}
</script>
