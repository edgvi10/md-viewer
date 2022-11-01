import { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";

const pkg = require("@/root/package.json");

import NProgress from "nprogress";

import "@/root/styles/global.css";

router.onRouteChangeStart = () => NProgress.start();
router.onRouteChangeComplete = () => NProgress.done();
router.onRouteChangeError = () => NProgress.done();

export default function MyApp({ Component, pageProps, appProps }) {
    return <>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

            <title>{pkg.title}</title>

            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        </Head>
        <Component {...appProps} {...pageProps} />
    </>
}