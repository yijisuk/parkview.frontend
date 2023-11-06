import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    Alert
} from "react-native";
import { Button, Icon } from "react-native-elements";
import { commonStyles, commonToolkit } from "../styles/commonStyles";
import navigationViewStyles from "../styles/viewStyles/navigationViewStyles";

import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

import supabase from "../../config/supabase";
import { BACKEND_ADDRESS } from "@env";


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
        <View style={commonStyles.container}>
            <MapView
                ref={mapRef}
                style={commonStyles.map}
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
                            strokeColor={commonToolkit.mainThemeColor}
                        />
                        <Marker
                            coordinate={destinationCoords}
                            title={destinationAddress}
                        />
                    </>
                )}
            </MapView>
            {destinationAddress && (
                <View
                    style={navigationViewStyles.inner}
                    title={destinationAddress}
                >
                    {isLoading ? (
                        <ActivityIndicator
                            size="large"
                            color={commonToolkit.mainThemeColor}
                        />
                    ) : (
                        <>
                            <Text style={commonStyles.fieldText3}>
                                {destinationAddress}
                            </Text>
                            {errorExists ? (
                                <Text style={commonStyles.fieldText3}>
                                    An error has occurred.
                                </Text>
                            ) : (
                                <>
                                    <Text style={commonStyles.fieldText3}>
                                        {parkingLotAddress}
                                    </Text>
                                    <Text style={commonStyles.fieldText3}>
                                        Estimated Time: {estTime}
                                    </Text>
                                    <Text style={commonStyles.fieldText3}>
                                        {" "}
                                        Estimated Distance: {estDist}
                                    </Text>
                                    <View
                                        style={
                                            navigationViewStyles.buttonContainer
                                        }
                                    >
                                        <TouchableOpacity
                                            style={navigationViewStyles.button}
                                            onPress={() =>
                                                redirectToNavigation()
                                            }
                                        >
                                            <Text
                                                style={commonStyles.buttonText3}
                                            >
                                                Navigate
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={navigationViewStyles.button}
                                            onPress={() =>
                                                isFavourite
                                                    ? deleteFromFavourites()
                                                    : addToFavourites()
                                            }
                                        >
                                            <Icon
                                                name={
                                                    isFavourite
                                                        ? "star"
                                                        : "star-border"
                                                }
                                                color="white"
                                            />
                                        </TouchableOpacity>
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