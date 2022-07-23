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
            prefix="ClubCoin"
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
          <v-btn
            v-if="item.ID"
            color="primary"
            @click="update()"
            :loading="vm.loading"
            :disabled="!vm.newItem.name || !vm.newItem.price || !vm.newItem.currentInventory"
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
          <v-btn
            v-if="item.ID"
            color="primary"
            @click="del()"
            :loading="vm.loading"
            :disabled="!vm.newItem.name || !vm.newItem.price || !vm.newItem.currentInventory"
          >Delete
          </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-col>
      <pre>{{ vm.newItem }}</pre>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { addItem, updateItem } from "@/config/firebase";
import type Item from "@/interfaces/Item";
import { defineProps, inject, reactive } from "vue";

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

const fetchItems = inject<() => Promise<void>>("fetchItems");

async function add(): Promise<void> {
  vm.loading = true;
  await addItem(vm.newItem);
  fetchItems && await fetchItems();
  vm.loading = false;
}

async function del(): Promise<void> {
  vm.loading = true;

  vm.loading = false;
}

async function update(): Promise<void> {
  vm.loading = true;
  await updateItem(vm.newItem);
  fetchItems && await fetchItems();
  vm.loading = false;
}
</script>
