<script setup lang="ts">
import { useCounterStore } from "../store/counter";

const counter = useCounterStore();
</script>

<template>
    <div class="container">
        <!-- <h1>Home Page</h1>
    <p>Counter: {{ counter.count }}</p>
    <button @click="counter.increment">Increment</button>
    <button @click="counter.decrement">Decrement</button>
    <router-link to="/about">Go to About</router-link> -->
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
