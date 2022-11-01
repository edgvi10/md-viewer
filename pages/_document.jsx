import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)

        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&family=Rubik:wght@400;600&display=swap" rel="stylesheet" />

                    <link href="/plugins/fontawesome/css/fontawesome.min.css" rel="stylesheet" />
                    <link href="/plugins/fontawesome/css/duotone.min.css" rel="stylesheet" />
                    <link href="/plugins/fontawesome/css/brands.min.css" rel="stylesheet" />

                    <link href={`/assets/github-md.css`} rel="stylesheet" />
                    {/* <link href={`/plugins/bootstrap/bootstrap.min.css`} rel="stylesheet" /> */}
                    {/* <script src={`/plugins/bootstrap/bootstrap.bundle.min.js`}></script> */}

                    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.11.0/styles/default.min.css" />
                    <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.11.0/highlight.min.js"></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument;