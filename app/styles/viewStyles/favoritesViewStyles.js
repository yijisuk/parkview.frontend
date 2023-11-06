import { StyleSheet } from "react-native-web";
import { commonStyles, commonToolkit } from "../commonStyles";


const favoritesViewStyles = StyleSheet.create({
    container: {
        ...commonStyles.container,
        justifyContent: "center",
    },
    placeholderText: {
        ...commonStyles.fieldText1,
        textAlign: "left",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 50
    },
});

export default favoritesViewStyles;