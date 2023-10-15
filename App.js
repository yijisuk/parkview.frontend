import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeView } from "./screens/home";
import { SearchView } from "./screens/search";
import { FavoritesView } from "./screens/favorites";
import { SettingsView } from "./screens/settings";


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

export default function App() {
    return (
        <NavigationContainer>
            <NavigationBar />
        </NavigationContainer>
    );
}
