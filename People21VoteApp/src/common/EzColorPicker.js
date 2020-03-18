import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert} from 'react-native';
import { ColorPicker } from 'react-native-color-picker'

/**
 * Project : People21VoteApp
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
      color : '',
      view_color : '',
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
    this.setState({
      view_color : color,
      color : color
    });

    this.props.parentResolve({color}); 
    this.setModalVisible(false);
  }  

  /**
   * 스크롤에서 
   * 칼라를 변경하는 
   * 색을 반영 합니다. 
   * @param {} color 
   */
  
  onColorChange(color) {
    console.log("try to change...");
    console.log(color);
    this.setState({ color : color })
  }
  

  /**
   * 화면의 활성화 
   * 상태를 설정 합니다. 
   * @param {*} visible 
   */
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  /**
   * render함수 이전에 호출되는 
   * 함수 입니다. 
   * 
   * View의 Backgroup color를 나타내는 
   * view_color의 값이 변경된 이벤트와 
   * color_picker의 color 값이 변경된 
   * 이벤트를 처리 합니다 .
   * @param {} nextProps 
   * @param {*} prevState 
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if(prevState.view_color != nextProps.oriColor) {
      isUpdated = true;
      return {
        view_color: nextProps.oriColor
      };
    }

    // color picker의 color가 변경되었는지 체크 합니다 .
    if(prevState.color != nextProps.color) {
      return {
        color: nextProps.color
      };
    }
    return null;
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
              <ColorPicker
                oldColor={this.props.oriColor}
                color={this.state.picker_color}
                onColorChange={color => { this.onColorChange(color)}}
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
            <View style={{with:20, height:20, backgroundColor : this.state.view_color}} />
        </TouchableHighlight>
      </View>
    );
  }
}