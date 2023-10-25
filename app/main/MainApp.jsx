import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeView from "../views/HomeView";
import SearchView from "../views/SearchView";
import FavoritesView from "../views/FavoritesView";
import SettingsView from "../views/SettingsView";
import DummyView from "../views/DummyView";


const Tab = createBottomTabNavigator();

function NavigationBar() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeView} />
            <Tab.Screen name="Search" component={SearchView} />
            <Tab.Screen name="Favorites" component={FavoritesView} />
            <Tab.Screen name="Settings" component={SettingsView} />
        </Tab.Navigator>
    );
}

export default function MainApp() {
    return (
        <NavigationContainer independent={true}>
            <NavigationBar />
        </NavigationContainer>
    );
}