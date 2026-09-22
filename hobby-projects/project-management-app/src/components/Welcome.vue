<template>
    <div class="welcome-container">
        <div class="sign-box">
            <h3>All great projects start with PMS</h3>
            <div class="work-email-signup">
                <b>Work email</b>
                <input clas="work-email" type="email" placeholder="you@workplace.com" />
                <i class="message"
                    >Find teammates, plus keep work and life separate by using your work email.</i
                >

                <button class="full-size-button filled">Sign up</button>
                <div class="line-breaker"></div>
                <div class="signup-with-thirsparty">
                    <img src="/images/google.png" />
                    <img src="/images/microsoft.png" />
                </div>
            </div>
        </div>
        <div class="slider-box">
            <img src="/images/background.jpg" />
        </div>
    </div>
</template>

<style scoped>
.welcome-container {
    display: flex;
    width: 80%;
    margin: 0 auto;
}
.sign-box {
    width: 50%;
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
.work-email-signup {
    display: inline-grid;
}
.work-email-signup > input {
    padding: 8px;
    border-radius: 4px;
    border-style: none;
    min-width: 120px;
    min-width: 120px;
}
.message {
    font-size: 12px;
    margin: 4px 0 16px 0;
}
.full-size-button {
    width: 120px;
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
    padding: 8px 16px;
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
.link-signin .full-size-button:hover,
.full-size-button:focus {
    background-color: #fff;
    color: #42b883;
}
.line-breaker {
    margin: 16px 8px;
    height: 0.5px;
    background-color: #000;
}
.signup-with-thirsparty {
    display: flex;
    justify-content: center;
    align-items: center;
}
.signup-with-thirsparty > img {
    width: 108px;
    height: 48px;
    padding: 8px 16px;
    cursor: pointer;
}
.slider-box {
    width: 50%;
}
.slider-box > img {
    width: 100%;
}
</style>
