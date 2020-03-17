import React, { Component } from 'react';
import { StyleSheet, TextInput, Text, View, Button, Alert} from 'react-native';
import { KeyboardAvoidingView, ScrollView , BackHandler} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import { DataBase } from '../common/DataBase';
import  EzColorPicker  from '../common/EzColorPicker';
import * as EzConstants from "../common/Constants";
import * as Progress from 'react-native-progress';


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
            party_name: '',
            party_ratio: 0,
            party_color: '',
            local: 0,
            party_type : ''
        };
    }

    ColorIs(str) {
        this.setState({party_color : str.color});
        // 당별 색상을 변경 합니다. 
        this.props.parentRef.updatePartyColor(this.props.obj.predict_id, str.color);
    }

    checkNumericDigit(text) {
        let newText = '';
        let numbers = '0123456789.';

        for (var i=0; i < text.length; i++) {
            if(numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                alert("숫자로 입력하세요.");
            }
        }
        return newText;
    }

    render() {
        let obj = this.props.obj;
  
        // 정당별 득표율 TextField를 정의 합니다. 
        // 무소속인 경우 Text로 대체 합니다. 
        let ratioInput;
        if(obj.party_type== "PT01") 
        ratioInput = <TextInput
                        style={styles.item_input}
                        defaultValue={String(obj.party_ratio)}
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                        maxLength={5}
                        value = {this.state.party_ratio}
                        onChangeText={text => {
                            let num_value = this.checkNumericDigit(text);
                            this.setState({ party_ratio: num_value });
                            this.props.parentRef.updatePartyRatio(obj.predict_id, num_value);
                        }} />;
            
            
        else 
            ratioInput = <Text></Text>;
        
        return (
            <View style={styles.item}>
                <View style={{ flex: 2 }}>
                    <View style={{flex :1, flexDirection: 'row'}}>
                        <EzColorPicker style={{width:30, height:40}} oriColor={obj.party_color} parentResolve={this.ColorIs.bind(this)}/>
                        <View style={{flex:1}}>
                            <TextInput
                                style={styles.item_party_name_input}
                                defaultValue={obj.party_name}
                                maxLength={15}
                                selectTextOnFocus={true}
                                onChangeText={text => {
                                    this.props.parentRef.updatePartyName(obj.predict_id, text);
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
                        defaultValue={String(obj.local)}
                        selectTextOnFocus={true}
                        keyboardType='numeric'
                        maxLength={3}
                        value = {this.state.local}
                        onChangeText={text => {
                            let num_value = this.checkNumericDigit(text);
                            this.setState({ local: num_value });
                            this.props.parentRef.updateLocalAmount(obj.predict_id, num_value);
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


/**
 * 의석수 계산을 위해 
 * 입력폼을 생성 하는 
 * 클래스 입니다. 
 */
class PredictionDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            current_ratio : 0,
            current_local : 0,
            isLoading : false,
        }
        this.db = new DataBase();
    }

    /**
     * 종료 확인 이벤트를
     * 정의 합니다. 
     * 
     * android의 경우에 
     * 만 해당하는 기능 입니다. 
     */
    backAction = () => {
        Alert.alert("확인", "종료하시겠습니까?", [
          {
            text: "취소",
            onPress: () => null,
            style: "cancel"
          },
          { text: "종료", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      };
    

    /**
     * navigation router param에 따라 
     * 신규 등록 모드/수정 모드가 구분 됩니다. 
     */
    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.doToggleViewMode();
        });
        // android back 버튼 이벤트를 등록 합니다. 
        BackHandler.addEventListener("hardwareBackPress", this.backAction);
    }

    componentWillUnmount() {
        // DB 해제 

    }

    /**
     * props.route의 값에 
     * 따라 신규 등록 모드 수정 모드를 
     * 구분합니다. 
     */
    doToggleViewMode() {
        // router param이 존재하는 경우 수정 모드로 처리 합니다, 
        if(this.props.route.params != undefined) {
            const { predictResult } = this.props.route.params;
            //console.log(predictResult);
            this.crudMode = this.props.route.params.crudMode;
            this.setState({ data: predictResult });
        }
        else {
            this.crudMode = EzConstants.CRUD_MODE_INSERT;
            this.doInit();
        }
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

            // 정당 지지율 합계를 갱신 합니다. 
            this.doReCalculatePartyRationSum();
            // 지역 의석수 합계를 갱신 합니다. 
            this.doReCalculateLoalSum();
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
    updatePartyRatio(predictId, approvalRate) {
        let idx = this.getPredictItemIndexById(predictId);
        let obj = this.getPredictItemByID(predictId);

        if (obj.predict_id != null) {
            approvalRate = parseFloat(approvalRate);
            if( isNaN(approvalRate)) {
                approvalRate = 0;
            }

            obj.party_ratio = approvalRate;
            this.state.data[idx] = obj;
        }

        // 정당 지지율 합계를 갱신 합니다. 
        this.doReCalculatePartyRationSum();
    }

    /**
     * 특정 predictId의 
     * Predict 레코드의 의석수를 
     * 수정 합니다. 
     * @param {*} predictId  : 정당 Index
     * @param {*} electedAmount : 의석수 
     */
    updateLocalAmount(predictId, electedAmount) {
        let idx = this.getPredictItemIndexById(predictId);
        let obj = this.getPredictItemByID(predictId);

        if (obj.predict_id != null) {
            electedAmount = parseInt(electedAmount);
            if( isNaN(electedAmount)) {
                electedAmount = 0;
            }
            obj.local = electedAmount;
            this.state.data[idx] = obj;
        }
        
        // 지역 의석수 합계를 갱신 합니다. 
        this.doReCalculateLoalSum();
    }

    /**
     * 정당 지지율의 합계를 
     * 재 계산 합니다. 
     */
    doReCalculatePartyRationSum() {
        let ratioTotal = 0;
        for(let i=0; i<this.state.data.length; i++) {
            let item = this.state.data[i];
            ratioTotal = (ratioTotal + item.party_ratio);
        }
        ratioTotal = new Number(ratioTotal).toFixed(2);

        if(ratioTotal > 100) {
            alert("정당 지지율 합계를 100 이하로 설정해 주세요. ");
        }

        this.setState({current_ratio:ratioTotal});
    }

    /**
     * 지역 의석수의 합계를 
     * 재 계산 합니다. 
     */
    doReCalculateLoalSum() {
        let localTotal = 0;
        for(let i=0; i<this.state.data.length; i++) {
            let item = this.state.data[i];

            localTotal = localTotal + item.local;
        }
        if(localTotal > 253) {
            alert("지역 의석수 합계는 최대 253개 입니다. ");
        }

        this.setState({current_local:localTotal});
    }

    /**
     * 사용자의 입력값을 
     * 체크합니다. 
     */
    checkUserInput() {
        let result = true;

        for(let i=0; i<this.state.data.length; i++) {
            let item = this.state.data[i];
            if(item.party_name == "") {
                alert("정당명을 입력해 주세요.");
                result = false;
                break;
            }
        }

        // 지지율 합계를 체크 합니다. 
        if(result && this.state.current_ratio != 100) {
            alert("지지율의 합계가 100이 되어야 합니다.  ");
            result = false;
        }
        // 지역구 의석 합계를 체크 합니다. 
        if(result && this.state.current_local != 253) {
            alert("지역구 의석 합계가 253이 되어야 합니다.  ");
            result = false;
        }

        return result;
    }

    /**
     * 현재 예측 값을 
     * 기준으로 
     * 의석수 예츨 결과를 요청 합니다. 
     */
    reqCalculate() {
        // 사용자의 입력값이 
        // 오류가 있는 경우 이벤트를 종료 합니다. \
        if(!this.checkUserInput()) 
            return;
        
        this.setState({isLoading:true});

        // 예측 결과 요청 

        RNFetchBlob.config({
            trusty: true
        })
            .fetch('POST', EzConstants.SERVER_ADDRESS , {
                'Content-Type': 'application/json'}, 
                JSON.stringify({ obj: this.state.data })
            )
            .then((res) => {
                let json = res.json();
                this.setState({isLoading:false});
                // Detail Page로 이동 합니다. 
                this.props.navigation.navigate('VoteResult', { predictResult: json.rows , crudMode : this.crudMode});
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container}>
                <TitleBar />
                <View style={{width : '100%', alignItems: 'center'}}>
                { this.state.isLoading?  <Progress.Circle size={30}  indeterminate={true} /> : null}
                </View>
                <ScrollView>
                    <PredictList
                        style={{ flex: 1 }}
                        parentRef={this}
                        data={this.state.data} />
                </ScrollView>
                <View style={styles.title_bar}>
                    <View style={styles.title_bar_partyname}>
                        <Text style={{ color: '#0DBCD3', fontWeight: 'bold' }}>합계</Text>
                    </View>
                    <View style={styles.title_bar_cell}>
                        <Text style={{ color: '#0DBCD3', fontWeight: 'bold' }}>{this.state.current_ratio}</Text>
                    </View>
                    <View style={styles.title_bar_cell}>
                        <Text style={{ color: '#0DBCD3', fontWeight: 'bold' }}>({this.state.current_local}/253)</Text>
                    </View>
                </View>
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