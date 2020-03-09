function compute(predict_rows) {
  console.log(predict_rows);

  const total_seat = 300;
  const cap = 30;
  const cap2 = 17;
  
  // 전체 정당의 개수는 9개 입니다. 10번째 정당은 무소속 정당으로 간주 합니다. 
  // commented by choi young ho. 
  // 2020.03.03
  const party_count = 9;      

  
  // 입력 값 체크 
  // 의석수 합계 
  // 득표율 합계 로직은
  // 클라이언트에서 처리 하는 것으로  합니다. 
  // edited by choi young ho. 
  // 2020.03.03

  //정당득표율  party_ratio_i  변수 생성
  /*
  for (var i = 1; i <= party_count; i++) {
    r_value = $("#party_ratio_" + i).val();
    r_value = Number(r_value);
  
    eval("party_ratio_" + i + "= " + r_value);
  }
  */

  // 입력 값 설정
  // 클라이언트에서 전달받은 
  // 값으로 변수를 생성 합니다. 
  // edited by choi young ho. 
  // 2020.03.03
  let obj;
  let idx = 1;
  for (let i = 0; i < predict_rows.length; i++) {
    obj = predict_rows[i];
    eval("party_ratio_" + idx + "=" + obj.party_ratio);
    eval("local" + idx + "=" + obj.local);

console.log(i + "th local is : " + eval( "local" + idx));

    
    // party_type = 'PT02' 인 정당은 무소속 정당으로 
    // 간주 하여 연동형
    // total_seat_amount => 지역구 의석수 (local)
    // r1_value => 0
    // r2_value => 0 으로 설정 합니다. 
    if('PT02' == obj.party_type) {
      predict_rows[i]['total_seat_amount'] =  obj.local;
      predict_rows[i]['r1_value'] =  0;
      predict_rows[i]['r2_value'] =  0;
    }

    idx++;    
  }

  eval("party_ratio_" + idx + "=" + obj.party_ratio);
  eval("local" + idx + "=" + obj.local);


  //first_share_i,  second_share_i 초기화
  for (var i = 1; i <= party_count; i++) {
    eval("first_share_" + i + "= 0");
  }
  for (var i = 1; i <= party_count; i++) {
    eval("second_share_" + i + "= 0");
  }



  //1. 연동배분 기준 의석 수 산출

  for (var i = 1; i <= party_count; i++) {
    eval("minus" + i + "= 0");
  }

  ex_list = []; //비례의석 할당한 정당 리스트

  //정당득표율 0이 아니고(and),  (득표율 3% 이상  or  지역구 5석 이상인 경우)에만    비례할당 정당 리스트(ex_list)에 추가
  //무소속의석과, 득표율 3% 미만 and  지역구 5명 미만인 정당의 지역구 의석은  전체의석에서 빼서, 연동배분기준의석수(base_seat) 산출

  for (var i = 1; i <= party_count; i++) {
    p_ratio = eval("party_ratio_" + i);
    p_local = eval("local" + i);
    console.log(p_ratio, p_local);

    if (p_ratio >= 3 || p_local >= 5) {
      if (p_ratio != 0) {
        ex_list.push(i);

        eval("minus" + i + "= 0");
      } else {
        eval("minus" + i + "=" + "local" + i);
      }
    } else {
      eval("minus" + i + "=" + "local" + i);
    }
  }

  console_string = "";
  ex_list.forEach(element => (console_string = console_string + element));
  console.log("3%, 5석 조건 해당 정당 :", console_string);

  minus10 = local10;

  var base_seat = total_seat;
  for (var i = 1; i <= party_count + 1; i++) {
    base_seat = base_seat - eval("minus" + i);
  }

  //연동배분 기준 의석 수 산출  끝

  console_string = "";
  for (var i = 1; i <= party_count + 1; i++) {
    console_string = console_string + eval("minus" + i) + "  ";
  }

  console.log("minus", console_string);

  console.log("1.연동배분 기준 의석수:", base_seat);

  //2.  정당별 배분위한  기초 수치 산출  first_share_base_num_i

  for (var i = 1; i <= party_count; i++) {
    p_ratio = eval("party_ratio_" + i);
    p_local = eval("local" + i);

    eval(
      "first_share_base_num_" +
      i +
      "=" +
      ((base_seat * p_ratio) / 100 - p_local) / 2
    );
  }

  console_string = "";
  for (var i = 1; i <= party_count; i++) {
    console_string = console_string + eval("first_share_base_num_" + i) + " ";
  }

  console.log("2.정당별 배분기초수치:", console_string);
  ex_list2 = []; //비례의석 할당할 정당리스트 다시 만들기

  for (var i = 1; i <= party_count; i++) {
    if (ex_list.indexOf(i) == -1) {
      //first_share_base_num_1 = 0;
      eval("first_share_base_num_" + i + "= 0");
    }
  }

  // 3.연동비례 1차 배분   first_share_i
  //   반올림 후 정수 배분
  for (var i = 1; i <= party_count; i++) {
    fsbn = eval("first_share_base_num_" + i);
    if (Math.round(fsbn) < 1 || ex_list.indexOf(i) == -1) {
      eval("first_share_" + i + "= 0");
    } else {
      eval("first_share_" + i + "= " + Math.round(fsbn));
    }

    if (eval("first_share_" + i) != 0) {
      ex_list2.push(i);
    }
  }

  console_string = "";
  ex_list2.forEach(element => (console_string = console_string + element));
  console.log("정수 할당할 정당 :", console_string);

  first_share_total = 0;
  for (var i = 1; i <= party_count; i++) {
    first_share_total = first_share_total + eval("first_share_" + i);
  }

  console_string = "";
  for (var i = 1; i <= party_count; i++) {
    console_string = console_string + eval("first_share_" + i) + " ";
  }

  console.log(
    "3.정당별 연동비례 1차 배분(정수배분):",
    console_string,
    "합계:",
    first_share_total
  );

  //first_share_total = 35;

  if (first_share_total == cap) {
    //30석 모두 배분되면 끝
  } else {
    if (first_share_total > cap) {
      console.log("1차 배분 30 초과한  경우");
      //30 초과한 경우   1차 배분 다시 계산
      //1. 배분위한 기초 수치 다시 계산

      for (var i = 1; i <= party_count; i++) {
        fsbn = eval("first_share_base_num_" + i);
        eval("base_num_" + i + "=" + (cap * fsbn) / first_share_total);
      }

      console_string = "";
      for (var i = 1; i <= party_count; i++) {
        console_string = console_string + eval("base_num_" + i) + " ";
      }
      console.log("---1차  재배분 기초 수치:", console_string);

      //2. 소수점 이하자리  under_i

      for (var i = 1; i <= party_count; i++) {
        eval("under_" + i + "= 0");
      }

      for (var i = 1; i <= party_count; i++) {
        bn = eval("base_num_" + i);
        //console.log(bn);
        if (eval("base_num_" + i) > 0) {
          eval("under_" + i + "=" + (bn - Math.floor(bn)));
          //eval("under_" + i + "=" + (bn -- Math.floor(bn)));
        }
      }

      console_string = "";
      for (var i = 1; i <= party_count; i++) {
        console_string = console_string + eval("under_" + i) + " ";
      }
      console.log("---1차  재배분 기초 수치 - 소수점 아래 :", console_string);

      //소수점 이하 버리고 정수 만큼 의석 배분- 배분기초수치 base_num_1 가 음수인 경우도 배분 제외  -3% 5석 만족시키는 정당만 배분

      for (var i = 1; i <= party_count; i++) {
        if (ex_list.indexOf(i) != -1) {
          b_num = eval("base_num_" + i);
          b_num = Math.floor(b_num);
          eval("first_share_" + i + "= " + b_num);
        }
      }

      for (var i = 1; i <= party_count; i++) {
        if (eval("first_share_" + i) < 1) {
          eval("first_share_" + i + "= 0");
        }
      }

      console_string = "";
      for (var i = 1; i <= party_count; i++) {
        console_string = console_string + eval("first_share_" + i) + " ";
      }
      console.log("---1차 재배분 :", console_string);

      first_share_total = 0;
      for (var i = 1; i <= party_count; i++) {
        first_share_total = first_share_total + eval("first_share_" + i);
      }

      rest_seat = cap - first_share_total;
      console.log("---남은 의석:", rest_seat);

      //이차 배분 - 소수점 이하 자리 수 크기 기준 배분
      var share_party_list = [];

      //ex_list 에 있는  정당들 대상으로 1차  재배분 기초 수치중 소수부분 크기 순서대로 나머지 의석 배분

      for (var i = 1; i <= party_count; i++) {
        if (eval("base_num_" + i) > 0) {
          temp = { party: i, under: eval("under_" + i) };
          share_party_list.push(temp);
        }
      }

      /*       for (var i = 1; i <= party_count; i++) {
        if (eval("first_share_" + i) != 0) {
          temp = { party: i, under: eval("under_" + i) };
          share_party_list.push(temp);
        }
      } */

      var sortingField = "under";

      share_party_list.sort(function (a, b) {
        // 내림차순
        return b[sortingField] - a[sortingField];
        // 44, 25, 21, 13
      });

      console.log("소수점 배분 순서");
      for (key in share_party_list) {
        console.log(
          key,
          share_party_list[key].party,
          share_party_list[key].under
        );
      }

      var share_party_count = share_party_list.length;

      console.log("비례배분 정당 수:", share_party_count);

      //rest_seat = 3;
      for (var i = 1; i < rest_seat + 1; i++) {
        temp = i % share_party_count;
        if (temp == 0) {
          temp = share_party_count;
        }

        party_key = temp - 1;

        eval("second_share_" + share_party_list[party_key].party + "+=1");
        //console.log(temp, share_party_list[party_key].party);
      }

      console_string = "";
      for (var i = 1; i <= party_count; i++) {
        console_string = console_string + eval("second_share_" + i) + " ";
      }
      console.log("--2차 배분 :", console_string);
    } else {
      //first_share_total 30보다 작은경우

      console.log(
        "################## 1차 배분 30 이하인 경우 ################## ###################################################### "
      );
      var rest_seat = cap - first_share_total; // 1차 배분후 남은 의석 - 소수점이하 숫자기준 배분함
      //ex_list2  사용해서 나머지 배분

      console.log("1차배분후 남은 의석수: ", rest_seat);
      //1차배분후 남은 의석 배분 ex) rest_seat =6

      //2차 배분:  소수점 크기 순서대로
      //first_share_base_num_i

      //step2_i  새로은 기준 수치 계산
      for (var i = 1; i <= party_count; i++) {
        p_ratio = eval("party_ratio_" + i);
        eval("step2_" + i + "=" + (rest_seat * p_ratio) / 100);
      }

      console_string = "";
      for (var i = 1; i <= party_count; i++) {
        console_string = console_string + eval("step2_" + i) + " ";
      }
      console.log("2차 배분 기준수치 : ", console_string);

      //정수배분   second_share_i

      for (var i = 1; i <= party_count; i++) {
        eval("second_share_" + i + "= 0");
        if (ex_list.indexOf(i) != -1) {
          shbn = eval("step2_" + i);
          eval("second_share_" + i + "= " + Math.floor(shbn));
        }
      }

      console_string = "";
      for (var i = 1; i <= party_count; i++) {
        console_string = console_string + eval("second_share_" + i) + " ";
      }
      console.log("2차 배분: ", console_string);

      for (var i = 1; i <= party_count; i++) {
        rest_seat = rest_seat - eval("second_share_" + i);
      }

      console.log("2차 배분 후 남은 의석  : ", rest_seat);

      if (rest_seat) {
        var share_party_list = []; //소수점 정렬할 리스트 생성

        for (var i = 1; i <= party_count; i++) {
          if (ex_list2.indexOf(i) != -1) {
            fsbn = eval("step2_" + i);
            under_val = fsbn - Math.floor(fsbn);
            temp = { party: i, under: under_val };
            share_party_list.push(temp);
          }
        }

        var sortingField = "under";

        share_party_list.sort(function (a, b) {
          // 내림차순
          return b[sortingField] - a[sortingField];
          // 44, 25, 21, 13
        });

        console.log("new 소수점 배분 순서");
        for (key in share_party_list) {
          console.log(
            key,
            share_party_list[key].party,
            share_party_list[key].under
          );
        }

        var share_party_count = share_party_list.length;

        //rest_seat = 3;
        for (var i = 1; i < rest_seat + 1; i++) {
          temp = i % share_party_count;
          if (temp == 0) {
            temp = share_party_count;
          }

          party_key = temp - 1;

          eval("second_share_" + share_party_list[party_key].party + "+=1");
          //console.log(temp, share_party_list[party_key].party);
        }
      }

      console_string = "";
      for (var i = 1; i <= party_count; i++) {
        console_string = console_string + eval("second_share_" + i) + " ";
      }
      console.log("2차 배분 최종(정수+소수배분):", console_string);

      //#########first_share_total 30보다 작은경우  끝
    }
  }

  // 연동형 배분 최종 결과 display
  // 객체에 값을 할당하는 방식으로 변경 
  // edited by choi young ho. 
  // 2020.03.03
  console.log("---------------------------------------------------------------------");
  for (var i = 1; i <= party_count; i++) {
    fs = Number(eval("first_share_" + i));
    ss = Number(eval("second_share_" + i));
    let r1Value = fs + ss;
    console.log("준연동형 비례 최종 : " + i + "th is " + r1Value);
    //$("#r1_" + i).html(fs + ss);
    predict_rows[i - 1]['r1_value'] = r1Value;
  }
  console.log("---------------------------------------------------------------------");

  //######################## 병립형 배분 계산 부분 ########################

  for (var i = 1; i <= party_count; i++) {
    eval("pararal_share_" + i + "= 0");
  }
  console.log("###### 병렬형 배분 시작#####");
  for (var i = 1; i <= party_count; i++) {
    p_ratio = eval("party_ratio_" + i);
    if (ex_list.indexOf(i) != -1) {
      //pararal_share_1 = Math.floor((17 * party_ratio_1) / 100);
      console.log(i, (17 * p_ratio) / 100);

      eval("pararal_share_" + i + "=" + Math.floor((17 * p_ratio) / 100));
    }
  }

  pararal_share_total = 0;
  for (var i = 1; i <= party_count; i++) {
    pararal_share_total = pararal_share_total + eval("pararal_share_" + i);
  }

  console_string = "";
  for (var i = 1; i <= party_count; i++) {
    console_string = console_string + eval("pararal_share_" + i) + " ";
  }

  console.log("병립형 1차 배분:", console_string);
  //배열생성 및 정렬
  rest_seat = 17 - pararal_share_total;
  console.log("병렬1차 배분 잔여석:", rest_seat);

  for (var i = 1; i <= party_count; i++) {
    p_ratio = eval("party_ratio_" + i);
    under_num = (17 * p_ratio) / 100 - Math.floor((17 * p_ratio) / 100);
    eval("under_" + i + "= " + under_num);

    console.log(eval("under_" + i));
  }

  var share_party_list = [];

  for (var i = 1; i <= party_count; i++) {
    under = eval("under_" + i);
    if (ex_list.indexOf(i) != -1) {
      share_party_list.push({ party: i, under: under });
    }
  }

  var sortingField = "under";
  share_party_list.sort(function (a, b) {
    // 내림차순
    return b[sortingField] - a[sortingField];
    // 44, 25, 21, 13
  });

  //배열생성 및 정렬 끝
  console.log("병렬형 배분 정당 리스트----");
  for (key in share_party_list) {
    console.log(key, share_party_list[key].party, share_party_list[key].under);
  }

  var share_party_count = ex_list.length;
  console.log("배분정당수:", share_party_count);
  //console.log('병렬 1차 배분:', pararal_share_1, pararal_share_2, pararal_share_3, pararal_share_4, pararal_share_5, pararal_share_6);

  for (var i = 1; i <= party_count; i++) {
    eval("pararal_second_share_" + i + "= 0");
  }

  if (pararal_share_total < 18) {
    for (var i = 1; i < rest_seat + 1; i++) {
      temp = i % share_party_count;
      if (temp == 0) {
        temp = share_party_count;
      }

      party_key = temp - 1;

      try {
        eval(
          "pararal_second_share_" + share_party_list[party_key].party + "+=1"
        );
      } catch {
        console.log("error");
      }

      eval_str =
        "pararal_second_share_" + share_party_list[party_key].party + "+=1";
      //console.log(eval_str);
    }

    console_string = "";
    for (var i = 1; i <= party_count; i++) {
      console_string = console_string + eval("pararal_second_share_" + i) + " ";
    }

    console.log("병렬 2차 배분:", console_string);
  }

  // 객체에 값을 할당하는 방식으로 변경
  // edited by choi young ho. 
  // 2020.03.03
  console.log("---------------------------------------------------------------------");
  for (var i = 1; i <= party_count; i++) {
    let r2Value = Number(eval("pararal_share_" + i)) + Number(eval("pararal_second_share_" + i));
    console.log("최종 병립형 비례 : " + i + " th is : " + r2Value);
    //$("#r2_" + i).html(
    //      eval("pararal_share_" + i) + eval("pararal_second_share_" + i)
    //);
    predict_rows[i - 1]['r2_value'] = r2Value;
  }
  console.log("---------------------------------------------------------------------");

  // 전체 의석수 계산 로직
  // 객체에 값을 반영하는 방식으로 변경 
  // edited by choi young ho. 
  // 2020.03.03
  for (var i = 1; i <= party_count; i++) {
    local = eval("local" + i);
    first_share = eval("first_share_" + i);
    second_share = eval("second_share_" + i);
    pararal_share = eval("pararal_share_" + i);
    pararal_second_share = eval("pararal_second_share_" + i);

    let totalAmount = local + first_share + second_share + pararal_share + pararal_second_share;

    console.log(i + "th total is : " + totalAmount);
    predict_rows[i - 1]['total_seat_amount'] = totalAmount;
    //$("#total_" + i).html(
    //      local + first_share + second_share + pararal_share + pararal_second_share
    //);
  }

  /*  서브 Total은 클라이언트에서 
      계산 하는 방식으로 변경 
      edited by choi young ho. 
  $("#total_10").html(local10);
  
  vtotal = 0;
  for (var i = 1; i <= party_count + 1; i++) {
    vtotal = vtotal + Number($("#total_" + i).html());
  }

  $("#vtotal").html(vtotal);
  captotal = 0;
  for (var i = 1; i <= party_count; i++) {
    captotal = captotal + Number($("#r1_" + i).html());
  }

  partotal = 0;
  for (var i = 1; i <= party_count; i++) {
    partotal = partotal + Number($("#r2_" + i).html());
  }

  $("#captotal").html(captotal);
  $("#partotal").html(partotal);
  */


  // 객체에 값을 할당하는 방식으로 변경 
  // edited by choi young ho. 
  for (var i = 0; i <= party_count; i++) {
    var partyTotal = predict_rows[i]['total_seat_amount'];
    let seatRatio = ((Number(partyTotal) / 300) * 100).toFixed(2);
    console.log("최종 의석 비율 : " + i + " th is : " + seatRatio);
    predict_rows[i]['total_seat_ratio'] = seatRatio;
  }

  return predict_rows;
}




module.exports.compute = compute;