<template>
    <div class="client-container">
        <center>
            <div class="sign-box">
                <h3>75% of Fortune 500 companies run on Jira</h3>
                <div class="clients">
                    <img src="/images/google.png" />
                    <img src="/images/microsoft.png" />
                    <img src="/images/vue.svg" />
                    <img src="/vite.svg" />
                    <img src="/images/logo.png" />
                    <img src="/images/background.jpg" />
                    <img src="/images/vue.svg" />
                </div>
            </div>
        </center>
    </div>
</template>

<style scoped>
.client-container {
    width: 80%;
    margin: 0 auto;
}
.sign-box {
    width: 100%;
}
.sign-box > h3 {
    font-family:
        "Charlie Display",
        -apple-system,
        "system-ui",
        "Segoe UI",
        Roboto,
        Oxygen,
        Ubuntu,
        "Fira Sans",
        "Droid Sans",
        "Helvetica Neue",
        sans-serif;
    font-size: 48px;
    font-weight: 800;
    line-height: 55.68px;
    color: #42b883;
}
.clients {
    display: flex;
    width: 50%;
    margin: 0 auto;
}
.clients > img {
    opacity: 0.5;
    width: 88px;
    height: 72px;
    border-radius: 62px;
    margin: 0 36px 0 0;
}
</style>
