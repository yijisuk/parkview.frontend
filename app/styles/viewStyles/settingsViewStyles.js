import { StyleSheet } from "react-native-web";
import { commonStyles, commonToolkit } from "../commonStyles";


const settingsViewStyles = StyleSheet.create({
    container: {
        ...commonStyles.container,
        padding: 20,
    },
    closeModalButton: {
        // styles for close modal button
        marginTop: 15,
        backgroundColor: commonToolkit.autoButtonColor,
        padding: 30,
        borderRadius: 5,
    },
    modal: {
        // custom styles for modal
        margin: 0, // This is important to ensure the modal shows up from the side
        justifyContent: "flex-end", // Align to the bottom of the screen
    },
});

export default settingsViewStyles;