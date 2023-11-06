import { StyleSheet } from "react-native";
import { commonStyles, commonToolkit } from "../commonStyles";

const textSearchViewStyles = StyleSheet.create({
    container: {
        ...commonStyles.container,
        width: Dimensions.get("window").width,
        paddingHorizontal: 10,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: commonToolkit.autoFieldElemColor,
        borderRadius: 4,
        padding: 10,
    },
    searchIconContainer: {
        padding: 10,
    },
    searchIcon: {
        fontSize: 24,
        color: commonToolkit.autoFieldElemColor,
    },
});

export default textSearchViewStyles;
