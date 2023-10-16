import React from "react";
import { StatusBar } from 'expo-status-bar';


//avoiding view
import  {KeyboardAvoidingView,ScrollView,TouchableWithoutFeedback,Keyboard} from 'react-native';

const KeyboardAvoidingWrapper = ({children}) => {
    return(
        <KeyboardAvoidingView style={{flex:1}}>
            <ScrollView>
            <StatusBar style="light" backgroundColor="lightgreen" />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default KeyboardAvoidingWrapper;