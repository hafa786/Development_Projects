<script setup lang="ts">
import Footer from "./components/Footer.vue";
</script>
<template>
    <div>
        <div class="header"></div>
        <!-- <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view></router-view> -->
        <div class="footer">
            <footer />
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
nav {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
}
.header {
    background-image: url("/images/background.jpg");
    background-size: cover;
    background-position: center;
    min-height: 800px;
    margin-top: 0px;
}
.footer {
    min-height: 400px;
    margin-top: 0px;
}
</style>
