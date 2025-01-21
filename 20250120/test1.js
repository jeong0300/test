// table 추가 (+thead)
const table = document.createElement("table");

const headTr = document.createElement("tr");

document.querySelector(".main-wrap").appendChild(table);

const headData = ["이름", "나이", "커리어", "별명", "관리"];

headData.map(head => {
  const th = document.createElement("th");
  th.innerText = head;
  headTr.appendChild(th);
});

table.appendChild(headTr);

let userInfoAll = [];

// input 값
const idNum = document.getElementById("idNum");
const name = document.getElementById("name");
const age = document.getElementById("age");
const carrer = document.getElementById("carrer");
const nickName = document.getElementById("nickName");
// div
const idAlert = document.getElementById("idAlert");
const nameAlert = document.getElementById("nameAlert");
const ageAlert = document.getElementById("ageAlert");
const carrerAlert = document.getElementById("carrerAlert");
const nickNameAlert = document.getElementById("nickNameAlert");
// button
const modifyBtn = document.createElement("button");
const deleteBtn = document.createElement("button");

const saveData = JSON.parse(window.localStorage.getItem("saveData")) || [];

window.onload = function() {

  addTr();

}

function addTr(){

  const rows = saveData.map((data) => {
    const tr = document.createElement("tr");

    const keys = Object.keys(data);

    keys.shift(); // 아이디 없애기

    keys.map((key) => {
      const td = document.createElement("td");
      td.innerText = data[key];
      tr.appendChild(td);
    });

    return tr;
  });

  rows.map((tr) => table.appendChild(tr));
}

// 클릭 시 데이터 테이블에 추가
function data(){

  let userInfo = { id: idNum.value, name : name.value, age : age.value, carrer : carrer.value, nickName : nickName.value };

  const infoKey = Object.keys(userInfo).map(info => userInfo[info]);

  const infoRepeat = infoKey.filter ( info => info === "" );
  const idRepeat = saveData.filter(user => user.id === userInfo.id);
  const nickRepeat = saveData.filter(user => user.nickName === userInfo.nickName);

  if( infoRepeat.length >= 1 || idRepeat.length === 1 || Number(age.value) < 5 || 
  Number(age.value) >= 150 || carrer.value.length < 15 || nickName.value.length < 2 || nickRepeat.length === 1){

    if(idRepeat.length === 1){
      idAlert.innerText = "중복된 아이디입니다.";
    } else if ( idNum.value.length === 0 ){
      idAlert.innerText = "아이디가 비어있습니다."
    } else {
      idAlert.innerText = "";
    }
  
    if ( name.value.length === 0 ) {
      nameAlert.innerText = "이름이 비어있습니다.";
    } else {
      nameAlert.innerText = "";
    }
    
    if ( age.value.length === 0 ) {
      ageAlert.innerText = "나이가 비어있습니다.";
    } else if ( Number(age.value) < 5 ){
      ageAlert.innerText = "5세 이상부터 가입이 가능합니다.";
    } else if ( Number(age.value) >= 150 ){
      ageAlert.innerText = "150세 이상은 가입이 불가능합니다.";
    } else {
      ageAlert.innerText = "";
    }
    
    if ( carrer.value.length < 15 ) {
      carrerAlert.innerText = "경력 사항은 15자 이상 작성하여주세요.";
    } else {
      carrerAlert.innerText = "";
    }

    if ( nickName.value.length < 2 ){
      nickNameAlert.innerText = "별명은 최소 2자 이상 작성하여주세요.";
    } else if ( nickRepeat.length === 1 ) {
      nickNameAlert.innerText = "중복된 별명입니다.";
    } else {
      nickNameAlert.innerText = "";
    }

  }

  if ( infoRepeat.length === 0 && idRepeat.length === 0 && Number(age.value) >= 5 && 
  Number(age.value) < 150 && carrer.value.length >= 15 && nickName.value.length >= 2 && nickRepeat.length === 0) {

    // 테이블 추가 함수 호출
    saveData.push(userInfo);
    window.localStorage.setItem("saveData", JSON.stringify(saveData));

    const tr = document.createElement("tr");

    infoKey.shift(); // 아이디는 출력 안함
    console.log(infoKey);
    console.log("info", userInfo);
    console.log("all", userInfoAll);

    infoKey.map(info => {
      const td = document.createElement("td");
      td.innerText = info;
      tr.appendChild(td);
    });

    table.appendChild(tr);

    // 초기화
    idNum.value="";
    name.value="";
    age.value="";
    carrer.value="";
    nickName.value="";

    idAlert.innerText = "";
    nameAlert.innerText = "";
    ageAlert.innerText = "";
    carrerAlert.innerText = "";
    nickNameAlert.innerText = "";
  }
}