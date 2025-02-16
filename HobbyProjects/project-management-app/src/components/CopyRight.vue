<script setup lang="ts">
const year = new Date().getFullYear();
const links = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Services", url: "/services" },
    { name: "Contact", url: "/contact" },
];
const socialLinks = [
    { name: "Twitter", url: "https://twitter.com", icon: "🐦" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "🔗" },
    { name: "GitHub", url: "https://github.com", icon: "🐙" },
];
</script>

<template>
    <div class="copyright-container">
        <div class="copyright">
            <div data-testid="footer-copyright" class="">
                Copyright ©
                <!-- -->2025<!-- -->
                MIT Liecence
            </div>
            <div class="copyright-links">
                <div class="link-wrapper">
                    <a
                        href="/legal/privacy-policy"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Privacy policy</span></a
                    >
                </div>
                <div class="link-wrapper atl-policy-link-container" style="">
                    <a
                        class=""
                        href="/legal/privacy-policy#additional-disclosures-for-ca-residents"
                        target=""
                        rel=""
                        data-event="clicked"
                        data-event-component="linkButton"
                        style=""
                        ><span
                            class="atl-policy-link-text"
                            aria-label="Your Privacy Choices"
                            style=""
                            >Your Privacy Choices</span
                        ></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="/legal/cloud-terms-of-service"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Terms</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="/legal/impressum"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Impressum</span></a
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.copyright-container {
    display: flex;
    width: 80%;
    margin: 0 auto;
}
.copyright {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 16px;
}
.footer-copyright {
    display: flex;
    justify-content: center;
    align-items: center;
}
.copyright-links {
    display: flex;
    justify-content: center;
    align-items: center;
}
.copyright-links > .link-wrapper > a {
    margin: 0 8px;
}
</style>
