import React, { Component } from 'react';
import { StyleSheet, TextInput, Text, View, Button, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Input } from 'react-native-elements';
import RNFetchBlob from 'react-native-fetch-blob';
import { DataBase } from '../common/DataBase';
import  EzColorPicker  from '../common/EzColorPicker';

/**
 * 상단 타이틀 구현 
 * 클래스 입니다. 
 */
class TitleBar extends Component {
    render() {
        return (
            <View style={styles.title_bar}>
                <View style={styles.title_bar_partyname}>
                    <Text style={{ color: '#0DBCD3', fontWeight: 'bold' }}>정당명</Text>
                </View>
                <View style={styles.title_bar_cell}>
                    <Text style={{ color: '#0DBCD3', fontWeight: 'bold' }}>득표율</Text>
                </View>
                <View style={styles.title_bar_cell}>
                    <Text style={{ color: '#0DBCD3', fontWeight: 'bold' }}>지역구의석</Text>
                </View>
            </View>
        )
    }
}

/**
 * Predic 레코드를 정의 합니다. 
 */
class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            party_name: props.obj.party_name,
            party_ratio: props.obj.party_ratio,
            party_color: props.obj.party_color,
            local: props.obj.local,
            party_type : props.obj.party_type,
            id: props.obj.predict_id
        };
        var ColorIs	= this.ColorIs.bind(this);
    }

    ColorIs(str) {
        this.setState({party_color : str.color});
        // 당별 색상을 변경 합니다. 
        this.props.parentRef.updatePartyColor(this.state.id, str.color);
    }

    render() {
        // 정당별 득표율 TextField를 정의 합니다. 
        // 무소속인 경우 Text로 대체 합니다. 
        let ratioInput;
        if(this.state.party_type== "PT01") 
            ratioInput = <TextInput
                                    style={styles.item_input}
                                    defaultValue={String(this.state.party_ratio)}
                                    numericvalue
                                    keyboardType={'numeric'}
                                    onChangeText={text => {
                                        this.props.parentRef.updateApprovalRate(this.state.id, text);
                                    }} />;
        else 
            ratioInput = <Text></Text>;

        var	ColorIs	=	this.ColorIs;    

        return (
            <View style={styles.item}>
                <View style={{ flex: 2 }}>
                    <View style={{flex :1, flexDirection: 'row'}}>
                        <EzColorPicker style={{width:30, height:40}} oriColor={this.state.party_color} parentResolve={ColorIs.bind(this)}/>
                        <View style={{flex:1}}>
                            <TextInput
                                style={styles.item_party_name_input}
                                defaultValue={this.state.party_name}
                                onChangeText={text => {
                                    this.props.parentRef.updatePartyName(this.state.id, text);
                                }} />
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, }}>
                    {ratioInput}
                </View>
                <View style={{ flex: 1 }}>
                    <TextInput
                        style={styles.item_input}
                        defaultValue={String(this.state.local)}
                        numericvalue
                        keyboardType={'numeric'}
                        onChangeText={text => {
                            this.props.parentRef.updateeEectedAmount(this.state.id, text);
                        }} />
                </View>
            </View>
        );
    }
}

/**
 * 정당별 Input 항목 
 * 리스트 구현 Class 입니다. 
 * 
 * 복수개의 Item Class를 
 * 포함 합니다. 
 */
class PredictList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let inputRow = [];

        for (let i = 0; i < this.props.data.length; i++) {
            let obj = this.props.data[i];
            inputRow.push(<Item obj={obj} parentRef={this.props.parentRef} key={obj.predict_id} />);
        }

        return (
            <View style={styles.predict_list}>
                {inputRow.map((value) => {
                    return value
                })}
            </View>
        );
    }
}

class PredictionDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.db = new DataBase();
        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.doInit();
    }

    componentWillUnmount() {
        // DB 해제 

    }

    /**
     * Database를 
     * Open하고 
     * 최근 리스트를 요청 합니다. 
     */
    async doInit() {
        try {
            await this.db.openDb()
            await this.db.getLastPredictionList().then((predictList) => {
                this.setState({ data: predictList });
            });
        }
        catch (err) {
            console.log("[PredictionDetail]---------------------------------");
            console.log(err);
            console.log("[PredictionDetail]---------------------------------");
        }
    }


    /**
     * 특정 predict_id의
     * Predict 레코드를 반환 합니다. 
     * @param {*} predictId 
     */
    getPredictItemByID(predictId) {
        let result = new Object();
        for (let i = 0; i < this.state.data.length; i++) {
            let obj = this.state.data[i];
            //console.log(obj);
            if (predictId == obj.predict_id) {
                result = obj;
                break;
            }
        }
        return result;
    }

    /**
     * 특정 predict_id의
     * Index 반환 합니다. 
     * @param {*} predictId 
     */
    getPredictItemIndexById(predictId) {
        let result = -1;
        for (let i = 0; i < this.state.data.length; i++) {
            let obj = this.state.data[i];
            //console.log(obj);
            if (predictId == obj.predict_id) {
                result = i;
                break;
            }
        }
        return result;
    }

    /**
     * 특정 predictId의 
     * Predict 레코드의 정당 색을 
     * 수정 합니다. 
     * @param {} colorStr 
     */
    updatePartyColor(predictId, colorStr) {
        let idx = this.getPredictItemIndexById(predictId);
        let obj = this.getPredictItemByID(predictId);

        if (obj.predict_id != null) {
            obj.party_color = colorStr;
            this.state.data[idx] = obj;
        }
    }
    /**
     * 특정 predictId의 
     * Predict 레코드의 정당명을 
     * 수정 합니다. 
     * @param {*} predictId  : 정당 Index
     * @param {*} text : 신규 정당명
     */
    updatePartyName(predictId, text) {
        let idx = this.getPredictItemIndexById(predictId);
        let obj = this.getPredictItemByID(predictId);

        if (obj.predict_id != null) {
            obj.party_name = text;
            this.state.data[idx] = obj;
        }
    }

    /**
     * 특정 predictId의 
     * Predict 레코드의 득표율을 
     * 수정 합니다. 
     * @param {*} predictId  : 정당 Index
     * @param {*} approvalRate : 득표율
     */
    updateApprovalRate(predictId, approvalRate) {
        let idx = this.getPredictItemIndexById(predictId);
        let obj = this.getPredictItemByID(predictId);

        if (obj.predict_id != null) {
            obj.party_ratio = approvalRate;
            this.state.data[idx] = obj;
        }
    }

    /**
     * 특정 predictId의 
     * Predict 레코드의 의석수를 
     * 수정 합니다. 
     * @param {*} predictId  : 정당 Index
     * @param {*} electedAmount : 의석수 
     */
    updateeEectedAmount(predictId, electedAmount) {
        let idx = this.getPredictItemIndexById(predictId);
        let obj = this.getPredictItemByID(predictId);

        if (obj.predict_id != null) {
            obj.local = electedAmount;
            this.state.data[idx] = obj;
        }
    }

    /**
     * 현재 예측 값을 
     * 기준으로 
     * 의석수 예츨 결과를 요청 합니다. 
     */
    reqCalculate() {

        // 예측 결과 요청 
        RNFetchBlob.config({
            trusty: true
        })
            .fetch('POST', 'https://renewhouse.iptime.org:8444/vote_predict/predict_result/', {
                'Content-Type': 'application/json'}, 
                JSON.stringify({ obj: this.state.data })
            )
            .then((res) => {
                let json = res.json()
                //console.log(json.rows);
                // Detail Page로 이동 합니다. 
                this.props.navigation.navigate('VoteResult', { predictResult: json.rows });
            })
            .catch((error) => {
                console.log(error);
            });

    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container}>
                <TitleBar />
                <ScrollView>
                    <PredictList
                        style={{ flex: 1 }}
                        parentRef={this}
                        data={this.state.data} />
                </ScrollView>
                <Button onPress={() => this.reqCalculate()} title="계산하기" />
            </KeyboardAvoidingView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#EBF0F3'
    },

    title_bar: {
        margin: 10,
        borderRadius: 5,
        flexDirection: 'row',
        height: 40,
        backgroundColor: '#FFFFFF',
        alignItems: "center",
        justifyContent: "center"
    },
    title_bar_partyname: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center"
    },
    title_bar_cell: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },

    predict_list: {
        margin: 10,
        borderRadius: 5,
        backgroundColor: '#F3F7F8',
    },

    item: {
        paddingTop: 5,
        flex: 1,
        flexDirection: "row",
    },
    item_party_name_input: {
        margin: 5,
        padding: 10,
        height: 40,
        fontWeight: 'bold',
        color: '#0DBCD3',
        borderColor: '#babbbc',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderStyle: 'solid',
        fontSize: 13,
        borderRadius: 5,
    },
    item_input: {
        textAlign: "right",
        padding: 10,
        margin: 5,
        height: 40,
        borderColor: '#babbbc',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderStyle: 'solid',
        fontSize: 13,
        borderRadius: 5,
    },
    ButtonGroup: {
        height: 50,
        backgroundColor: '#2a4bc3',
    }
});

export default PredictionDetail;