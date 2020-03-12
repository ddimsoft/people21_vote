import React, { Component } from 'react';
import { View, Button, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { DataBase } from '../common/DataBase';
import { StrDateUtils } from '../common/StrDateUtils';
import Modal from "react-native-modal";
import * as EzConstants from "../common/Constants";

/**
 * EzRoadApp
 * Class : VoteHistory
 * Descrition : 의석수 계산 이력 조회
 *              페이지 입니다. 
 *
 * Created By 최영호 on 2020-02-28
 */


class Item extends Component  {
    constructor(props) {
        super(props);
        this.tableHead = ['정당명', '득표율', '지역구', '준연동형', '병립형', '합계'];
        this.tableData = [];
        this.state = {
            modalVisible : false, 
            offset : 50, 

        }
    }
    
    doInit() {
        this.tableData = [];
        this.props.record.data.map((obj, i) => {
            let row = [
                obj.party_name,
                obj.party_ratio,
                obj.local,
                obj.r1_value,
                obj.r2_value,
                obj.total_seat_amount
            ]
    
            this.tableData.push(row);
        });
    }

    /**
     * 수정 요청 이벤트를 
     * 처리 합니다. 
     * 
     * Dialog를 종료 하고 
     * props의 onMoveToEdit함수를 호출 합니다. 
     */
    onReqEdit() {
        this.closeModal();
        this.props.onMoveToEdit(this.props.record);
    }

    /**
     * Chart 조회 요청 이벤트를 
     * 처리 합니다. 
     * 
     * Dialog를 종료 하고 
     * props의 doMoveToChart함수를 호출 합니다. 
     */
    onReqMoveToChart() {
        this.closeModal();
        this.props.doMoveToChart(this.props.record);
    }

    /**
     * 레코드를 
     * 클릭한 이벤트를 처리 합니다. 
     * 
     * modalVisible state value를 
     * true로 설정 하여 
     * 
     * Dialog를 활성화 합니다. 
     */
    onClickPressed() {
        this.setState({modalVisible:true});
    }

    /**
     * Dialog의 닫기 버튼을
     * 클릭한 이벤트를 처리 합니다. 
     * 
     * modalVisible state value를 
     * false로 설정 하여 
     * 
     * Dialog를 비 활성화 합니다. 
     */
    closeModal() {
        this.setState({modalVisible:false});
    }

    styles = StyleSheet.create({
        
        dialog_container: {
          backgroundColor: 'white',
          padding: 22,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 4,
          borderColor: 'rgba(0, 0, 0, 0.1)',
        },
        
        head : {
            backgroundColor : '#F2FCFE',      
            height : 40,  
        },
        head_text : {
            color : '#067FA3',        
            textAlign : 'center',
        },
        row_text : {
            margin: 1, alignItems: 'center', textAlign: 'center' 
        },
        item: {
            backgroundColor: '#FFFFFF',
            marginVertical: 8,
            borderColor : '#E3E7E8',
            borderStyle : 'solid',
        },
        reg_date : {
            flex : 1,
            fontSize: 12,
            color : '#EBF0F3',
            textAlign : 'right'
        }
        /*
        head: { height: 40, backgroundColor: '#f1f8ff', justifyContent: 'center' },
    head_text: { margin: 3, textAlign: 'center' },
    text: { margin: 1, alignItems: 'center', textAlign: 'center' }
        contentTitle: {
          fontSize: 20,
          marginBottom: 12,
        },
        */
      });

    render() {
        this.doInit();
        return (
            <View style={this.styles.item}>
                <Modal isVisible={this.state.modalVisible} 
                    onRequestClose={this.closeModal.bind(this)} >    
                    <View style={this.styles.dialog_container}>
                        <View style={{width:'100%', flexDirection : "row"}}>
                            <View style={{flex:1, margin: 5}}>
                                <Button title="수정" onPress={this.onReqEdit.bind(this)} />
                            </View>
                            <View style={{flex:1, margin: 5}}>
                                <Button  title="차트보기" onPress={this.onReqMoveToChart.bind(this)} />
                            </View>
                            <View style={{flex:1, margin: 5}}>
                                <Button title="닫기" onPress={this.closeModal.bind(this)} />    
                            </View>    
                        </View>
                        
                    </View>
                </Modal>        

                <TouchableOpacity onPress={this.onClickPressed.bind(this)}>
                    
                    <View style={{ flex: 1, flexDirection: "column" }}  >
                        
                        <Table borderStyle={{ flex:1,  borderWidth: 2, borderColor: '#F2FCFE' }} >
                            <Row data={this.tableHead} style={this.styles.head} textStyle={this.styles.head_text} />
                            <Rows data={this.tableData} textStyle={this.styles.row_text}  />
                        </Table>
                        <View style={{height:25}    }>
                            <Text style={this.styles.reg_date}>
                                저장 시간 : [{this.props.record.title}]
                            </Text>
                        </View>
                        
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    
}

/**
 * 저장 이력을 
 * 보여주는 Component입니다. 
 */
class VoteHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
        this.db = new DataBase();
    }

    /**
     * DB에 저장되어 있는 이력을  
     * 조회 합니다. 
     */
    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.doInit();    
        })
        
    }

    /**
     * 자원을 해제 합니다. 
     */
    componentWillUnmount() {
        this._unsubscribe();
    }

    async doInit() {
        await this.db.openDb()
        this.doRefresh();
    }

    
    /**
     * 저장 이력을 
     * 갱신 합니다. 
     */
    doRefresh() {
        this.db.getAllPredictionList()
            .then(
                (predictList) => {
                    let dataList = [];
                    let totalMap = new Map()
                    let strDateUtils = new StrDateUtils();
                    for (let i = 0; i < predictList.length; i++) {

                        let obj = predictList[i];
                        dataList = totalMap.get(obj.predict_group_id);
                        // 신규 그룹 시작 
                        if (dataList == undefined) {
                            dataList = new Array();
                            totalMap.set(obj.predict_group_id, dataList);
                        }
                        dataList.push(obj);
                    }

                    let keyList = totalMap.keys();
                    let finalList = [];
                    for (let idx of keyList) {
                        let predictList = totalMap.get(idx);
                        let headerTitle = strDateUtils.dateFormatting(predictList[0].reg_date, "-", ":");
                        let keyStr = predictList[0].reg_date + "_" + idx;
                        finalList.push({ title: headerTitle, data: predictList, idx: keyStr })
                    }
                    this.setState({ data: finalList });
                }
            )
            .catch((err) => {
                console.log("[VoteHistory]---------------------------------");
                console.log(err);
                console.log("[VoteHistory]---------------------------------");
            });
    }

    // 수정 화면으로 이동 합니다. 
    doMoveToEdit(item) {
        this.props.navigation.navigate('PredictionDetail', { predictResult: item.data, crudMode : EzConstants.CRUD_MODE_EDIT });
    }

    // VoteResult 화면으로 이동 합니다. 
    doMoveToChart(item) {
        this.props.navigation.navigate('VoteResult', { predictResult: item.data, crudMode : '_EDIT' });
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => 
                        <Item record={item} 
                            
                            doMoveToChart={this.doMoveToChart.bind(this)}  
                            onMoveToEdit={this.doMoveToEdit.bind(this)} />}
                    keyExtractor={item => item.idx}
                />
                <Button onPress={() => this.doRefresh()} title="재조회" />
            </View>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
    },
    
    header: {
        fontSize: 15,
    },
    content: {
        fontSize: 24,
    },
    
});
export default VoteHistory;