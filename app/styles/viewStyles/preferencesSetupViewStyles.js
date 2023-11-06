import { StyleSheet } from "react-native-web";
import { commonStyles, commonToolkit } from "../commonStyles";


const preferencesSetupViewStyles = StyleSheet.create({
    header: {
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 50,
    },
    headerText: {
        ...commonStyles.fieldText1,
        padding: 10,
        flexShrink: 1,
    },
    descriptionText: {
        ...commonStyles.fieldText2,
        padding: 10,
        flexShrink: 1,
    },
    itemText: {
        fontSize: 18,
        padding: 10,
    }
});


export default preferencesSetupViewStyles;