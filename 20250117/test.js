
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
const headTr = document.createElement("tr");

document.getElementById("main-wrap").appendChild(table);

// th 구성
const thead = ["이름", "나이", "커리어", "별명"];

thead.map(head => {
  const th = document.createElement("th");
  th.innerText = head;
  headTr.appendChild(th);
});

table.appendChild(headTr);

// 데이터 넣기
data.map(person => {
  const tr = document.createElement("tr");

  const carrer = person.carrers.map(carrer => carrer.title).join("\n");
  const nickname = person.nickName.map(nick => nick.name).join("\n");

  // console.log(carrer);

  const infos = [ person.name, person.age, carrer, nickname ];

  infos.map(info => {
    const td = document.createElement("td");
    td.innerText = info;
    tr.appendChild(td);
  });

  tr.addEventListener("click", () => {
    const adult = person.age >= 20 ? "성인" : "미성년자";
    const carrers = person.carrers.map(carrer => carrer.title).join(", ");
    const nicknames = person.nickName.map(nick => nick.name).join(", ");

    // console.log(carrers);
    // console.log(nicknames);

    alert(`해당하는 사람의 이름은 "${person.name}"이고, 나이는 "${person.age}세"이며, "${adult}"입니다. 커리어에는 "${carrers}"가 있으며, 별명으로는 "${nicknames}"이 있습니다.`);
  });

  table.appendChild(tr);
  
});

// 미성년자만 가져오기

const kid = data.filter( k => k.age < 20 );

kid.map(k => {
  const mergeTr = document.createElement("tr");
  const mergeTd = document.createElement("td");
  mergeTd.setAttribute("colspan", "4");
  const carrer = k.carrers.map(carrer => carrer.title).join(", ");
  const nickname = k.nickName.map(nick => nick.name).join(", ");

  // console.log(carrer2);

  mergeTd.innerHTML = `미성년자는 "${k.name}"이 있고, <br/> 그 사람의 커리어는 "${carrer}"가 있으며, <br/> 별명은 "${nickname}"입니다.`;

  mergeTr.appendChild(mergeTd);
  table.appendChild(mergeTr);
});

// console.log(kid);

// 성인만 가져오기

const adults = data.filter( ad => ad.age >=20 );

const adData = adults.map(aname => {
  const name = aname.name;
  const carrer = aname.carrers.map(carrer => carrer.title).join(", ");
  const nickname = aname.nickName.map(nick => nick.name).join(", ");

  // console.log(name);

  return `"${name}"의 커리어는 "${carrer}"이고, <br> 별명은 ${nickname}입니다. <br/>`
});


const mergeTr = document.createElement("tr");
const mergeTd = document.createElement("td");
const adults1 = adults.map( ad => ad.name ).join(", ");
mergeTd.setAttribute("colspan", "4");

mergeTd.innerHTML = `성인은 "${adults1}"이 있고, ${adData.join("")}`;

mergeTr.appendChild(mergeTd);
table.appendChild(mergeTr);

// 가장 긴 별명 가져오기
let longestNick = "";
let longestPerson = "";

data.map(person => {
  person.nickName.map(nick => {
    if (nick.name.length > longestNick.length) {
      longestNick = nick.name;
      longestPerson = person.name;
    }
  });
});

const mergeTr2 = document.createElement("tr");
const mergeTd2 = document.createElement("td");
mergeTd2.setAttribute("colspan", "4");
mergeTd2.innerHTML = `가장 긴 별명은 "${longestNick}"이고, 이 별명을 가진 사람은 "${longestPerson}"입니다.`;

mergeTr2.appendChild(mergeTd2);
table.appendChild(mergeTr2);