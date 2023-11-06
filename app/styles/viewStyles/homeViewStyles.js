import { StyleSheet } from "react-native";
import { commonStyles } from "../commonStyles";

const homeViewStyles = StyleSheet.create({
    buttonContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: [{ translateX: -125 }],
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5,
    },
    searchButton: {
        marginLeft: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    searchIcon: {
        fontSize: 24,
    },
    speechSearchButton: {
        ...commonStyles.mainButton,
        width: 150,
        height: 50,
    },
});

export default homeViewStyles;
