import { StyleSheet } from "react-native-web";
import { commonStyles, commonToolkit } from "../commonStyles";


const navigationViewStyles = StyleSheet.create({
    button: {
        ...commonStyles.mainButton,
        marginTop: 10,
        marginRight: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    inner: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default navigationViewStyles;