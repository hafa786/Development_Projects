<script setup lang="ts">
import { ref } from "vue";
const isOpen = ref(false);
const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
];

const toggleMenu = () => {
    isOpen.value = !isOpen.value;
};
</script>

<template>
    <div class="header">
        <div class="logo">
            <img src="/images/vue.svg" />
        </div>
        <div class="menu">
            <div class="menu-item">Features</div>
            <div class="menu-item">Solutions</div>
            <div class="menu-item">Product guide</div>
            <div class="menu-item">Pricing</div>
            <div class="menu-item">Template</div>
        </div>
        <div class="info">
            <div class="get-free">
                <button class="primary-button filled">Get for free</button>
            </div>

            <a class="link-signin">Sign in</a>
        </div>
    </div>
</template>

<style scoped>
.header {
    /* min-height: 72px;
    width: 100%;
    display: flex;
    background-color: #fff;
    padding: 0 32px; */
    display: flex;
    width: 80%;
    margin: 0 auto;
}
.logo {
    width: 5%;
}
.logo > img {
    width: 32px;
    height: 48px;
    color: #42b883;
}
.menu {
    display: flex;
    width: 60%;
}
.menu > .menu-item {
    color: #42b883;
    padding: 16px;
    font-size: 16px;
    line-height: 16px;
    font-weight: 400;
}
.info {
    display: flex;
}
.info > .get-free {
    padding: 8px 0;
    font-size: 16px;
    line-height: 16px;
    font-weight: 400;
}
.info > .link-signin {
    color: #42b883;
    padding: 16px;
    font-size: 16px;
    line-height: 16px;
    font-weight: 400;
}
.welcome {
    height: 100px;
}
.welcome > p {
    font-family: "Playfair Display", serif;
    color: #42b883;
    font-size: 32px;
    font-weight: 500;
}

.primary-button {
    border-radius: 8px;
    border-style: none;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-block;
    font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    height: 40px;
    line-height: 20px;
    list-style: none;
    margin: 0 32px;
    outline: none;
    padding: 10px 16px;
    position: relative;
    text-align: center;
    text-decoration: none;
    transition: color 100ms;
    vertical-align: baseline;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
}
.filled {
    background-color: #42b883;
    color: #ffffff;
}

.unfilled {
    color: #42b883;
    background-color: #ffffff;
}
link-signin .primary-button:hover,
.primary-button:focus {
    background-color: #fff;
    color: #42b883;
}
</style>
