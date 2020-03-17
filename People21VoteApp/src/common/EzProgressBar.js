import React, {useState, useEffect} from 'react';
import { View, Text} from 'react-native';
import * as Progress from 'react-native-progress';

/**
 * Class : EzProgressBar
 * Descrition : ProgressBar 공통
 *              클래스 입니다. 
 * 
 */ 
const EzProgressBar = (props) => {
    /*
    let progressBar; 
    useEffect(() => {
        if(isVisible)
            return (
                <View  style={{width : '100%', alignItems: 'center'}}>
                    <Progress.Circle size={30}  indeterminate={true} />
                </View>
            );
        else 
            return (
                <View></View>
            );

      }, [isVisible]); // count가 바뀔 때만 effect를 재실행합니다.
      */

    return (
        <View  style={{width : '100%', alignItems: 'center'}}>
            { props.isLoading? <Progress.Circle size={30}  indeterminate={true} /> : null}
        </View>
    );
}

export default EzProgressBar ;