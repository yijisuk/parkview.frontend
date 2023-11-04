import React, { useEffect, useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    View,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Text,
} from "react-native";
import { FAB } from "react-native-elements";
import { AutoDragSortableView } from "react-native-drag-sort";
import { BACKEND_ADDRESS } from "@env";
import { useNavigation } from "@react-navigation/native";
import supabase from "../../../config/supabase";
import axios from "axios";

const { width } = Dimensions.get("window");
const parentWidth = width;
const childrenWidth = width - 20;
const childrenHeight = 48;

export default function PreferencesSetupView() {
    const [displayData, setDisplayData] = useState([
        { key: "weather", text: "Fits the weather" },
        { key: "availability", text: "More available slots" },
        { key: "hourlyRate", text: "Lower hourly rates" },
    ]);
    const [preferenceData, setPreferenceData] = useState({
        weather: 1,
        availability: 2,
        hourlyRate: 3,
    });
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser(user);
            } else {
                Alert.alert("Error Accessing User Data");
            }
        });
    }, []);

    useEffect(() => {
        if (user) {
            axios
                .get(`${BACKEND_ADDRESS}/getPreference`, {
                    params: {
                        id: user.id,
                    },
                })
                .then((response) => {
                    // Make sure to check if the data exists and is not empty
                    if (
                        response.data &&
                        Object.keys(response.data).length > 0
                    ) {
                        // console.log("Retrieved user preference", response.data)
                        setPreferenceData(response.data);
                    }
                })
                .catch((error) => {
                    console.log(
                        `Error while retrieving user preference: ${error.message}`
                    );
                });
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            handlePreferencesComplete();
        }
    }, [user, preferenceData]);

    const navigation = useNavigation();

    const handlePreferencesComplete = async () => {
        // Post directly using the current state
        try {
            const response = await axios.post(
                `${BACKEND_ADDRESS}/addPreference`,
                {
                    id: user.id,
                    preference: preferenceData,
                }
            );
            console.log("Updated preference on server", response.data);
            // Uncomment the next line to navigate back to Home after a successful post
            // navigation.navigate('Home');
        } catch (error) {
            console.log(
                `Error while updating user preference: ${error.message}`
            );
            // An alert or banner can be added here to handle the error
        }
    };

    const handleItemClick = (index) => {
        const key = displayData[index].key;
        let newPreferenceData = { ...preferenceData };

        if (newPreferenceData[key] !== 0) {
            // When disabling, we need to decrement the rank of higher preferences
            const oldRank = newPreferenceData[key];
            newPreferenceData[key] = 0;
            Object.keys(newPreferenceData).forEach((k) => {
                if (newPreferenceData[k] > oldRank) {
                    newPreferenceData[k]--;
                }
            });
        } else {
            // Assign the next highest rank
            const existingRanks = Object.values(newPreferenceData).filter(
                (rank) => rank !== 0
            );
            const maxRank =
                existingRanks.length > 0 ? Math.max(...existingRanks) : 0;
            newPreferenceData[key] = maxRank + 1;
        }

        // Update the state with the new preference data
        setPreferenceData(newPreferenceData);
    };

    const renderPreferenceItem = (item, index) => {
        const ranking = preferenceData[item.key];
        return (
            <View
                style={ranking === 0 ? styles.item_disabled : styles.item}
                key={item.key}
            >
                <Text style={styles.item_text}>{item.text}</Text>
                <View style={styles.item_icon_swipe}>
                    {ranking !== 0 && <Text>{ranking}</Text>}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.header_title}>Preferences</Text>
                <Text style={styles.header_subtitle}>
                    Which parking locations would you prefer?
                </Text>
            </View>

            <AutoDragSortableView
                dataSource={displayData}
                parentWidth={parentWidth}
                childrenWidth={childrenWidth}
                marginChildrenBottom={10}
                marginChildrenRight={10}
                marginChildrenLeft={10}
                marginChildrenTop={10}
                childrenHeight={childrenHeight}
                onClickItem={(data, item, index) => handleItemClick(index)}
                onDataChange={(data) => {
                    // Reordering logic should go here if needed
                }}
                renderItem={(item, index) =>
                    renderPreferenceItem(displayData[index], index)
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
    },
    header: {
        height: 80,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },
    header_title: {
        color: "#333",
        fontSize: 24,
        fontWeight: "bold",
        width: childrenWidth,
        marginBottom: 10,
    },
    header_subtitle: {
        color: "#333",
        fontSize: 20,
        fontWeight: "bold",
        width: childrenWidth,
        marginBottom: 20,
    },
    item: {
        width: childrenWidth,
        height: childrenHeight,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#2ecc71",
        borderRadius: 4,
    },
    item_icon_swipe: {
        width: childrenHeight - 10,
        height: childrenHeight - 10,
        backgroundColor: "#fff",
        borderRadius: (childrenHeight - 10) / 2,
        marginRight: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    item_text: {
        color: "#fff",
        fontSize: 20,
        marginLeft: 20,
        fontWeight: "bold",
    },
    item_disabled: {
        width: childrenWidth,
        height: childrenHeight,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#d3d3d3",
        borderRadius: 4,
    },
});
