import Head from 'next/head';
import React from 'react';

const pkg = require("@/root/package.json");

export default function Header({ title, hide, className, loggedIn, ...props }) {
    return <>
        <Head>
            <title>{title || pkg.description}</title>
        </Head>
        {!hide && <header className={`navbar navbar-light bg-light ${className}`}>
        </header>}
    </>;
}