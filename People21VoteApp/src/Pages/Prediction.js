import React, { Component } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PredictionDetail from "./PredictionDetail"
import VoteResult from "./VoteResult"


const Stack = createStackNavigator();

/**
 * Project : People21VoteApp
 * Class : Prediction
 * Descrition : 의석수 계산 Tab
 *              Navigation Stack 정의 화면입니다. 
 *
 * Created By 최영호 on 2020-02-28
 */
const Prediction = (props) => {
    
    return (
        <Stack.Navigator>
            <Stack.Screen
            name="PredictionDetail"
            component={PredictionDetail}
            options={{title: '의석수계산' }} />
            <Stack.Screen name="VoteResult" component={VoteResult} options={{title:'계산결과'}} />
        </Stack.Navigator>
    );
    
    
}

export default Prediction;