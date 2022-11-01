import React from 'react';

const pkg = require("@/root/package.json");

export default function Footer({ hide, className, ...props }) {
    return <>
        {!hide && <footer className={`${className}`}>
        </footer>}
    </>;
}