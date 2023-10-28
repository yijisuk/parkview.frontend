import React from "react";
import {
    View,
    TextInput,
    FlatList,
    Text,
    Button,
    StyleSheet,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";


export default function TextSearchView() {

    const data = [
        // {
        //     id: "1",
        //     location: "161 Tampines St 99",
        //     available: 55,
        //     distance: "<0.5km",
        // },
        // {
        //     id: "2",
        //     location: "169 Tampines St 92",
        //     available: 12,
        //     distance: "~0.7km",
        // },
        // {
        //     id: "3",
        //     location: "Tampines Walk 54",
        //     available: 36,
        //     distance: "~0.8km",
        // },
        // {
        //     id: "4",
        //     location: "Tampines One (Mall)",
        //     available: 76,
        //     distance: "~1.1km",
        // },
    ];
    
    const navigation = useNavigation();
    const [searchAddress, setSearchAddress] = useState("");

    const handleSearch = () => {
        // Navigate to another view and pass the searchText
        navigation.navigate("Navigation", {
            destinationAddress: searchAddress,
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search Location"
                value={searchAddress}
                onChangeText={(text) => setSearchAddress(text)}
            />
            <Button title="Search" onPress={handleSearch} />
            {/* <FlatList
                data={data}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.locationText}>{item.location}</Text>
                        <Text style={styles.availableText}>
                            Available: {item.available}
                        </Text>
                        <Text style={styles.distanceText}>{item.distance}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.get("window").width,
        paddingHorizontal: 10,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 4,
        padding: 10,
        marginVertical: 10,
        width: "100%",
    },
    itemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingVertical: 10,
        flexDirection: "column",
    },
    locationText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    availableText: {
        marginTop: 5,
        fontSize: 14,
    },
    distanceText: {
        marginTop: 5,
        fontSize: 14,
        color: "gray",
    },
});
