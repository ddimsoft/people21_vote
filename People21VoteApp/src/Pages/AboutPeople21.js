import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet , Dimensions, Linking} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as EzConstants from '../common/Constants';

/**
 * Project : People21VoteApp
 * Class : AboutPeople21
 * Descrition : 참여 연대 소개 페이지 입니다. 
 *
 * Created By 최영호 on 2020-02-28
 */
class AboutPeople21 extends Component {
    constructor(props) {
        super(props)
    }

    /**
     * 특정 페이지로 이동 합니다. 
     * @param {} optionStr 
     */
    doMoveToWeb(optionStr) {
        Linking.openURL(optionStr)
        .then()
        .catch( (err) => {
            console.log(err);
        });
    }

    render() {
        var {height, width} = Dimensions.get('window');    

        return (
                <ScrollView style={{flex:1}} >
                    <View style={ {flexDirection:"column"} }>
                        <View>
                            <TouchableOpacity onPress={() => {this.doMoveToWeb(EzConstants.OPEN_COUNCIL_URL)} }>
                                <Image
                                    style={ {width:width, height:300 , resizeMode:'stretch'}}
                                    source={require('../../resources/app_design_cy_08_01.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => {this.doMoveToWeb(EzConstants.ABOUT_PEOPLE_21_URL)} }>
                                <Image
                                    style={ {width:width, height:300 , resizeMode:'stretch'}}
                                    source={require('../../resources/app_design_cy_08_02.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => {this.doMoveToWeb(EzConstants.SUPPORT_PEOPLE_21_URL)} }>
                                <Image
                                    style={ {width:width, height:100 , resizeMode:'stretch'}}
                                    source={require('../../resources/app_design_cy_08_03.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => {this.doMoveToWeb(EzConstants.JOIN_NEW_LETTER_URL)} }>
                                <Image
                                    style={ {width:width, height:100 , resizeMode:'stretch'}}
                                    source={require('../../resources/app_design_cy_08_04.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            
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