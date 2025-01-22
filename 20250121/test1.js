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
const btn = document.getElementById("btnSelect");
// 버튼 활성화
let idComplete = false;
let nameComplete = false;
let ageComplete = false;
let carrerComplete = false;
let nickNameComplete = false;

let saveData = JSON.parse(window.localStorage.getItem("saveData")) || [];

// 새로고침에도 테이블 유지

function addTr(){

  const rows = saveData.map((data) => {

    const tr = document.createElement("tr");
    const tbody = document.createElement("tbody");

    tbody.innerHTML = `
    <tr data-id="${data.id}">
      <td class="name"><div> ${data.name} </div></td> 
      <td><div> ${data.age} </div></td>
      <td><div> ${data.carrer} </div></td> 
      <td><div> ${data.nickName} </div></td>
      <td><button onclick="modifyList()" data-id="${data.id}"> 수정 </button> <button onclick="deleteList()" data-id="${data.id}"> 삭제 </button></td>
    </tr>`;

    table.appendChild(tbody);

    return tr;
  });

  rows.map((tr) => table.appendChild(tr));
  
}

window.onload = function() { addTr(); }


// input 실시간 감지
idNum.addEventListener("input", function(){

  let userInfo = { id: idNum.value, name : name.value, age : age.value, carrer : carrer.value, nickName : nickName.value };

  const infoKey = Object.keys(userInfo).map(info => userInfo[info]);

  const idRepeat = saveData.filter(user => user.id === userInfo.id);

  if(idRepeat.length === 1){
    idAlert.innerText = "중복된 아이디입니다.";
    idComplete = false;
    complete();
  } else if ( idNum.value.length === 0 ){
    idAlert.innerText = "아이디가 비어있습니다."
    idComplete = false;
    complete();
  } else {
    idAlert.
    innerText = "";
    idComplete = true;
    complete();
  }

});

name.addEventListener("input", function(){

  if ( name.value.length === 0 ) {
    nameAlert.innerText = "이름이 비어있습니다.";
    nameComplete = false;
    complete();
  } else {
    nameAlert.innerText = "";
    nameComplete = true;
    complete();
  }
  
});

age.addEventListener("input", function(){

  if ( age.value.length === 0 ) {
    ageAlert.innerText = "나이가 비어있습니다.";
    ageComplete = false;
    complete();
  } else if ( Number(age.value) < 5 ){
    ageAlert.innerText = "5세 이상부터 가입이 가능합니다.";
    ageComplete = false;
    complete();
  } else if ( Number(age.value) >= 150 ){
    ageAlert.innerText = "150세 이상은 가입이 불가능합니다.";
    ageComplete = false;
    complete();
  } else {
    ageAlert.innerText = "";
    ageComplete = true;
    complete();
  }
  
});

carrer.addEventListener("input", function(){

  if ( carrer.value.length < 15 ) {
    carrerAlert.innerText = "경력 사항은 15자 이상 작성하여주세요.";
    carrerComplete = false;
    complete();
  } else {
    carrerAlert.innerText = "";
    carrerComplete = true;
    complete();
  }
  
});

nickName.addEventListener("input", function(){

  let userInfo = { id: idNum.value, name : name.value, age : age.value, carrer : carrer.value, nickName : nickName.value };

  const infoKey = Object.keys(userInfo).map(info => userInfo[info]);

  const nickRepeat = saveData.filter(user => user.nickName === userInfo.nickName);

  if ( nickName.value.length < 2 ){
    nickNameAlert.innerText = "별명은 최소 2자 이상 작성하여주세요.";
    nickNameComplete = false;
    complete();
  } else if ( nickRepeat.length === 1 ) {
    nickNameAlert.innerText = "중복된 별명입니다.";
    nickNameComplete = false;
    complete();
  } else {
    nickNameAlert.innerText = "";
    nickNameComplete = true;
    complete();
  }
  
});

// 활성화 시키기
function complete (){
  if( idComplete && nameComplete && ageComplete && carrerComplete && nickNameComplete ){
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}

//삭제 버튼
function deleteList(){

  console.log("...");

  const id = event.target.getAttribute("data-id");

  saveData = saveData.filter((user) => user.id !== id);

  window.localStorage.setItem("saveData", JSON.stringify(saveData));

  const targetRow = event.target.closest("tr");
  targetRow.remove();

}

//수정 버튼
function modifyList() {
  const id = event.target.getAttribute("data-id");
  const row = document.querySelector(`tr[data-id="${id}"]`);
  const cells = row.querySelectorAll("td div");

  // td의 div를 input으로 변환
  cells.forEach((cell, index) => {
    const input = document.createElement("input");
    input.value = cell.textContent.trim();
    input.setAttribute("data-index", index); // 각 td의 인덱스를 저장
    cell.replaceWith(input);
  });

  // 수정 버튼을 수정 완료 버튼으로 변경
  const modifyBtn = row.querySelector("button[onclick='modifyList()']");
  modifyBtn.setAttribute("onclick", "modifyCom(event)");
  modifyBtn.textContent = "수정 완료";
}

//수정 완료 버튼
function modifyCom(event) {
  const id = event.target.getAttribute("data-id");
  const row = document.querySelector(`tr[data-id="${id}"]`);
  const inputs = row.querySelectorAll("td input");

  // 수정된 값 가져오기
  const updatedData = {};
  inputs.forEach((input) => {
    const index = input.getAttribute("data-index");
    const value = input.value.trim();

    switch (Number(index)) {
      case 0: updatedData.name = value; break;
      case 1: updatedData.age = value; break;
      case 2: updatedData.carrer = value; break;
      case 3: updatedData.nickName = value; break;
    }

    // input을 다시 div로 변환
    const div = document.createElement("div");
    div.textContent = value;
    input.replaceWith(div);
  });

  // 로컬 스토리지 업데이트
  saveData = saveData.map((user) => {
    if (user.id === id) {
      return { ...user, ...updatedData };
    }
    return user;
  });

  window.localStorage.setItem("saveData", JSON.stringify(saveData));

  // 수정 완료 버튼을 다시 수정 버튼으로 변경
  const modifyBtn = row.querySelector("button[onclick='modifyCom(event)']");
  modifyBtn.setAttribute("onclick", "modifyList()");
  modifyBtn.textContent = "수정";
}

// 클릭 시 데이터 테이블에 추가
function data(){

  let userInfo = { id: idNum.value, name : name.value, age : age.value, carrer : carrer.value, nickName : nickName.value };
  
  const infoKey = Object.keys(userInfo).map(info => userInfo[info]);
  
  // 테이블 추가 함수 호출
  saveData.push(userInfo);
  window.localStorage.setItem("saveData", JSON.stringify(saveData));

  const tbody = document.createElement("tbody");
  const tr = document.createElement("tr");

  infoKey.shift(); // 아이디는 출력 안함

  // 테이블 데이터에 값 넣기
  tbody.innerHTML = `
  <tr data-id="${userInfo.id}">
    <td class="name"><div> ${infoKey[0]} </div></td> 
    <td><div> ${infoKey[1]} </div></td>
    <td><div> ${infoKey[2]} </div></td> 
    <td><div> ${infoKey[3]} </div></td>
    <td><button onclick="modifyList()" data-id="${userInfo.id}"> 수정 </button> <button onclick="deleteList()" data-id="${userInfo.id}"> 삭제 </button></td>
  </tr>`;

  table.appendChild(tbody);

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

  idComplete = false;
  nameComplete = false;
  ageComplete = false;
  carrerComplete = false;
  nickNameComplete = false;
  complete();
}