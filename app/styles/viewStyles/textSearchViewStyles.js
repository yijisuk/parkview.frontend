import { StyleSheet } from "react-native";
import { commonStyles, commonToolkit } from "../commonStyles";
import { Dimensions } from "react-native";

const textSearchViewStyles = StyleSheet.create({
    container: {
        ...commonStyles.container,
        width: Dimensions.get("window").width,
        paddingHorizontal: 10,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 50,
    },
    searchIconContainer: {
        padding: 10,
    },
    searchIcon: {
        fontSize: 24,
        color: commonToolkit.fieldElemColor,
    },
});

export default textSearchViewStyles;
