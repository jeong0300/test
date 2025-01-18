const data = [
  {
    name: "김철수",
    age: 14,
    carrers: [
      { title: "놀기" },
      { title: "먹기" },
      { title: "자기" },
      { title: "숨쉬기" },
    ],
    nickName: [
      { name: "김안철수" },
      { name: "김김안철수" },
      { name: "박터짐" },
    ],
  },
  {
    name: "영희",
    age: 35,
    carrers: [
      { title: "놀기" },
      { title: "자전거타기" },
      { title: "오렌지먹기" },
      { title: "사과부시기" },
    ],
    nickName: [
      { name: "김영희" },
      { name: "야생사자" },
      { name: "오올이" },
    ],
  },
  {
    name: "박광철",
    age: 20,
    carrers: [
      { title: "일수나가기" },
      { title: "돈빌려주기" },
      { title: "공무집행방해하기" },
      { title: "무면허운전하기" },
    ],
    nickName: [
      { name: "대홍력호랑이와사자두마리" },
      { name: "마포불주먹" },
      { name: "전설" },
      { name: "경찰의적" },
    ],
  },
];

const table = document.createElement("table");
table.classList.add("main");

const thead = document.createElement("thead");
const tbody = document.createElement("tbody");

table.appendChild(thead);
table.appendChild(tbody);

document.getElementById("main-wrap").appendChild(table);

// 테이블 구성하기
const headers = ["이름", "나이", "커리어", "별명"];
const headerRow = document.createElement("tr");

headers.map((header) => {
  const th = document.createElement("th");
  th.innerText = header;
  headerRow.appendChild(th);
});

thead.appendChild(headerRow);

data.map((person) => {

  const row = document.createElement("tr");

  [
    person.name,
    person.age,
    person.carrers.map((c) => c.title).join("\n"),
    person.nickName.map((n) => n.name).join("\n"),

  ].map((value) => {

    const td = document.createElement("td");
    td.innerText = value;
    row.appendChild(td);

  });

  // 경고창
  row.addEventListener("click", () => {
    const adult = person.age >= 20? "성인" : "미성년자";
    carrer = person.carrers.map((c) => c.title).join(", "),
    nick = person.nickName.map((n) => n.name).join(", "),

    alert(`해당하는 사람의 이름은 ${person.name}이고, 나이는 ${person.age}이며 ${adult}입니다. 커리어에는 ${carrer}가 있으며, 별명으로는 ${nick}이 있습니다.`);
  });

  tbody.appendChild(row);
});

// 미성년자
const kid = data.filter(person => person.age < 20);

kid.map(person => {
  const mergedRow = document.createElement("tr");
  const mergedCell = document.createElement("td");

  const carrer = person.carrers.map(c => c.title).join(", ");
  const nick = person.nickName.map(n => n.name).join(", ");

  mergedCell.setAttribute("colspan", "4");
  mergedCell.style.cursor = "default";
  mergedCell.innerHTML = `미성년자는 <b>${person.name}</b>이 있고, <br/> 그 사람의 커리어는 <b>${carrer}</b>가 있으며, <br/> 별명은 <b>${nick}</b>입니다.`;

  mergedRow.appendChild(mergedCell);
  tbody.appendChild(mergedRow);
});

// 성인
const adultData = data.filter(person => person.age >= 20);

const adultInfo = adultData.map(person => {
  const names = person.name;
  const carrer = person.carrers.map(c => c.title).join(", ");
  const nick = person.nickName.map(n => n.name).join(", ");
  
  return `<b>${names}</b>의 커리어는 <b>${carrer}</b>이고, <br/> 별명은 <b>${nick}</b>입니다. <br/>`;

}).join(" ");

const mergedRow = document.createElement("tr");
const mergedCell = document.createElement("td");

mergedCell.setAttribute("colspan", "4");
mergedCell.style.cursor = "default";

mergedCell.innerHTML = `성인은 <b>${adultData.map(person => person.name).join(", ")}</b>가 있고, <br/> ${adultInfo}`;

mergedRow.appendChild(mergedCell);
tbody.appendChild(mergedRow);

// 별명이 긴 사람
const maxNickLength = Math.max(...data.flatMap(person => person.nickName.map(n => n.name.length)));

const longNick = data.filter(person => 
  Math.max(...person.nickName.map(n => n.name.length)) === maxNickLength
);

longNick.map(person => {
  const mergedRow = document.createElement("tr");
  const mergedCell = document.createElement("td");

  const longestNick = person.nickName.filter(n => n.name.length === maxNickLength).map(n => n.name).join(", ");

  mergedCell.setAttribute("colspan", "4");
  mergedCell.style.cursor = "default";
  mergedCell.innerHTML = `가장 긴 별명은 <b>"${longestNick}"</b>이고, 이 별명을 가진 사람은 <b>${person.name}</b>입니다.`;

  mergedRow.appendChild(mergedCell);
  tbody.appendChild(mergedRow);
});