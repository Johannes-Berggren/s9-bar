<template>
  <v-row>
    <v-col cols="6">
      <v-text-field v-model="vm.newItem.brandName" label="Brand name" />
    </v-col>

    <v-col cols="6">
      <v-text-field v-model="vm.newItem.name" label="Product name" />
    </v-col>

    <v-col cols="3">
      <v-text-field
        v-model="vm.newItem.price"
        label="Price"
        prefix="kr."
        type="number"
      />
    </v-col>

    <v-col cols="3">
      <v-text-field
        v-model="vm.newItem.externalPrice"
        label="External price"
        prefix="kr."
        type="number"
      />
    </v-col>


    <v-col cols="3">
      <v-text-field
        v-model="vm.newItem.currentInventory"
        label="In the bar"
        type="number"
      />
    </v-col>

    <v-col cols="3">
      <v-select
        v-model="vm.newItem.type"
        label="Type"
        :items="ItemTypes"
      />
    </v-col>

    <v-col cols="9">
      <v-text-field
        v-model="vm.newItem.imageURL"
        label="Image URL"
      />
    </v-col>

    <v-col cols="3">
      <v-img :src="item.imageURL" />
    </v-col>

    <v-col cols="12">
      <v-btn
        v-if="item.ID"
        color="#F269D4"
        @click="update()"
        :loading="vm.loading"
        :disabled="!vm.newItem.brandName || !vm.newItem.name || !vm.newItem.price || !vm.newItem.externalPrice"
        class="mr-2"
      >Update
      </v-btn>
      <v-btn
        v-else
        color="#F269D4"
        @click="add()"
        :loading="vm.loading"
        :disabled="!vm.newItem.name || !vm.newItem.price || !vm.newItem.externalPrice || !vm.newItem.currentInventory"
        class="mr-2"
      >Add
      </v-btn>
      <v-btn
        v-if="!item.archived"
        color="error"
        @click="archive()"
        :loading="vm.loading"
        class="mr-2"
      >Delete
      </v-btn>
<!--      <v-btn-->
<!--        v-if="item.archived"-->
<!--        color="success"-->
<!--        @click="unArchive()"-->
<!--        :loading="vm.loading"-->
<!--        class="mr-2"-->
<!--      >Un archive-->
<!--      </v-btn>-->
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type Alert from "@/interfaces/Alert";
import type Item from "@/interfaces/Item";
import { defineProps, inject, reactive } from "vue";
import { createItem, updateItem } from "@/services/api";
import ItemTypes from "@/config/item-types";

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
    archived: props.item.archived || false,
    brandName: props.item.brandName || "",
    currentInventory: props.item.currentInventory || 0,
    imageURL: props.item.imageURL || "",
    name: props.item.name || "",
    price: props.item.price || 0,
    externalPrice: props.item.externalPrice || 0,
    type: props.item.type || "",
  } as Item,
});

async function add(): Promise<void> {
  loading && loading(true);
  await createItem(vm.newItem);
  displayAlert && displayAlert({
    color: "success",
    message: "",
    title: "Updated!",
    visible: true,
  });
  fetchItems && await fetchItems();
  loading && loading(false);
}

async function archive(): Promise<void> {
  loading && loading(true);
  await updateItem({
    ...vm.newItem,
    currentInventory: 0,
    archived: true,
  });
  displayAlert && displayAlert({
    color: "success",
    message: "",
    title: "Deleted!",
    visible: true,
  });
  fetchItems && await fetchItems();
  loading && loading(false);
}

// async function unArchive(): Promise<void> {
//   loading && loading(true);
//   await updateItem({
//     ...vm.newItem,
//     archived: false,
//   });
//   displayAlert && displayAlert({
//     color: "success",
//     message: "",
//     title: "Archived!",
//     visible: true,
//   });
//   fetchItems && await fetchItems();
//   loading && loading(false);
// }

async function update(): Promise<void> {
  loading && loading(true);
  await updateItem(vm.newItem);
  displayAlert && displayAlert({
    color: "success",
    message: "",
    title: "Updated!",
    visible: true,
  });
  fetchItems && await fetchItems();
  loading && loading(false);
}
</script>
