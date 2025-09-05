import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(e);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log("value", value);
    return value;
  } catch (e) {
    console.error(e);
  }
};
