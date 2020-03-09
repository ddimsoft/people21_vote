import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert} from 'react-native';
import { ColorPicker } from 'react-native-color-picker'

/**
 * EzRoadApp
 * Class : EzColorPicker
 * Descrition : 칼라 선택  공통 Dialog 입니다. 
 *
 * Created By 최영호 on 2020-03-04
 */
export default class EzColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };    
  }
    
  /**
   * 컬러를 선택한 이벤트를 
   * 처리 합니다. 
   * 부모 창에 선택한 칼라를 전달하고 
   * 화면을 종료 합니다. 
   * @param {*} color 
   */
  doSelectColor(color) {
    this.props.parentResolve({color}); 
    this.setModalVisible(false);
  }  

  /**
   * 화면의 활성화 
   * 상태를 설정 합니다. 
   * @param {*} visible 
   */
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={{ width:20, heigth:'100%', marginTop: 15, marginLeft:5}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}>
            <View style={{flex: 1, padding: 45, backgroundColor: '#212021'}}>
              <Text style={{color: 'white'}}>React Native Color Picker - Controlled</Text>
              <ColorPicker
                oldColor='purple'
                color={this.state.color}
                onColorChange={this.onColorChange}
                onColorSelected={color => { this.doSelectColor(color)}}
                onOldColorSelected={color => { this.doSelectColor(color)}}
                style={{flex: 1}}
              />
            </View>
        </Modal>

        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true);
          }}>
            <View style={{with:20, height:20, backgroundColor : this.props.oriColor}} />
        </TouchableHighlight>
      </View>
    );
  }
}