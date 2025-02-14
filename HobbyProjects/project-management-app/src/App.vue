<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
    <div>
        <div class="header">
          <Header />
        </div>
        <div class="footer">
            <Footer />
        </div>
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
