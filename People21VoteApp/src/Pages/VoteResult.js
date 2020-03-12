import React, { Component } from 'react';
import { View, Button, StyleSheet, processColor, SafeAreaView } from 'react-native';
import { PieChart } from 'react-native-charts-wrapper'
import { ScrollView } from 'react-native-gesture-handler';
import { Table, Row, Rows } from 'react-native-table-component';
import { DataBase } from '../common/DataBase';
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';
import { captureRef } from "react-native-view-shot";
import * as EzConstants from "../common/Constants";

/**
 * EzRoadApp
 * Class : VoteResult
 * Descrition : 의석수 계산 결과를 
 *              보여주는 Class 입니다. 
 *
 * Created By 최영호 on 2020-02-28
 */
class VoteResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            legend: {},
            dataStyle: {},
            highlights: [],
            description: {},
            tableHead: ['정당명', '득표율', '지역구', '준연동형', '병립형', '합계'],
            tableData: [], 
            crudMode : ''
        };
        //console.log(predictResult);
    }
    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.doInit();
        });
    }

    /**
     * 화면을 초기화 합니다. 
     */
    async doInit() {

        await this.doRefreshChart()
        await this.doRefreshSummaryTable();
    }

    /**
     * 하단의 요약 테이블의 
     * 데이터를 갱신 합니다. 
     */
    async doRefreshSummaryTable() {
        const { predictResult } = this.props.route.params;

        let newTableData = [];

        for (let i = 0; i < predictResult.length; i++) {
            let obj = predictResult[i];

            let row = [];
            row.push(obj.party_name);
            row.push(obj.party_ratio);
            row.push(obj.local);
            row.push(obj.r1_value);
            row.push(obj.r2_value);
            row.push(obj.total_seat_amount);

            newTableData.push(row);
        }

        this.setState({ tableData: newTableData });
    }

    /**
     * Pie Chart를 
     * 작성 합니다. 
     */
    async doRefreshChart() {
        const { predictResult } = this.props.route.params;
        var dataSetsValue = []
        var dataStyle = {}
        var legendStyle = {}
        var descStyle = {}
        var valueLegend = []
        var colorLegend = []

        for (let i = 0; i < predictResult.length; i++) {
            let obj = predictResult[i];
            valueLegend.push({ value: Number(obj.total_seat_amount), label: obj.party_name })
            colorLegend.push(processColor(obj.party_color));
        }
        const datasetObject = {
            values: valueLegend,
            label: '',
            config: {
                colors: colorLegend,
                valueTextSize: 20,
                valueTextColor: processColor('green'),
                sliceSpace: 5,
                selectionShift: 13
            }
        }
        dataSetsValue.push(datasetObject)


        legendStyle = {
            enabled: true,
            textSize: 12,
            form: 'CIRCLE',
            position: 'BELOW_CHART_RIGHT',
            wordWrapEnabled: true
        }
        dataStyle = {
            dataSets: dataSetsValue
        }
        descStyle = {
            text: '',
            textSize: 15,
            textColor: processColor('darkgray')
        }

        this.setState({ descStyle: descStyle, dataStyle: dataStyle, legend: legendStyle });
    }
    /**
     * 예측 결과를 
     * DB에 저장 요청 합니다. 
     */
    async doStoreHistory() {
        try {
            const { predictResult } = this.props.route.params;
            let db = new DataBase();

            await db.openDb();
            await db.doStorePredict(predictResult);
                    
            // 저장 이력 화면으로 이동 합니다.  
            this.props.navigation.navigate('VoteHistory', { name: 'VoteHistory' });
        }
        catch(err) {
            console.log("[VoteResult]---------------------------------");
            console.log(err);
            console.log("[VoteResult]---------------------------------");
        }
        
    }

    /**
     * 예측 결과를 
     * DB에 수정 요청 합니다. 
     */
    async doUpdateHistory() {
        try {
            const { predictResult } = this.props.route.params;
            let db = new DataBase();
            await db.openDb();
            await db.doUpdatePredict(predictResult);
                    
            // 저장 이력 화면으로 이동 합니다.  
            this.props.navigation.navigate('VoteHistory', { name: 'VoteHistory' });
        }
        catch(err) {
            console.log("[VoteResult]---------------------------------");
            console.log(err);
            console.log("[VoteResult]---------------------------------");
        }
    }

    /**
     * 화면을 캡쳐 하여 
     * Base64 Format문자열로 변환 합니다. 
     */
    doMakeResultImage() {
       captureRef( this.refs.viewShot,  {
            format: "jpg",
            result : "base64"
            })
        .then( 
            uri => {
                this.doShareToSNS(uri);
            },
            error => console.error("Oops, snapshot failed", error)
        );
       
    }

    /**
     * SNS에 공유 합니다. 
     */
    doShareToSNS (content) {
        let img_str = "data:image/jpeg;base64," + content;
        let shareOption = {
            title : '참여연대에서 개발한 21대 총선 의석수 예측 결과입니다. ',
            url : img_str
        };
        Share.open(shareOption)
        .then((res) => { console.log(res) })
        .catch((err) => { err && console.log(err); });
    }

    /**
     * 화면을 구성 합니다. 
     */
    render() {
        
        this.crudMode = this.props.route.params.crudMode;
        let btnGroup;

        if(this.crudMode == EzConstants.CRUD_MODE_INSERT) {
            btnGroup =  <View style={{flex:1}}>
                            <Button style={{ flex: 1 }} onPress={() => this.doStoreHistory()} title="예측 저장" />
                        </View>;
        }
        else if(this.crudMode == EzConstants.CRUD_MODE_EDIT) {
            btnGroup =  <View style={ { flex:2, flexDirection:'row'} }>
                            <View style={{ flex: 1 }}>
                                <Button  onPress={() => this.doUpdateHistory()} title="예측 수정" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Button  onPress={() => this.doStoreHistory()} title="예측 추가" />    
                            </View>
                        </View>;
        }
        else {
            btnGroup = <View></View>
        }

        return (
            <SafeAreaView style={styles.container}>
                <ViewShot ref="viewShot" style={{flex : 1 }}>
                    <ScrollView style={{backgroundColor:'#ffffff'}}>
                        <PieChart
                            style={styles.chart}
                            chartDescription={this.state.descStyle}
                            data={this.state.dataStyle}
                            legend={this.state.legendStyle}
                        />
                    
                        <View style={{ flex: 1 }}>
                            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                                <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text} />
                                <Rows data={this.state.tableData} textStyle={styles.text} />
                            </Table>
                        </View>
                    </ScrollView>
                </ViewShot>
                <View>
                    <View style={styles.ButtonGroup}>
                        {btnGroup}
                        <View style={{ flex: 1 }}>
                            <Button  onPress={() => this.doMakeResultImage()} title="공유하기" />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    chart: {
        height: 350
    },
    ButtonGroup: {
        width:'100%',
        flexDirection: "row"
    },
    head: { height: 40, backgroundColor: '#f1f8ff', justifyContent: 'center' },
    head_text: { margin: 3, textAlign: 'center' },
    text: { margin: 1, alignItems: 'center', textAlign: 'center' }
});
export default VoteResult;