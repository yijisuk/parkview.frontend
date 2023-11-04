import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    PermissionsAndroid,
    ActivityIndicator,
    Linking,
    Alert
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { Button, Icon } from "react-native-elements";
import { BACKEND_ADDRESS } from "@env";
import supabase from "../../config/supabase";
import axios from "axios";


export default function NavigationView({ route }) {
    const destinationAddress = route?.params?.destinationAddress || null;

    const [userLocationCoords, setUserLocationCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [parkingLotAddress, setParkingLotAddress] = useState(null);
    const [routeCoords, setRouteCoords] = useState(null);
    const [estTime, setEstTime] = useState("");
    const [estDist, setEstDist] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const [errorExists, setErrorExists] = useState(false);
    const mapRef = useRef(null);

    // Initial load for user information
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser(user);

                axios
                    .get(
                        `${BACKEND_ADDRESS}/checkFavouriteLocation?id=${user.identities[0].id}&location=${route.params.destinationAddress}`
                    )
                    .then((res) => {
                        setIsFavourite(res.data.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                Alert.alert("Error Accessing User Data");
            }
        });
    }, []);

    useEffect(() => {
        setUserLocationCoords(null);
        setDestinationCoords(null);
        setRouteCoords(null);
        setIsLoading(true);

        const recenterMap = async () => {
            let currentLocation = await Location.getCurrentPositionAsync();
            const originLat = currentLocation.coords.latitude;
            const originLon = currentLocation.coords.longitude;

            const newRegion = {
                latitude: originLat,
                longitude: originLon,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };

            setUserLocationCoords(newRegion);

            if (mapRef.current) {
                mapRef.current.animateToRegion(newRegion, 500);
            }
        };

        recenterMap();

        if (user && destinationAddress) {
            getDirections(destinationAddress).then(() => {
                setIsLoading(false);
                if (routeCoords && mapRef.current) {
                    mapRef.current.fitToCoordinates(routeCoords, {
                        edgePadding: {
                            top: 50,
                            right: 50,
                            bottom: 50,
                            left: 50,
                        },
                        animated: true,
                    });
                }
            });
        }
    }, [user, destinationAddress]);

    async function getDirections(destinationAddress) {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            alert("Permission to access location was denied");
            return;
        }

        let currentLocation;
        try {
            currentLocation = await Location.getCurrentPositionAsync();
        } catch (error) {
            setErrorExists(true);
            console.error(`Error getting current location: ${error.message}`);
            return;
        }

        if (!currentLocation || !currentLocation.coords) {
            setErrorExists(true);
            console.error("Invalid current location data.");
            return;
        }

        const originLat = currentLocation.coords.latitude;
        const originLon = currentLocation.coords.longitude;

        setUserLocationCoords({
            latitude: originLat,
            longitude: originLon,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });

        let destinationData = null;

        try {
            const destinationResponse = await axios.get(
                `${BACKEND_ADDRESS}/getParkingCoordinates`,
                {
                    params: {
                        userId: user.id,
                        originLat: originLat,
                        originLon: originLon,
                        destinationAddress: destinationAddress,
                    },
                }
            );

            destinationData = destinationResponse.data;

            // Your logic depending on destinationData goes here
            if (!destinationData) {
                setErrorExists(true);
                console.error("Invalid destination data.");
                return;
            }

        } catch (error) {
            setErrorExists(true);
            console.error(
                `Error fetching parking coordinates: ${error.message}`
            );
        }

        const latitude = destinationData.latitude;
        const longitude = destinationData.longitude;

        setParkingLotAddress(destinationData.development);
        setDestinationCoords({ latitude, longitude });

        try {
            const routesResponse = await axios.get(
                `${BACKEND_ADDRESS}/getRoutes`,
                {
                    params: {
                        originLat: originLat,
                        originLon: originLon,
                        destinationLat: latitude,
                        destinationLon: longitude,
                    },
                }
            );
            const routesData = routesResponse.data;

            if (routesData) {
                setRouteCoords(routesData.coordArray);
                setEstDist(routesData.estDist);
                setEstTime(routesData.estTime);
            }
        } catch (error) {
            setErrorExists(true);
            console.error(`Error fetching routes: ${error.message}`);
        }
    }


    // API call to POST /addFavouriteLocation
    // (to change console log to alert user using notification bar or other methods)
    function addFavourites() {
        axios
            .post(
                `${BACKEND_ADDRESS}/addFavouriteLocation?id=${user.identities[0].id}&location=${destinationAddress}`
            )
            .then((res) => {
                if (res.data.data) {
                    setIsFavourite(true);
                } else {
                    setIsFavourite(false);
                }
            })
            .catch((error) => {
                console.log("Error in adding favourite location");
                console.log(error);
            });
    }

    // API call to DELETE /deleteFavouriteLocation
    function deleteFromFavourites() {
        axios
            .delete(
                `${BACKEND_ADDRESS}/deleteFavouriteLocation?id=${user.identities[0].id}&location=${destinationAddress}`
            )
            .then((res) => {
                if (res.data.data) {
                    setIsFavourite(false);
                } else {
                    // Handle error case here if needed
                }
            })
            .catch((error) => {
                console.log("Error in deleting favourite location");
                console.log(error);
            });
    }

    // Zoom to fit the route on screen
    function fitScreen() {
        if (routeCoords) {
            mapRef.current.fitToCoordinates(routeCoords);
        }
    }

    // Redirects the user to the external navigation app
    function redirectToNavigation() {
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
                {destinationAddress && routeCoords && (
                    <>
                        <Polyline
                            coordinates={routeCoords}
                            strokeWidth={5}
                            strokeColor="#007AFF"
                        />
                        <Marker
                            coordinate={destinationCoords}
                            title={destinationAddress}
                        />
                    </>
                )}
            </MapView>
            {destinationAddress && (
                <View style={styles.inner} title={destinationAddress}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#007AFF" />
                    ) : (
                        <>
                            <Text>{destinationAddress}</Text>
                            {errorExists ? (
                                <Text>An error has occurred.</Text>
                            ) : (
                                <>
                                    <Text>{parkingLotAddress}</Text>
                                    <Text>Estimated Time: {estTime}</Text>
                                    <Text>Estimated Distance: {estDist}</Text>
                                    <View style={styles.buttonContainer}>
                                        <Button
                                            style={styles.button}
                                            title="Navigate"
                                            onPress={() =>
                                                redirectToNavigation()
                                            }
                                        />
                                        <Button
                                            style={styles.button}
                                            icon={
                                                <Icon
                                                    name={
                                                        isFavourite
                                                            ? "star"
                                                            : "star-border"
                                                    }
                                                    color="white"
                                                />
                                            }
                                            onPress={() =>
                                                isFavourite
                                                    ? deleteFromFavourites()
                                                    : addToFavourites()
                                            }
                                        />
                                    </View>
                                </>
                            )}
                        </>
                    )}
                </View>
            )}
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
        justifyContent: "center",
    },
    inner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        margin: 5,
    },
    fitScreenStyle: {
        position: "absolute",
        right: 20,
        bottom: 20,
    },
});