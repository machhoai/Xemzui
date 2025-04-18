import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import WelcomeLoad from "../components/WelcomeLoad";

export default function Home() {
    return (
        <>
            <WelcomeLoad />
            <h1>Home page</h1>
        </>
    );
}