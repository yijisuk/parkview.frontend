import React, { useEffect, useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    View,
    StyleSheet,
    Alert,
    Text,
} from "react-native";
import { AutoDragSortableView } from "react-native-drag-sort";
import { commonStyles, commonToolkit } from "../../styles/commonStyles";
import preferencesSetupViewStyles from "../../styles/viewStyles/preferencesSetupViewStyles";

import axios from "axios";
import { useNavigation } from "@react-navigation/native";

import supabase from "../../../config/supabase";
import { BACKEND_ADDRESS } from "@env";


const { width } = Dimensions.get("window");
const parentWidth = width;
const childrenWidth = width - 20;
const childrenHeight = 50;
const circleRadius = (childrenHeight - 20) / 2;


export default function PreferencesSetupView() {

    const [displayData, setDisplayData] = useState([
        { key: "availability", text: "More available slots" },
        { key: "hourlyRate", text: "Lower hourly rates" },
        { key: "weather", text: "Fits the weather" },
    ]);
    const [preferenceData, setPreferenceData] = useState({
        weather: 2,
        availability: 1,
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
                        console.log("Retrieved user preference", response.data)
                        setPreferenceData(response.data);
                        sortDisplayData(response.data);
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
        sortDisplayData(newPreferenceData);
    };

    const sortDisplayData = (newPreferenceData) => {
        // Sort displayData so that enabled items come first, followed by disabled items
        const sortedDisplayData = displayData.sort((a, b) => {
            // Get rankings for both items
            const rankA = newPreferenceData[a.key];
            const rankB = newPreferenceData[b.key];

            // If both items are enabled, sort by their ranking
            if (rankA > 0 && rankB > 0) {
                return rankA - rankB;
            }

            // If A is disabled (0) and B is enabled, A comes after B
            if (rankA === 0 && rankB > 0) {
                return 1;
            }

            // If B is disabled (0) and A is enabled, A comes before B
            if (rankA > 0 && rankB === 0) {
                return -1;
            }

            // If both are disabled, they can stay in the same order as before
            return 0;
        });

        // Update displayData with the new sorted array
        setDisplayData(sortedDisplayData);
    };


    const renderPreferenceItem = (item, index) => {
        const ranking = preferenceData[item.key];
        return (
            <View
                style={
                    ranking === 0
                        ? displayItemStyles.item_disabled
                        : displayItemStyles.item
                }
                key={item.key}
            >
                <Text style={preferencesSetupViewStyles.itemText}>
                    {item.text}
                </Text>
                <View style={displayItemStyles.item_icon_swipe}>
                    {ranking !== 0 && <Text style={commonStyles.fieldText3}>{ranking}</Text>}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={commonStyles.container}>
            <View style={preferencesSetupViewStyles.header}>
                <Text style={preferencesSetupViewStyles.headerText}>
                    Preferences
                </Text>
                <Text style={preferencesSetupViewStyles.descriptionText}>
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
                    setDisplayData(data);
                }}
                renderItem={(item, index) =>
                    renderPreferenceItem(displayData[index], index)
                }
            />
        </SafeAreaView>
    );
}


const itemBasics = {
    width: childrenWidth,
    height: childrenHeight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
};


const displayItemStyles = StyleSheet.create({
    item: {
        ...itemBasics,
        backgroundColor: commonToolkit.mainThemeColor,
    },
    item_disabled: {
        ...itemBasics,
        alignItems: "center",
        backgroundColor: "#d3d3d3",
    },
    item_icon_swipe: {
        width: circleRadius * 2,
        height: circleRadius * 2,
        backgroundColor: "#fff",
        borderRadius: circleRadius,
        marginRight: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});