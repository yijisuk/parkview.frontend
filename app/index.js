import "expo-router/entry";
import "react-native-url-polyfill/auto";
import { router } from "expo-router";
import supabase from "../config/supabase";
import React, { useEffect } from "react";
import { LogBox } from "react-native";
import AuthScreen from "./auth/AuthScreen";


export default function App() {

    LogBox.ignoreAllLogs();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                console.log("User found");
                router.replace("/main/MainApp");
            } else {
                console.log("No user");
            }
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                console.log("User found");
                router.replace("/main/MainApp");
            } else {
                console.log("No user");
                router.replace("/auth/AuthScreen")
            }
        });
    }, []);

    return <AuthScreen />;
}