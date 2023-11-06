import { StyleSheet } from "react-native-web";
import { commonStyles, commonToolkit } from "../commonStyles";

const settingsViewStyles = StyleSheet.create({
    container: {
        ...commonStyles.container,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 50
    },
    greetingsText: {
        ...commonStyles.fieldText1,
        paddingTop: 10,
    },
    button: {
        ...commonStyles.generalButton,
        padding: 10,
        marginTop: 20,
        height: 50,
    },
    closeModalButton: {
        // styles for close modal button
        marginTop: 15,
        backgroundColor: commonToolkit.buttonColor,
        padding: 30,
        borderRadius: 5,
        alignItems: "center",
    },
    modal: {
        // custom styles for modal
        margin: 0, // This is important to ensure the modal shows up from the side
        justifyContent: "flex-end", // Align to the bottom of the screen
    },
});

export default settingsViewStyles;
