import { StyleSheet } from "react-native-web";
import { commonStyles, commonToolkit } from "../commonStyles";


const navigationViewStyles = StyleSheet.create({
    conatiner: {
        ...commonStyles.container,
        justifyContent: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    inner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default navigationViewStyles;