<template>
  <v-container>
    <v-row align="center" class="mb-4">
      <h2 class="mr-4 text-white">Bar items</h2>

      <v-btn color="#F269D4" @click="vm.addItemDialogVisible = true">
        <b style="color: white">New item</b>
      </v-btn>
    </v-row>

    <v-progress-circular v-if="vm.loading" :loading="vm.loading" height="100" color="white" indeterminate />
    <div v-else>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <b>Items with inventory</b>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-expansion-panels variant="popout">
              <v-expansion-panel v-for="item in vm.activeItems" :key="item.ID" cols="4" elevation="0">
                <v-expansion-panel-title>
                  <b class="text-left">{{ item.brandName }}</b>
                  <b class="ml-4 text-left">{{ item.name }}</b>
                  <span class="ml-4 text-grey">{{ item.type }}</span>
                  <v-spacer />
                  <span class="mr-4 text-grey-darken-3">{{ item.price }} kr.</span>
                  {{ item.currentInventory }} left
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <edit-bar-item :item="item" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <b>Items without inventory</b>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-expansion-panels variant="popout">
              <v-expansion-panel v-for="item in vm.inactiveItems" :key="item.ID" cols="4" elevation="0">
                <v-expansion-panel-title>
                  <b class="text-left">{{ item.brandName }}</b>
                  <b class="ml-4 text-left">{{ item.name }}</b>
                  <span class="ml-4 text-grey">{{ item.type }}</span>
                  <v-spacer />
                  <span class="mr-4 text-grey-darken-3">{{ item.price }} kr.</span>
                  {{ item.currentInventory }} left
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <edit-bar-item :item="item" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <v-divider class="my-12" />

    <!-- CLUB MEMBER LIST -->
    <v-row align="center" class="mb-4">
      <h2 class="mr-4 text-white">Club members</h2>
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

          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="member.credit >= 0"
              color="error"
              @click="transferToInvoice(member.ID)"
              variant="elevated"
              size="small"
            >
              Transfer credit to invoice
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-12" />

    <!-- ADD ITEM DIALOG -->
    <v-dialog v-model="vm.addItemDialogVisible">
      <v-card width="600" height="600">
        <edit-bar-item :item="vm.newItem" />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import EditBarItem from "@/components/EditBarItem.vue";
import type Item from "@/interfaces/Item";
import type Member from "@/interfaces/Member";
import type Month from "@/interfaces/Month";
import type Transaction from "@/interfaces/Transaction";
import { getItems, getMembers, getSales, transferCreditToInvoice } from "@/services/api";
import { inject, onMounted, provide, reactive } from "vue";

const loading = inject<(val: boolean) => void>("loading");

const vm = reactive({
  addItemDialogVisible: false,
  activeItems: [] as Item[],
  inactiveItems: [] as Item[],
  memberInfoDialogVisible: false,
  newItem: {
    ID: 0,
    brandName: "",
    currentInventory: 0,
    imageURL: "",
    name: "",
    price: 0,
    type: "",
  } as Item,
  loading: true,
  members: [] as Member[],
  transactions: [] as Transaction[],
  sales: [] as Month[],
});

onMounted(async () => {
  vm.members = await getMembers();
  await fetchItems();

  const _sales = await getSales();
  vm.sales = _sales.sort((a, b) => {
    const idA = parseInt(a.ID.split("-")[1]) * 12 + parseInt(a.ID.split("-")[0]);
    const idB = parseInt(b.ID.split("-")[1]) * 12 + parseInt(b.ID.split("-")[0]);
    return idA > idB ? -1 : idA < idB ? 1 : 0;
  });

  vm.loading = false;
});

async function fetchItems(): Promise<void> {
  vm.addItemDialogVisible = false;
  const _items = await getItems();
  vm.activeItems = _items.filter(item => item.currentInventory).sort((a, b) => a.name.localeCompare(b.name));
  vm.inactiveItems = _items.filter(item => !item.currentInventory).sort((a, b) => a.name.localeCompare(b.name));
}

async function transferToInvoice(memberID: number) {
  loading && loading(true);
  await transferCreditToInvoice(memberID);
  vm.members = await getMembers();
  loading && loading(false);
}

provide<() => Promise<void>>("fetchItems", fetchItems);
</script>
