import styled from 'styled-components';
import {view,text,image} from 'react-native';
import Constants from 'expo-constants'

const StatusBarHeight = Constants.statusBarHeight;

//colors
export const Colors = {
    primary: "#ffffff",
    secondary: "#60192b",
    tertiary: "#b3945e",
    brand: "#ffffff",
};

const {primary,secondary,tertiary} = Colors;

export const StyledContainer = styled.view`
    flex: 1;
    padding: 25px;
    padding-top: ${StatusBarHeight + 10}px;
    backgronud-color: ${primary};
`;

export const InnerContainer =  styled.view`
    flex: 1;
    width: 100%;
    align-items: center;
`;

export const PageLogo = styled.image`
    width: 250px;
    height: 200px;
`;
export const PageTitle = styled.text`
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    color: ${brand};
    padding: 10px;
`;