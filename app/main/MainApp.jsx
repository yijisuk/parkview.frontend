import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { commonStyles, commonToolkit } from "../styles/commonStyles";

import HomeView from "../views/HomeView";
import SearchView from "../views/SearchView";
import FavoritesView from "../views/FavoritesView";
import SettingsView from "../views/SettingsView";
import NavigationView from "../views/NavigationView";

const Tab = createBottomTabNavigator();

function NavigationBar() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? "home-filled" : "home-filled";
                    } else if (route.name === "Search") {
                        iconName = focused ? "search" : "search";
                    } else if (route.name === "Navigation") {
                        iconName = focused ? "navigation" : "navigation";
                    } else if (route.name === "Favorites") {
                        iconName = focused ? "star" : "star";
                    } else if (route.name === "Settings") {
                        iconName = focused ? "settings" : "settings";
                    }

                    // Return the MaterialIcons component
                    return (
                        <MaterialIcons
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    );
                },
                tabBarActiveTintColor: commonToolkit.mainThemeColor,
                tabBarInactiveTintColor: commonToolkit.buttonColor,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeView}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Search"
                component={SearchView}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Navigation"
                component={NavigationView}
                initialParams={{ destinationAddress: null }}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Favorites"
                component={FavoritesView}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsView}
                options={{ headerShown: false }}
            />
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
