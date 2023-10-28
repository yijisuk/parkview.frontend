import React, { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import axios from "axios";
import { BACKEND_ADDRESS } from "@env";


export default function DummyView() {

    const [testData, setTestData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const testUrl = `${BACKEND_ADDRESS}/test`;
                const testResponse = await axios.get(testUrl);
                const testDataResponse = testResponse.data
                    ? testResponse.data
                    : "Error fetching data";

                setTestData(testDataResponse);

            } catch (error) {
                console.error("An error occurred while fetching data:", error);
                setTestData("Error fetching data");
            }
        };

        fetchData();
    }, []);


    return (
        <View>
            <Text>{JSON.stringify(testData)}</Text>
        </View>
    );
}
