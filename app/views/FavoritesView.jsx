import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    ScrollView,
    RefreshControl,
    SafeAreaView,
    Alert,
} from "react-native";
import { Text, Button, ListItem, Icon } from "react-native-elements";
import { commonStyles, commonToolkit } from "../styles/commonStyles";
import favoritesViewStyles from "../styles/viewStyles/favoritesViewStyles";

import { useNavigation } from "@react-navigation/native";
import axios from "axios";

import supabase from "../../config/supabase";
import { BACKEND_ADDRESS } from "@env";

export default function FavoritesView() {
    const [user, setUser] = useState(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const [favLocations, setFavLocations] = useState([]);

    //inital load
    useEffect(() => {
        setRefreshing(true);
        supabase.auth
            .getUser()
            .then(({ data: { user } }) => {
                if (user) {
                    setUser(user);
                } else {
                    Alert.alert("Error Accessing User Data");
                    setRefreshing(false);
                }
            })
            .catch((error) => console.log(error));
    }, []);

    //This to run after the user location is available, if not would return an empty list
    useEffect(() => {
        if (user) {
            getFavLocation()
                .then(() => setRefreshing(false))
                .catch((error) => console.log(error));
        }
    }, [user]);

    //API call to GET /favouriteLocation
    async function getFavLocation() {
        setRefreshing(true);
        axios
            .get(
                `${BACKEND_ADDRESS}/getFavouriteLocation?id=${user.identities[0].id}`
            )
            .then((res) => {
                setFavLocations(res.data.data);
                setRefreshing(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //API call to DELETE /favouriteLocation
    async function deleteFavLocation(location) {
        axios
            .delete(
                `${BACKEND_ADDRESS}/deleteFavouriteLocation?id=${user.identities[0].id}&location=${location}`
            )
            .then((res) => {
                getFavLocation().catch((error) => {
                    console.log(error);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //**To change to point to API for recommendation -> then navigation
    const navigation = useNavigation();

    function handleSearch(location) {
        navigation.navigate("Navigation", {
            destinationAddress: location,
        });
    }

    return (
        <SafeAreaView style={favoritesViewStyles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={getFavLocation}
                    />
                }
            >
                {favLocations.length == 0 ? (
                    <Text style={favoritesViewStyles.placeholderText}>
                        You have no favourite location saved
                    </Text>
                ) : (
                    favLocations.map((location, i) => (
                        <LocationList
                            location={location}
                            handleSearch={() => handleSearch(location)}
                            deleteFavLocation={() =>
                                deleteFavLocation(location)
                            }
                            key={i}
                        />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const LocationList = ({ location, handleSearch, deleteFavLocation }) => {
    return (
        <ListItem.Swipeable
            onPress={handleSearch}
            leftContent={
                <Button
                    onPress={deleteFavLocation}
                    icon={{ name: "delete", color: commonToolkit.buttonColor }}
                    buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
                />
            }
            minSlideWidth={"10%"}
            onSwipeEnd={() => console.log("swipe")}
        >
            <Icon name="star" color={commonToolkit.mainThemeColor} />
            <ListItem.Content>
                <ListItem.Title>{location}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem.Swipeable>
    );
};
