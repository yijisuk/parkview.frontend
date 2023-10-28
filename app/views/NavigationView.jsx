import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    PermissionsAndroid,
    Linking,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { Button, FAB, Card } from "react-native-elements";
import { BACKEND_ADDRESS } from "@env";
import axios from "axios";


export default function NavigationView() {

    const [userLocationCoords, setUserLocationCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [routeCoords, setRouteCoords] = useState(null);
    const [estTime, setEstTime] = useState("");
    const [estDist, setEstDist] = useState("");
    const mapRef = useRef(null);

    const carparkName = "National University of Singapore";

    useEffect(() => {
        getNavigation(carparkName);
    }, []);


    async function getNavigation(destinationAddress) {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            alert("Permission to access location was denied");
            return;
        }

        try {
            let currentLocation = await Location.getCurrentPositionAsync();

            const originLat = currentLocation.coords.latitude;
            const originLon = currentLocation.coords.longitude;

            setUserLocationCoords({
                latitude: originLat,
                longitude: originLon,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

            // Fetch destination coordinates
            const destinationUrl = `${BACKEND_ADDRESS}/getCoordinates?address=${encodeURIComponent(
                destinationAddress
            )}`;
            const destinationResponse = await axios.get(destinationUrl);
            const destinationData = destinationResponse.data;

            if (destinationData) { 
                setDestinationCoords(destinationData); 
            }

            // Note: Ideally, you should make sure destinationData actually contains latitude and longitude
            const destinationLat = destinationData.latitude;
            const destinationLon = destinationData.longitude;

            // Fetch routes
            const routesUrl = `${BACKEND_ADDRESS}/getRoutes?originLat=${originLat}&originLon=${originLon}&destinationLat=${destinationLat}&destinationLon=${destinationLon}`;
            const routesResponse = await axios.get(routesUrl);
            const routesData = routesResponse.data;

            if (routesData) {
                setRouteCoords(routesData.coordArray);
                setEstDist(routesData.estDist);
                setEstTime(routesData.estTime);
            }

        } catch (error) {
            console.error(`Error getting navigation details: ${error.message}`);
        }
    }

    // Zoom to fit the route on screen
    function fitScreen() {
        if (routeCoords) {
            mapRef.current.fitToCoordinates(routeCoords);
        }
    }

    // Redirects the user to the external navigation app
    function outNavigation() {
        
        const scheme = Platform.select({
            ios: "maps:0,0//?",
            android: "google.navigation:q=",
        });

        const latLng = `${destinationCoords.latitude},${destinationCoords.longitude}`;

        const url = Platform.select({
            ios: `${scheme}saddr=${userLocationCoords.latitude},${userLocationCoords.longitude}&daddr=${latLng}&dirfgl=d`,
            android: `${scheme}${latLng}&mode=d`,
        });

        Linking.openURL(url);
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                region={userLocationCoords}
                toolbarEnabled={false}
                showsUserLocation={true}
                showsMyLocationButton={false}
                followUserLocation={true}
                onLayout={() => fitScreen()}
            >
                <Polyline
                    coordinates={routeCoords == null ? [] : routeCoords}
                    strokeWidth={5}
                    strokeColor="#007AFF"
                />
                <Marker coordinate={destinationCoords} title={carparkName} />
            </MapView>
            <FAB
                icon={{ name: "place" }}
                color="red"
                style={styles.fitScreenStyle}
                onPress={() => fitScreen()}
            />
            <View style={styles.inner} title={carparkName}>
                <Text>{carparkName}</Text>
                <Text>Estimated Time: {estTime}</Text>
                <Text>Estimated Distance: {estDist}</Text>
                <View style={styles.buttonContainer}>
                    <Button
                        style={styles.button}
                        title="Cancel"
                        onPress={() => {}}
                    />
                    <Button
                        style={styles.button}
                        title="Navigate"
                        onPress={() => outNavigation()}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        flex: 1,
    },
    map: {
        flex: 3,
    },
    buttonContainer: {
        flexDirection: "row",
    },
    inner: {
        flex: 1,
        height: "20%",
        width: "100%",
        backgroundColor: "#f0f8ff",
    },
    fitScreenStyle: {
        position: "absolute",
        left: "80%",
        bottom: "28%",
    },
});