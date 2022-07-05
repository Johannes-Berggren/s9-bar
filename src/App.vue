<script setup lang="ts">
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { onMounted, ref } from "vue";

const firebaseConfig = {
  apiKey: "AIzaSyDcRk89s5vl4ihZ1J_cO0e6AOMDMIkXIz0",
  authDomain: "s9bar-54d46.firebaseapp.com",
  projectId: "s9bar-54d46",
  storageBucket: "s9bar-54d46.appspot.com",
  messagingSenderId: "815180929686",
  appId: "1:815180929686:web:ac9bdb834bf375220540b7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const items = ref<Record<string, unknown>[]>([]);
const members = ref<Record<string, unknown>[]>([]);

onMounted(async () => {
  const itemsQuery = query(collection(db, "items"));
  const itemsSnapshot = await getDocs(itemsQuery);

  itemsSnapshot.forEach((s) => {
    items.value.push(s.data());
  });

  const membersQuery = query(collection(db, "members"));
  const membersSnapshot = await getDocs(membersQuery);

  membersSnapshot.forEach((s) => {
    members.value.push(s.data());
  });
});

</script>

<template>
  <header>
    <img alt="S9 Logo" class="logo" src="./assets/logo.png" width="125" height="125" />
  </header>

  <main>
    <h4>Items</h4>
    <pre style="margin-bottom: 50px">{{ items }}</pre>

    <h4>Members</h4>
    <pre>{{ members }}</pre>
  </main>
</template>

<style>
@import './assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>
