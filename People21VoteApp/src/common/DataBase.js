
import { StrDateUtils } from '../common/StrDateUtils';
import { openDatabase } from 'react-native-sqlite-storage';



/**
 * EzRoadApp
 * Class : DataBase
 * Descrition : DataBase관련 공통 클래스 입니다. 
 *
 * Created By 최영호 on 2020-02-28
 */
class DataBase {
    
    /**
     * Database Connection을 
     * 생성 합니다. 
     */
    async openDb() {
        return new Promise((resolve, reject) => {
            console.log("[DataBase] Try to open Database")
            this.db = openDatabase({ name: 'UserDatabase.db' });
            this.doInitPrecitionGroup("")
            .then((groupId) => this.doInitPrediction(groupId))
            .then( () => {
                console.log("[Database] DB Open is OK");
                resolve("");
            });
        });
    }


    async doInitPrecitionGroup(resultMsg) {
        console.log("[DataBase] Try to Init Database")
        return new Promise((resolve, reject) => {
            var strDateUtils = new StrDateUtils();
            var regDate = strDateUtils.getDateTimeString(new Date(), "", "");

            console.log("[DataBase] Try to Check predict_group table");

            this.db.transaction(function (txn) {
                txn.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='predict_group'",
                    [],
                    function (tx, res) {
                        if (res.rows.length == 0) {
                            console.log("[DataBase] try to drop old predict_group Table....");
                            txn.executeSql('DROP TABLE IF EXISTS predict_group')

                            console.log("[DataBase] try to create predict_group Table....");
                            txn.executeSql(
                                'CREATE TABLE IF NOT EXISTS predict_group ' +
                                '(predict_group_id INTEGER PRIMARY KEY AUTOINCREMENT, reg_date varchar(14))'
                            )

                            console.log("[DataBase] PREDIC_GROUP 기본 값을 등록 합니다. ");
                            txn.executeSql(
                                'INSERT INTO predict_group ' +
                                '(reg_date) values (?)',
                                [regDate]
                            )
                            console.log("[DataBase] NEW PREDIC_GROUP TABLE CREATED.");
                            resolve(1);
                        }
                        else {
                            console.log("[DataBase] Use exist PREDICT_GROUP table");
                            resolve(0);
                        }
                    });
            });

        });
    }

    async doInitPrediction(groupId) {
        var strDateUtils = new StrDateUtils();
        var regDate = strDateUtils.getDateTimeString(new Date(), "", "");

        const defaultValue = [
            [groupId, 0, '정당1', 110, 25.54, '#007bff', 0, 4, 114, 38.00 , 'PT01', regDate],
            [groupId, 1, '정당2', 105, 33.5, '#dc3545', 0, 6, 111, 37.00, 'PT01',regDate],
            [groupId, 2, '정당3', 25, 26.79, '#17a2b8', 17, 5, 47, 15.67, 'PT01',regDate],
            [groupId, 3, '정당4', 2, 14.17, '#28a745', 13, 2, 17, 5.67, 'PT01',regDate],
            [groupId, 4, '정당5', 0, 0, '#17a2b8', 0,0,0, 0.00, 'PT01',regDate],
            [groupId, 5, '정당6', 0, 0, '#17a2b8', 0,0,0, 0.00, 'PT01',regDate],
            [groupId, 6, '정당7', 0, 0, '#17a2b8', 0,0,0, 0.00, 'PT01',regDate],
            [groupId, 7, '정당8', 0, 0, '#17a2b8', 0,0,0, 0.00, 'PT01',regDate],
            [groupId, 8, '정당9', 0, 0, '#17a2b8', 0,0,0, 0.00, 'PT01',regDate],
            [groupId, 9, '무소속', 11, 0, '#17a2b8', 0,0,0, 0.00, 'PT02',regDate],
        ];


        return new Promise((resolve, reject) => {
            console.log("[DataBase] Try to Check predict table");

            this.db.transaction(function (txn) {
                txn.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='predict'",
                    [],
                    function (tx, res) {
                        if (res.rows.length == 0) {

                            console.log("[DataBase] try to create predict Table....");
                            txn.executeSql('DROP TABLE IF EXISTS predict', []);
                            txn.executeSql(
                                'CREATE TABLE IF NOT EXISTS predict ' +
                                '(predict_group_id INTEGER , predict_id INTEGER, ' +
                                ' party_name VARCHAR(100), local INTEGER, party_ratio NUMERIC, ' +
                                ' party_color varchar(10), ' +
                                ' r1_value INTEGER, r2_value INTEGER, ' + // r1_value : 준연동형 비례, r2_value: 병립형 비례 
                                ' total_seat_amount INTEGER, total_seat_ratio NUMERIC, ' + // total_seat_amount : 최종 의석수 , total_seat_ratio : 의석비율 
                                ' party_type VARCHAR(4), reg_date varchar(14) )'    // party_type : 정당 유형 (PT01 : 일반 정당, PT02 : 무소속 )
                                ,
                                []
                            );

                            // 기본 템플릿을 등록 합니다. 
                            for (var i = 0; i < defaultValue.length; i++) {
                                txn.executeSql(
                                    'insert into predict (' +
                                    '   predict_group_id, predict_id, ' +
                                    '   party_name, local, party_ratio, ' +
                                    '   party_color, ' +
                                    '   r1_value , r2_value , ' +         // r1_value : 준연동형 비례, r2_value: 병립형 비례 
                                    '   total_seat_amount , total_seat_ratio , ' +    // total_seat_amount : 최종 의석수 , total_seat_ratio : 의석비율 
                                    '   party_type, reg_date )' + 
                                    ' values ( ' +
                                    '   ?, ?,  ' +
                                    '   ?, ?, ? , ' +
                                    '   ?,  '  + 
                                    '   ?, ?, ' +
                                    '   ?, ?, ' +
                                    '   ?, ?)' ,
                                    defaultValue[i]
                                );
                            }
                            console.log("[DataBase] NEW PREDIC TABLE CREATED.");
                            resolve(1);
                        }
                        else {
                            console.log("[DataBase] using exist PREDIC table");
                            resolve(0);
                        }
                    }
                );
            });
        });
    }


    /**
     * 최근 저장한 
     * 예측 정보 그룹 아이디를 반환 합니다. 
     */
    async getMaxPredicGroup() {
        return new Promise((resolve, reject) => {
            console.log("[DataBase] Try to get Max prediction Group Id");
            this.db.transaction((tx) => {
                tx.executeSql("select max(predict_group_id) predict_group_id from predict_group", [], (tx, results) => {
                    let groupId = results.rows.item(0).predict_group_id;
                    resolve(groupId);
                });
            });
        });
    }

    /**
     * 신규 Predict Group을 
     * 생성 합니다. 
     * 
     * Group ID를 반환 ㅎ바니다.
     */
    async doInsertPredictGroup() {
        return new Promise( (resolve, reject) => {
            console.log("[DataBase/doInsertPredictGroup] Try to insert new Predict Group");
            
            try {
                let strDateUtils = new StrDateUtils();
                let regDate = strDateUtils.getDateTimeString(new Date(), "", "");
                this.db.transaction((tx) => {
                    tx.executeSql(
                        'INSERT INTO predict_group ' +
                        '(reg_date) values (?)',
                        [regDate]
                    );
                    this.getMaxPredicGroup()
                    .then( (groupId) =>{
                        resolve(groupId);
                    })
                    
                });
            }
            catch( err ) {
                console.log("[DataBase/doInsertPredictGroup] err : " + err);
                reject(err);
            }
        });
    }

    /**
     * 최근 저장한 
     * 예측 정보를 조회 합니다. 
     */
    async getLastPredictionList() {
        console.log("[DataBase] Try to get latest prediction List ");
        var groupId
        this.getMaxPredicGroup()
            .then((Id) => {
                groupId = Id;
            })
            .catch( (err) => {throw err;});

        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql("select * from predict where predict_group_id = ? ", [groupId], (tx, results) => {
                    var result = [];
                    let len = results.rows.length;
                    
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        result.push(row);
                    }
                    resolve(result);
                });
            });
        });
    }

    /**
     * 모든 예측 결과를 
     * 반환 합니다. 
     */
    async getAllPredictionList() {
        console.log("[DataBase] Try to get All prediction List ");
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql("select * from predict order by predict_group_id desc, predict_id asc", [], (tx, results) => {
                    var result = [];
                    let len = results.rows.length;
                    
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        result.push(row);
                    }
                    resolve(result);
                },
                (err) => {reject(err);});
            });
        });
    }

    /**
     * 예측 결과를 저장 합니다. 
     * 
     * @param {*} predictList 
     */
    async doStorePredict(predictList) {
        console.log("[DataBase] Try to Store Predict List");
        var strDateUtils = new StrDateUtils();
        var regDate = strDateUtils.getDateTimeString(new Date(), "", "");
        
        return new Promise((resolve, reject) => {

            this.doInsertPredictGroup()
            .then( (newGroupId) => {
                this.db.transaction((tx) => {
                    for(let i=0; i<predictList.length; i++) {
                        console.log("[DataBase] Try to New Predict Recordr");
                        let obj = predictList[i];
                        tx.executeSql(
                            'insert into predict (' +
                            ' predict_group_id , predict_id , ' +
                            ' party_name, local , party_ratio , ' +
                            ' party_color, ' +
                            ' r1_value , r2_value , ' +         // r1_value : 준연동형 비례, r2_value: 병립형 비례 
                            ' total_seat_amount , total_seat_ratio , ' +    // total_seat_amount : 최종 의석수 , total_seat_ratio : 의석비율 
                            ' party_type, reg_date )' + 
                            ' values ( ' +
                            '   ?, ?,  ' +
                            '   ?, ?, ? , ' +
                            '   ?,  '  + 
                            '   ?, ?, ' +
                            '   ?, ?, ' +
                            '   ?, ?)' 
                            ,
                            [ 
                                newGroupId, i, 
                                obj.party_name, obj.local, obj.party_ratio, 
                                obj.party_color, 
                                obj.r1_value, obj.r2_value,
                                obj.total_seat_amount, obj.total_seat_ratio,
                                obj.party_type, regDate
                            ]
                        );
                    }
                });
                
                resolve(newGroupId);
            })
            .catch ( (err) => {
                console.log("[Database/doStorePredict] Error : " + err);
                reject(err);
            })
        });
    }
}

export { DataBase }; 