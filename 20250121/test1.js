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
// 로컬 스토리지
let saveData = JSON.parse(window.localStorage.getItem("saveData")) || [];

// input 실시간 감지
idNum.addEventListener("input", function(){

  let userInfo = { id: idNum.value, name : name.value, age : age.value, carrer : carrer.value, nickName : nickName.value };

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

//삭제 버튼
function deleteList(){

  const id = event.target.getAttribute("data-id");

  saveData = saveData.filter((user) => user.id !== id);

  window.localStorage.setItem("saveData", JSON.stringify(saveData));

  const targetRow = event.target.closest("tr");
  targetRow.remove();

}

//수정 버튼
function modifyList() {
  const btn = event.target;
  const row = btn.closest('tr');
  const id = row.getAttribute("data-id");
  const cells = row.querySelectorAll("td div");
  const user = saveData.find(user => user.id === id);

  // console.log(user);

  const name = user.name;
  const age = user.age;
  const carrer = user.carrer;
  const nickName = user.nickName;

  // 기존 값으로 input을 생성하고 div를 숨김
  cells[0].innerHTML = `<input id='name' class='input-field edited' value=${name} /><div class="show"></div>`;
  cells[1].innerHTML = `<input id='age' class='input-field edited' type='number' value=${age} /><div class="show"></div>`;
  cells[2].innerHTML = `<input id='carrer' class='input-field edited' value=${carrer} /><div class="show"></div>`;
  cells[3].innerHTML = `<input id='nickName' class='input-field edited' value=${nickName} /><div class="show"></div>`;

  btn.innerText = "수정완료";
  btn.setAttribute("onclick", "modifyCom()");

  const nameInput = cells[0].querySelector('input');
  const ageInput = cells[1].querySelector('input');
  const carrerInput = cells[2].querySelector('input');
  const nickInput = cells[3].querySelector('input');

  nameInput.addEventListener('input', modifyInput);
  ageInput.addEventListener('input', modifyInput);
  carrerInput.addEventListener('input', modifyInput);
  nickInput.addEventListener('input', modifyNickNameInput);
}

// 수정 버튼 -> input 실시간 감지
function modifyInput() {
  const inputTarget = event.target;
  const alertDiv = inputTarget.nextElementSibling;

  // console.log(inputTarget);
  
  if (inputTarget.id === "name" && inputTarget.value.length === 0) {
    alertDiv.innerText = "이름이 비어있습니다.";
  } else if (inputTarget.id === "age") {

    if (inputTarget.value.length === 0) {
      alertDiv.innerText = "나이가 비어있습니다.";
    } else if (Number(inputTarget.value) < 5) {
      alertDiv.innerText = "5세 이상부터 가입이 가능합니다.";
    } else if (Number(inputTarget.value) >= 150) {
      alertDiv.innerText = "150세 이상은 가입이 불가능합니다.";
    } else {
      alertDiv.innerText = "";
    }

  } else if (inputTarget.id === "carrer" && inputTarget.value.length < 15) {
    alertDiv.innerText = "경력 사항은 15자 이상 작성하여주세요.";
  } else {

    alertDiv.innerText = "";
    
  }
}

function modifyNickNameInput() {
  const inputTarget = event.target;
  const alertDiv = inputTarget.nextElementSibling;

  if (inputTarget.value.length < 2) {
    alertDiv.innerText = "별명은 최소 2자 이상 작성하여주세요.";
  } else {
    const userInfo = { id: idNum.value, name: name.value, age: age.value, carrer: carrer.value, nickName: inputTarget.value };

    const nickRepeat = saveData.filter(user => user.nickName === userInfo.nickName && user.id !== userInfo.id);

    if (nickRepeat.length === 1) {
      alertDiv.innerText = "중복된 별명입니다.";
    } else {
      alertDiv.innerText = "";
    }
  }
}

//수정 완료 버튼
function modifyCom() {
  const btn = event.target;
  const row = btn.closest('tr');
  const id = row.getAttribute("data-id");
  const inputs = row.querySelectorAll("td div");
  const user = saveData.find(user => user.id === id);

  console.log(inputs);

  window.localStorage.setItem("saveData", JSON.stringify(saveData));

  btn.innerText = "수정";
  btn.setAttribute("onclick", "modifyList()");
}

// 활성화 시키기
function complete (){
  if( idComplete && nameComplete && ageComplete && carrerComplete && nickNameComplete ){
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}

// 클릭 시 데이터 테이블에 추가
function data(){

  let userInfo = { id: idNum.value, name : name.value, age : age.value, carrer : carrer.value, nickName : nickName.value };
  
  const infoKey = Object.keys(userInfo).map(info => userInfo[info]);
  
  // 테이블 추가 후 저장
  saveData.push(userInfo);
  window.localStorage.setItem("saveData", JSON.stringify(saveData));

  const tbody = document.createElement("tbody");
  const tr = document.createElement("tr");

  infoKey.shift(); // 아이디는 출력 안함

  // 테이블 데이터에 값 넣기
  tbody.innerHTML = `
  <tr data-id="${userInfo.id}">
    <td><div> ${infoKey[0]} </div></td> 
    <td><div> ${infoKey[1]} </div></td>
    <td><div> ${infoKey[2]} </div></td> 
    <td><div> ${infoKey[3]} </div></td>
    <td><button onclick="modifyList()"> 수정 </button> <button onclick="deleteList()" data-id="${userInfo.id}"> 삭제 </button></td>
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

// 새로고침에도 테이블 유지
function addTr(){

  const rows = saveData.map((data) => {

    const tr = document.createElement("tr");
    const tbody = document.createElement("tbody");

    tbody.innerHTML = `
    <tr data-id="${data.id}">
      <td><div> ${data.name} </div></td> 
      <td><div> ${data.age} </div></td>
      <td><div> ${data.carrer} </div></td> 
      <td><div> ${data.nickName} </div></td>
      <td><button onclick="modifyList()"> 수정 </button> <button onclick="deleteList()" data-id="${data.id}"> 삭제 </button></td>
    </tr>`;

    table.appendChild(tbody);

    return tr;
  });

  rows.map((tr) => table.appendChild(tr));
  
}

window.onload = function() { addTr(); }