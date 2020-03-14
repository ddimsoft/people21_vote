import React, { Component } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PredictionDetail from "./PredictionDetail"
import VoteResult from "./VoteResult"


const Stack = createStackNavigator();
const Prediction = () => {
    
    
    return (
        <Stack.Navigator>
            <Stack.Screen
            name="PredictionDetail"
            component={PredictionDetail}
            options={{title: '의석수계산'}}
            />
            <Stack.Screen name="VoteResult" component={VoteResult} options={{title:'계산결과'}} />
        </Stack.Navigator>
    );
    
    
}

export default Prediction;