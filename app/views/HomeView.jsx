import React, { useEffect, useState, useLayoutEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { commonStyles } from "../styles/commonStyles";
import homeViewStyles from "../styles/viewStyles/homeViewStyles";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

import { BACKEND_ADDRESS } from "@env";


export default function HomeView({ navigation }) {
    const [userLocation, setUserLocation] = useState(null);
    const [carParks, setCarParks] = useState([]);

    useEffect(() => {
        getLocationAsync();
    }, []);

    useEffect(() => {
        const fetchCarParks = async () => {
            if (userLocation) {
                try {
                    const carParksResponse = await axios.get(
                        `${BACKEND_ADDRESS}/getNearbyParkingSlots`,
                        {
                            params: {
                                latitude: userLocation.latitude,
                                longitude: userLocation.longitude,
                            },
                        }
                    );

                    const carParksData = carParksResponse.data;

                    if (carParksData.length > 0) {
                        setCarParks(carParksData);
                    } else {
                        console.log("No nearby carparks found");
                    }
                } catch (error) {
                    console.log(
                        `Error getting nearby carparks on HomeView: ${error.message}`
                    );
                }
            }
        };

        fetchCarParks();
    }, [userLocation]);

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
        <View style={commonStyles.container}>
            <MapView
                style={commonStyles.map}
                region={userLocation}
                showsUserLocation={true}
            >
                {userLocation && (
                    <Marker coordinate={userLocation} title="You are here" />
                )}

                {carParks.map((carpark, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: carpark.latitude,
                            longitude: carpark.longitude,
                        }}
                        title={`Available Lots: ${carpark.availableLots}`}
                        description={carpark.development}
                    />
                ))}
            </MapView>

            <View style={homeViewStyles.buttonContainer}>
                <TouchableOpacity
                    style={homeViewStyles.speechSearchButton}
                    onPress={() =>
                        navigation.navigate("Search", { type: "Speech" })
                    }
                >
                    <Text style={commonStyles.buttonText2}>Ask DOM</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={homeViewStyles.searchButton}
                    onPress={() =>
                        navigation.navigate("Search", { type: "Text" })
                    }
                >
                    <Text style={homeViewStyles.searchIcon}>🔍</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
