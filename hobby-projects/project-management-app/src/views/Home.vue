<script setup lang="ts">
import { useCounterStore } from "../store/counter";

const counter = useCounterStore();
</script>

<template>
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the homepage!</p>
    </div>
  </template>

<style lang="scss">
.container {
    text-align: center;
    padding: 20px;
    button {
        margin: 5px;
        padding: 10px;
        background: #42b983;
        color: white;
        border: none;
        cursor: pointer;
    }
}
</style>
