import React, { useEffect, useState, useLayoutEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    PermissionsAndroid,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";


export default function HomeView({ navigation }) {
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        getLocationAsync();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    async function getLocationAsync() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            alert("Permission to access location was denied");
            return;
        }

        try {
            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        } catch (error) {
            console.error("Error getting location: ", error);
        }
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={userLocation}
                showsUserLocation={true}
            >
                {userLocation && (
                    <Marker coordinate={userLocation} title="You are here" />
                )}
            </MapView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.speechButton}
                    onPress={() =>
                        navigation.navigate("Search", { type: "Speech" })
                    }
                >
                    <Text style={styles.speechText}>Speech</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() =>
                        navigation.navigate("Search", { type: "Text" })
                    }
                >
                    <Text style={styles.searchIcon}>🔍</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: -1,
    },
    map: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: [{ translateX: -125 }],
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5,
    },
    searchButton: {
        marginLeft: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    searchIcon: {
        fontSize: 24,
    },
    speechButton: {
        width: 150,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#2196F3",
        alignItems: "center",
        justifyContent: "center",
    },
    speechText: {
        color: "white",
        fontWeight: "bold",
    },
});
