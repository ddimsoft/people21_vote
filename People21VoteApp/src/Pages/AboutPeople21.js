import React, { Component } from 'react';
import { View, Image, Button, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

/**
 * EzRoadApp
 * Class : AboutPeople21
 * Descrition : 참여 연대 소개 페이지 입니다. 
 *
 * Created By 최영호 on 2020-02-28
 */
class AboutPeople21 extends Component {
    constructor(props) {
        super(props)
    }

    /*
   <Image
                        style={ {width:'100%', height:'100%' , resizeMode:'contain'}}
                        source={require('../../resources/support_bn01.png')}/>
    */

    render() {
        return (
            <View style={ {flexDirection:"column"} }>
                <View>
                    <Image
                        style={ {width:'100%', height:'100%' , resizeMode:'contain'}}
                        source={require('../../resources/support_bn01.png')}/>
                </View>
                <View style={styles.ButtonGroup}>
                        <Button onPress={() => this.doStoreHistory()} title="저장하기" />
                        <Button onPress={() => this.doMakeResultImage()} title="공유하기" />
                    </View>
            </View>
                
            
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    ButtonGroup: {
        justifyContent: 'center',
        flexDirection: "row",
        height : '20%'
    },
});
export default AboutPeople21;