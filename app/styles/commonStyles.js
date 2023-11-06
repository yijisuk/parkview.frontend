import { StyleSheet, useColorScheme } from "react-native";

const colorScheme = useColorScheme();

const isColorSchemeDark = colorScheme === "dark";

const mainBlack = "#03071e";
const mainWhite = "#fff";
const mainThemeColor = "#09bc8a";

const buttonColor = mainBlack;
const fieldElemColor = mainBlack;
const buttonTextColor = mainWhite;

const viewBackgroundColor = mainWhite;

export const commonToolkit = {
    isColorSchemeDark: isColorSchemeDark,

    buttonColor: buttonColor,
    fieldElemColor: fieldElemColor,
    buttonTextColor: buttonTextColor,
    viewBackgroundColor: viewBackgroundColor,

    mainBlack: mainBlack,
    mainWhite: mainWhite,
    mainThemeColor: mainThemeColor,
};

const textBasics = (fontSize, type) => ({
    fontSize: fontSize,
    fontWeight: "bold",
    color: type === "field" ? fieldElemColor : buttonTextColor,
});

const buttonBasics = (type) => ({
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: type === "main" ? mainThemeColor : buttonColor,
});

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isColorSchemeDark ? mainBlack : mainWhite,
    },
    headerFieldText: {
        ...textBasics(26, "field"),
    },
    headerButtonText: {
        ...textBasics(26, "button"),
    },
    fieldText1: {
        ...textBasics(24, "field"),
    },
    buttonText1: {
        ...textBasics(24, "button"),
    },
    fieldText2: {
        ...textBasics(20, "field"),
    },
    buttonText2: {
        ...textBasics(20, "button"),
    },
    fieldText3: {
        ...textBasics(18, "field"),
    },
    buttonText3: {
        ...textBasics(18, "button"),
    },
    mainButton: {
        ...buttonBasics("main"),
    },
    generalButton: {
        ...buttonBasics("general"),
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
});
