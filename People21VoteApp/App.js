/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import 'react-native-gesture-handler';
import { SafeAreaView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';



// Import partial pages
import Prediction from "./src/Pages/Prediction"
import VoteHistory from "./src/Pages/VoteHistory"
import AboutPeople21 from "./src/Pages/AboutPeople21"

const Tab = createMaterialTopTabNavigator();

const App =  ()  => {
  // yellow warning box를 비활성화 합니다. 
  console.disableYellowBox = true;
  return (
    <>
    <SafeAreaView style={{flex:1}}>
      <NavigationContainer>
          <Tab.Navigator>
          <Tab.Screen name="Prediction" component={Prediction} options={{tabBarLabel:'의석수계산'}} />
          <Tab.Screen name="VoteHistory" component={VoteHistory} options={{tabBarLabel:'예측목록'}}/>
          <Tab.Screen name="AboutPeople21" component={AboutPeople21} options={{tabBarLabel:'참여연대소개'}}/>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
    </>
  );
};

export default App;
