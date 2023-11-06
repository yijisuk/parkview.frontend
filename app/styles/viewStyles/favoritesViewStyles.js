import { StyleSheet } from "react-native-web";
import { commonStyles, commonToolkit } from "../commonStyles";


const favoritesViewStyles = StyleSheet.create({
    container: {
        ...commonStyles.container,
        justifyContent: "center",
    },
    placeholderText: {
        ...commonStyles.fieldText1,
        textAlign: "center",
        padding: 20,
    },
});

export default favoritesViewStyles;