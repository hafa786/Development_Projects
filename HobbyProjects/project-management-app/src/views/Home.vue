<script setup lang="ts">
import { useCounterStore } from "../store/counter";
import Welcome from "../components/Welcome.vue";
import Client from "../components/Clients.vue";
import MeetTeam from "../components/MeetTeam.vue";

const counter = useCounterStore();
</script>

<template>
    <div class="container">
        <Welcome />
        <Clients />
        <MeetTeam />
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
