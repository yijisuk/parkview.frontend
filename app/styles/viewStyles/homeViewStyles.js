import { StyleSheet } from "react-native";
import { commonStyles, commonToolkit } from "../commonStyles";

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
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: commonToolkit.mainWhite,
        marginLeft: 10,
        width: 50,
        height: 50,
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
