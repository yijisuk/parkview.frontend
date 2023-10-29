import React, { useState } from "react";
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "@env";


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
        navigation.navigate("Navigation", {
            destinationAddress: searchAddress,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <GooglePlacesAutocomplete
                    placeholder="Search Location"
                    onPress={(data, details = null) => {
                        setSearchAddress(data.description);
                    }}
                    query={{
                        key: GOOGLE_API_KEY,
                        language: "en",
                        components: "country:sg",
                    }}
                    enablePoweredByContainer={false}
                />
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={handleSearch}
                >
                    <MaterialIcons name="search" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.get("window").width,
        paddingHorizontal: 10,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#ddd",
        borderRadius: 4,
        padding: 10,
    },
    iconContainer: {
        padding: 10,
    },
});
