<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
    <div>
        <Header />
        <Footer />
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
