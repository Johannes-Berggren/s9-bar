<template>
  <v-row>
    <v-col cols="2">
      <v-img :src="item.imageURL" />
    </v-col>

    <v-col cols="10">
      <v-row>
        <v-col>
          <v-text-field v-model="vm.newItem.name" label="Name" />
        </v-col>

        <v-col>
          <v-text-field
            v-model="vm.newItem.price"
            label="Price"
            prefix="kr."
            type="number"
          />
        </v-col>

        <v-col>
          <v-text-field
            v-model="vm.newItem.currentInventory"
            label="In the bar"
            type="number"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="vm.newItem.imageURL"
            label="Image URL"
          />
        </v-col>

        <v-col cols="12">
          <v-btn
            v-if="item.ID"
            color="primary"
            @click="update()"
            :loading="vm.loading"
            :disabled="!vm.newItem.name || !vm.newItem.price"
          >Update
          </v-btn>
          <v-btn
            v-else
            color="primary"
            @click="add()"
            :loading="vm.loading"
            :disabled="!vm.newItem.name || !vm.newItem.price || !vm.newItem.currentInventory"
          >Add
          </v-btn>
          <!--          <v-btn-->
          <!--            color="error"-->
          <!--            @click="del()"-->
          <!--            :loading="vm.loading"-->
          <!--          >Delete-->
          <!--          </v-btn>-->
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type Alert from "@/interfaces/Alert";
import type Item from "@/interfaces/Item";
import { addItem } from "@/config/firebase";
import { defineProps, inject, reactive } from "vue";
import { updateItem } from "@/services/api";

const displayAlert = inject<(alert: Alert) => void>("displayAlert");
const fetchItems = inject<() => Promise<void>>("fetchItems");
const loading = inject<(val: boolean) => void>("loading");

const props = defineProps<{
  item: Item
}>();

const vm = reactive({
  loading: false,
  newItem: {
    ID: props.item.ID,
    currentInventory: props.item.currentInventory || 0,
    imageURL: props.item.imageURL || "",
    name: props.item.name || "",
    price: props.item.price || 0,
    type: "",
  } as Item,
});

async function add(): Promise<void> {
  vm.loading = true;
  await addItem(vm.newItem);
  fetchItems && await fetchItems();
  vm.loading = false;
}

// async function del(): Promise<void> {
//   vm.loading = true;
//   await deleteItem(vm.newItem);
//   vm.loading = false;
// }

async function update(): Promise<void> {
  vm.loading = true;
  await updateItem(vm.newItem);
  fetchItems && await fetchItems();
  vm.loading = false;
}
</script>
