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
        this.doInit();
    }
    
    doInit() {
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

    // 
    onReqEdit() {
        this.closeModal();
        this.props.onMoveToEdit(this.props.record);
    }

    onReqMoveToChart() {
        this.closeModal();
        this.props.doMoveToChart(this.props.record);
    }

    onClickPressed() {
        this.setState({modalVisible:true});
    }

    closeModal() {
        this.setState({modalVisible:false});
    }

    styles = StyleSheet.create({
        content: {
          backgroundColor: 'white',
          padding: 22,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 4,
          borderColor: 'rgba(0, 0, 0, 0.1)',
        },
        contentTitle: {
          fontSize: 20,
          marginBottom: 12,
        },
      });

    render() {
        return (
            <View>
                <Modal isVisible={this.state.modalVisible} 
                    onRequestClose={this.closeModal.bind(this)} >    
                    <View style={this.styles.content}>
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
                        <Text>
                            저장 시간 : [{this.props.record.title}]
                        </Text>
                        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }} >
                            <Row data={this.tableHead} style={styles.head} textStyle={styles.text} />
                            <Rows data={this.tableData} textStyle={styles.text}  />
                        </Table>
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
        this.doInit();
    }

    /**
     * 자원을 해제 합니다. 
     */
    componentWillUnmount() {
        this._unsubscribe();
    }

    async doInit() {
        await this.db.openDb();
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.doRefresh();
        });
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
        console.log("Recieved Idx Is : ");
        //console.log(item);
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
        marginHorizontal: 16,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
    },
    header: {
        fontSize: 15,
    },
    content: {
        fontSize: 24,
    },
    head: { height: 40, backgroundColor: '#f1f8ff', justifyContent: 'center' },
    head_text: { margin: 3, textAlign: 'center' },
    text: { margin: 1, alignItems: 'center', textAlign: 'center' }
});
export default VoteHistory;