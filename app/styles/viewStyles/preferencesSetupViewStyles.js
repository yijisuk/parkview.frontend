import { StyleSheet } from "react-native-web";
import { commonStyles, commonToolkit } from "../commonStyles";


const preferencesSetupViewStyles = StyleSheet.create({
    header: {
        justifyContent: "center",
        alignItems: "flex-start",
        marginTop: 40,
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
        ...commonStyles.fieldText2,
        padding: 10,
    }
});


export default preferencesSetupViewStyles;