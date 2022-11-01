import Error from "next/error";

export default function MyError({ statusCode, hasGetInitialPropsRun }) {
    if (!hasGetInitialPropsRun && typeof window === "undefined") {
        return <Error statusCode={statusCode} />;
    }

    return <p>An error occurred on server</p>;
}