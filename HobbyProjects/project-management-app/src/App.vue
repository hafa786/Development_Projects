<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Welcome from "./components/Welcome.vue";
import Clients from "./components/Clients.vue";
import MeetTeam from "./components/MeetTeam.vue";
import CopyRight from "./components/CopyRight.vue";
</script>

<template>
    <div>
        <Header />
        <Welcome />
        <Clients />
        <MeetTeam />
        <Footer />
        <CopyRight />
    </div>
</template>

<style lang="scss">
nav {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
}
</style>
