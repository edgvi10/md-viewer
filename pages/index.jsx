import Header from "@/root/components/ui/Header";
import Footer from "@/root/components/ui/Footer";
import { marked } from "marked";
import { useEffect, useState } from "react";

export default function Home({ ...props }) {
    const [content, setContent] = useState("");
    const contentInputHandler = ({ target }) => setContent(target.value || "");

    useEffect(() => {
        try {
            if (window && window.localStorage) {
                const localforage_content = window.localStorage.getItem("content");
                if (localforage_content) {
                    if (localforage_content.match(/^[a-zA-Z0-9+/]+={0,2}$/)) setContent(window.atob(localforage_content));
                    else setContent(localforage_content);
                }
            }

            document.querySelector("#content-editor").addEventListener("keydown", (e) => {
                if (e.key == "Tab") {
                    e.preventDefault();
                    document.execCommand("insertHTML", false, "    ");
                }
            });
        } catch (error) {
            console.error(error.message);
        }
    }, []);

    const highlightCode = () => {
        var pres = document.querySelectorAll("pre>code");
        for (var i = 0; i < pres.length; i++) {
            hljs.highlightBlock(pres[i]);
        }
    }
    useEffect(() => {
        try {
            if (window && window.localStorage) window.localStorage.setItem("content", window.btoa(content));
            highlightCode();
        } catch (error) {
            console.error(error.message);
        }
    }, [content]);

    return <main className="">
        <Header title={'Markdown PDF'} hide {...props} />
        <section className="main-container">
            <textarea id="content-editor" className="content-editor" value={content || ""} onChange={contentInputHandler} autoCapitalize="off" autoCorrect="off" spellCheck="false" autoFocus autoSave="true" placeholder="Markdown" autoComplete="off" />
            <div className="separator" />
            <div className="md-container markdown-body" dangerouslySetInnerHTML={
                { __html: marked(content) }
            } />
        </section>

        <Footer />
    </main>
}
