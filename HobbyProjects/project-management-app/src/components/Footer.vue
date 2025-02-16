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
    <div class="footer">
        <div class="container">
            <div class="box">
                <div class="heading">
                    <h3 class="" style="">About</h3>
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="/company"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Company</span></a
                    >
                </div>

                <div class="link-wrapper">
                    <a
                        class=""
                        href="/company/careers"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Careers</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="/company/events"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Events</span></a
                    >
                </div>

                <div class="link-wrapper">
                    <a
                        class=""
                        href="/blog"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Blogs</span></a
                    >
                </div>

                <div class="link-wrapper">
                    <a
                        class=""
                        href="https://investors.atlassian.com"
                        target="_blank"
                        rel="noreferrer"
                        style=""
                        ><span>Investor Relations</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="https://www.atlassianfoundation.org/"
                        target="_blank"
                        rel="noreferrer"
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Non-profit Organization</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="/company/contact"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Contact us</span></a
                    >
                </div>
            </div>
            <div class="box">
                <div class="heading">
                    <h3 class="" style="--_188070z: #101214">Products</h3>
                </div>

                <div class="link-wrapper">
                    <a class="" href="/rovo" target="" rel="" style=""><span>Rovo</span></a>
                </div>

                <div class="link-wrapper">
                    <a class="" href="/software/jira" target="" rel="" style=""><span>PMS</span></a>
                </div>

                <div class="link-wrapper">
                    <a class="" href="/software/jira/align" target="" rel="" style=""
                        ><span>PMS Align</span></a
                    >
                </div>

                <div class="link-wrapper">
                    <a class="" href="/software/jira/service-management" target="" rel="" style=""
                        ><span>PMS Service Management</span></a
                    >
                </div>

                <div class="link-wrapper">
                    <a
                        class=""
                        href="/software/confluence"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>PMS Docs</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="https://trello.com/home"
                        target="_blank"
                        rel="noreferrer"
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Trello</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="/software/bitbucket"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Bitbucket</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="/software"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span
                            >See all products<svg
                                width="11"
                                height="8"
                                viewBox="0 0 11 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                class="_18s81yyg _v564x7w3"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d=""
                                ></path></svg></span
                    ></a>
                </div>
            </div>
            <div class="box">
                <div class="heading">
                    <h3 class="" style="">Resources</h3>
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="https://support.atlassian.com/"
                        target="_blank"
                        rel="noreferrer"
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Technical support</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="/licensing/purchase-licensing"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Purchasing &amp; licensing</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="https://community.atlassian.com/"
                        target="_blank"
                        rel="noreferrer"
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>PMS Community</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="https://confluence.atlassian.com/kb"
                        target="_blank"
                        rel="noreferrer"
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Knowledge base</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="https://marketplace.atlassian.com/"
                        target="_blank"
                        rel="noreferrer"
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Marketplace</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="https://my.atlassian.com/products/index"
                        target="_blank"
                        rel="noreferrer"
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>My account</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="https://support.atlassian.com/contact/"
                        target="_blank"
                        rel="noreferrer"
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span
                            >Create support ticket<svg
                                width="11"
                                height="8"
                                viewBox="0 0 11 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                class="_18s81yyg _v564x7w3"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d=""
                                ></path></svg></span
                    ></a>
                </div>
            </div>
            <div class="box">
                <div class="heading">
                    <h3 class="" style="">Learn</h3>
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="/partners"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Partners</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="/university"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Training &amp; certification</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="https://confluence.atlassian.com/display/ALLDOC/Atlassian+Documentation"
                        target="_blank"
                        rel="noreferrer"
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Documentation</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="/developers"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Developer resources</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        class=""
                        href="/enterprise/services"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span>Enterprise services</span></a
                    >
                </div>
                <div class="link-wrapper">
                    <a
                        href="/resources"
                        target=""
                        rel=""
                        style="
                            --_1bmh097: #101214;
                            --_d4pjwz: #101214;
                            --_amadh5: #101214;
                            --_1k7apmj: #101214;
                        "
                        ><span
                            >See all resources<svg
                                width="11"
                                height="8"
                                viewBox="0 0 11 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                class="_18s81yyg _v564x7w3"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d=""
                                ></path></svg></span
                    ></a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.footer {
    /* font-family: Charlie Text;
    display: grid; */
    display: flex;
    width: 80%;
    margin: 0 auto;
}
.container {
    display: flex;
    width: 100%;
    padding: 0 32px;
}
.box {
    text-align: left;
    width: 33%;
}
.heading {
    color: #42b883;
}
.link-wrapper > a {
    color: #000;
}
.link-wrapper > a:hover {
    color: #42b883;
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
