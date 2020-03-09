import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';


import PredictionDetail from "./PredictionDetail"
import VoteResult from "./VoteResult"

const Stack = createStackNavigator();

class Prediction extends Component {
    
    render() {
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
    
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    navBar: {
        flexDirection : 'row',
        height: 50,
        backgroundColor: '#FF6E40',
        alignItems: "center",
        justifyContent: "center"
    },
    navBarText: {
        flex : 1,
        fontSize: 30,
        color: '#FF6E40'
    },
    content: {
        flex: 1,
    },
    item: {
        flexDirection: "row",
        backgroundColor: '#88001b',
    },
    ButtonGroup: {
        height: 50,
        backgroundColor: '#2a4bc3',
    }
});

export default Prediction;