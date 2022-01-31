import { ethers } from "ethers";

export const createByteArrFromString = (val: string) => {
    const byteArr = [];
    for (let i = 0; i < val.length; i++) {
        const currCharacter = val.charAt(i);
        byteArr.push(ethers.utils.formatBytes32String(currCharacter));
    }
    return byteArr;
};

//give array of bytes32, converts it to a regular UTF-16 javascript string
export const getStringFromByteArray = (arr: string[]): string => {
    const stringArr = [];
    for (let i = 0; i < arr.length; i++) {
        const val = arr[i];
        stringArr.push(ethers.utils.parseBytes32String(val));
    }
    return stringArr.join("");
};
