import { StyleSheet, useColorScheme } from "react-native";

const colorScheme = useColorScheme();

const isColorSchemeDark = colorScheme === "dark";

const mainBlack = "#03071e";
const mainWhite = "#f8f9fa";
const mainThemeColor = "#09bc8a";

const autoButtonColor = isColorSchemeDark ? mainWhite : mainBlack;
const autoFieldElemColor = isColorSchemeDark ? mainWhite : mainBlack;
const autoButtonTextColor = isColorSchemeDark ? mainBlack : mainWhite;

export const commonToolkit = {
    isColorSchemeDark: isColorSchemeDark,

    autoButtonColor: autoButtonColor,
    autoFieldElemColor: autoFieldElemColor,
    autoButtonTextColor: autoButtonTextColor,

    mainBlack: mainBlack,
    mainWhite: mainWhite,
    mainThemeColor: mainThemeColor,
};

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isColorSchemeDark ? mainBlack : mainWhite,
    },
    headerFieldText: {
        ...textBasics(30, "field"),
    },
    headerButtonText: {
        ...textBasics(30, "button"),
    },
    fieldText1: {
        ...textBasics(20, "field"),
    },
    buttonText1: {
        ...textBasics(20, "button"),
    },
    fieldText2: {
        ...textBasics(18, "field"),
    },
    buttonText2: {
        ...textBasics(18, "button"),
    },
    fieldText3: {
        ...textBasics(14, "field"),
    },
    buttonText3: {
        ...textBasics(14, "button"),
    },
    mainButton: {
        ...buttonBasics("main"),
    },
    generalButton: {
        ...buttonBasics("general"),
    },
    map: {
        flex: 1,
    },
});

const textBasics = (fontSize, type) => ({
    fontSize: fontSize,
    fontWeight: "bold",
    color: type === "field" ? autoFieldElemColor : autoButtonTextColor,
});

const buttonBasics = (type) => ({
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: type === "main" ? mainThemeColor : autoButtonColor,
});
