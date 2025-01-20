// table 추가 (+thead)
const table = document.createElement("table");
const headTr = document.createElement("tr");

document.querySelector(".main-wrap").appendChild(table);

const headData = ["이름", "나이", "별명", "커리어"];

headData.map(head => {
  const th = document.createElement("th");
  th.innerText = head;
  headTr.appendChild(th);
});

table.appendChild(headTr);

// 클릭 시 데이터 테이블에 추가
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

function data(){

  const storedData = JSON.parse(window.localStorage.getItem("userInfo")) || [];

  let userInfo = { id: idNum.value, name : name.value, age : age.value, carrer : carrer.value, nickName : nickName.value };

  const idRepeat = storedData.filter(user => user.id === userInfo.id);
  const nickRepeat = storedData.filter(user => user.nickName === userInfo.nickName);

  console.log("중복:", idRepeat);

  if(idRepeat.length === 1){
    idAlert.innerText = "중복된 아이디입니다.";
    nameAlert.innerText = "";
    ageAlert.innerText = "";
    carrerAlert.innerText = "";
    nickNameAlert.innerText = "";
  } else if ( idNum.value.length === 0 ){
    idAlert.innerText = "아이디가 비어있습니다."
    nameAlert.innerText = "";
    ageAlert.innerText = "";
    carrerAlert.innerText = "";
    nickNameAlert.innerText = "";
  } else if ( name.value.length === 0 ) {
    nameAlert.innerText = "이름이 비어있습니다.";
    idAlert.innerText = "";
    ageAlert.innerText = "";
    carrerAlert.innerText = "";
    nickNameAlert.innerText = "";
  } else if ( age.value.length === 0 ) {
    ageAlert.innerText = "나이가 비어있습니다.";
    idAlert.innerText = "";
    nameAlert.innerText = "";
    carrerAlert.innerText = "";
    nickNameAlert.innerText = "";
  } else if ( age.value < 5 ){
    ageAlert.innerText = "5세 이상부터 가입이 가능합니다.";
    idAlert.innerText = "";
    nameAlert.innerText = "";
    carrerAlert.innerText = "";
    nickNameAlert.innerText = "";
  } else if ( age.value >= 110 ){
    ageAlert.innerText = "110세 이상은 가입이 불가능합니다.";
    idAlert.innerText = "";
    nameAlert.innerText = "";
    carrerAlert.innerText = "";
    nickNameAlert.innerText = "";
  } else if ( carrer.value.length < 15 ) {
    carrerAlert.innerText = "경력 사항은 15자 이상 작성하여주세요.";
    idAlert.innerText = "";
    nameAlert.innerText = "";
    ageAlert.innerText = "";
    nickNameAlert.innerText = "";
  } else if ( nickName.value.length < 2 ){
    nickNameAlert.innerText = "별명은 최소 2자 이상 작성하여주세요.";
    idAlert.innerText = "";
    nameAlert.innerText = "";
    ageAlert.innerText = "";
    carrerAlert.innerText = "";
  } else if ( nickRepeat.length === 1 ) {
    nickNameAlert.innerText = "중복된 별명입니다.";
    idAlert.innerText = "";
    nameAlert.innerText = "";
    ageAlert.innerText = "";
    carrerAlert.innerText = "";
  } else {

    idAlert.innerText = "";
    nameAlert.innerText = "";
    ageAlert.innerText = "";
    carrerAlert.innerText = "";
    nickNameAlert.innerText = "";

    userInfoAll.push(userInfo);
    window.localStorage.setItem("userInfo", JSON.stringify(userInfoAll));
    const infoKey = Object.keys(userInfo).map(info => userInfo[info]);

    const tr = document.createElement("tr");

    infoKey.shift();
    console.log(infoKey);

    infoKey.map(info => {
      const td = document.createElement("td");
      td.innerText = info;
      tr.appendChild(td);
    });

    tr.addEventListener("click", () => {
      const adult = userInfo.age >= 20 ? "성인" : "미성년자";

      alert(`해당하는 사람의 이름은 "${person.name}"이고, 나이는 "${person.age}세"이며, "${adult}"입니다. 커리어에는 "${person.carrer}"가 있으며, 별명으로는 "${person.nickName}"이 있습니다.`);
    });

    table.appendChild(tr);

    // 초기화
    idNum.value="";
    name.value="";
    age.value="";
    carrer.value="";
    nickName.value="";
  }

}

document.addEventListener("DOMContentLoaded", () => {
  userInfoAll.push(userInfo);
  window.localStorage.setItem("userInfo", JSON.stringify(userInfoAll));
  const infoKey = Object.keys(userInfo).map(info => userInfo[info]);

  const tr = document.createElement("tr");

  infoKey.shift();
  console.log(infoKey);

  infoKey.map(info => {
    const td = document.createElement("td");
    td.innerText = info;
    tr.appendChild(td);
  });

  tr.addEventListener("click", () => {
    const adult = userInfo.age >= 20 ? "성인" : "미성년자";

    alert(`해당하는 사람의 이름은 "${person.name}"이고, 나이는 "${person.age}세"이며, "${adult}"입니다. 커리어에는 "${person.carrer}"가 있으며, 별명으로는 "${person.nickName}"이 있습니다.`);
  });

  table.appendChild(tr);
});