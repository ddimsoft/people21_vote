/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import 'react-native-gesture-handler';
import { Text, View } from 'react-native';
import { Ionicons } from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


// Import partial pages
import Prediction from "./src/Pages/Prediction"
import VoteHistory from "./src/Pages/VoteHistory"
import AboutPeople21 from "./src/Pages/AboutPeople21"


const Tab = createMaterialTopTabNavigator();

const App: () => React$Node = () => {
  console.disableYellowBox = true;
  return (
    <>
    <NavigationContainer>
        <Tab.Navigator>
        <Tab.Screen name="Prediction" component={Prediction} options={{tabBarLabel:'의석수계산'}} />
        <Tab.Screen name="VoteHistory" component={VoteHistory} options={{tabBarLabel:'예측목록'}}/>
        <Tab.Screen name="AboutPeople21" component={AboutPeople21} options={{tabBarLabel:'참여연대소개'}}/>
      </Tab.Navigator>
    </NavigationContainer>
    </>
  );
};

export default App;
