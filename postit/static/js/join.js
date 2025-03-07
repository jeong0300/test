// 버튼 활성화, 비활성화 체크
let emailChecked = false;
let passwordsMatch = false;
let phoneChecked = false;
let allFieldsFilled = false;

const joinBtn = document.querySelector(".joinBtn");

const enableJoinButton = () => {
  if (emailChecked && passwordsMatch && allFieldsFilled && phoneChecked) {
    joinBtn.disabled = false;
  } else {
    joinBtn.disabled = true;
  }
};

// 모든 필드가 채워졌는지 확인
const checkAllFields = () => {
  const email = document.getElementById("email").value;
  const username = document.querySelector("input[name='name']").value;
  const pass = document.getElementById("pass").value;
  const passCheck = document.getElementById("passCheck").value;
  const areaCode = document.querySelector("input[name='areaCode']").value;
  const middleNumber = document.querySelector(
    "input[name='middleNumber']"
  ).value;
  const lastNumber = document.querySelector("input[name='lastNumber']").value;

  const birthYear = document.getElementById("birth-year").value;
  const birthMonth = document.getElementById("birth-month").value;
  const birthDay = document.getElementById("birth-day").value;

  if (
    email &&
    username &&
    pass &&
    passCheck &&
    areaCode &&
    middleNumber &&
    lastNumber &&
    birthYear !== "출생 연도" &&
    birthMonth !== "월" &&
    birthDay !== "일" &&
    emailChecked &&
    passwordsMatch
  ) {
    allFieldsFilled = true;
  } else {
    allFieldsFilled = false;
  }

  enableJoinButton();
};

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", checkAllFields);
});
document.querySelectorAll("select").forEach((select) => {
  select.addEventListener("change", checkAllFields);
});

// 아이디 중복 확인
const idCheck = () => {
  const email = document.getElementById("email").value;
  const data = { email };
  if (!email) {
    Swal.fire("아이디를 입력해 주세요.");
    return;
  }
  axios({
    method: "post",
    url: `/user/check`,
    data: data,
  })
    .then((response) => {
      Swal.fire(response.data.message);

      if (response.data.message === "사용 가능한 이메일입니다.") {
        emailChecked = true;
      } else {
        emailChecked = false;
      }
      checkAllFields();
    })
    .catch((error) => {
      console.error("중복 확인 오류:", error);
      Swal.fire("서버 오류가 발생했습니다.");
    });
};

// 비밀번호 일치
const pwCheck = () => {
  const password = document.getElementById("pass").value;
  const passwordCheck = document.getElementById("passCheck").value;
  const check = document.getElementById("alret");

  if (password === passwordCheck) {
    check.innerHTML = "<div class='green'>동일한 비밀번호입니다.</div>";
    passwordsMatch = true;
  } else {
    check.innerHTML = "<div class='red'>비밀번호가 다릅니다.</div>";
    passwordsMatch = false;
  }
  checkAllFields();
};

// 전화번호 중복 확인
function phoneCheck() {
  const areaCode = document.querySelector("input[name='areaCode']").value;
  const middleNumber = document.querySelector(
    "input[name='middleNumber']"
  ).value;
  const lastNumber = document.querySelector("input[name='lastNumber']").value;
  const phone = `${areaCode}-${middleNumber}-${lastNumber}`;

  const data = { phone };

  if (!areaCode || !middleNumber || !lastNumber) {
    Swal.fire("전화번호를 입력해 주세요.");
    return;
  }

  axios({
    method: "post",
    url: `/user/phoneCheck`,
    data: data,
  })
    .then((response) => {
      Swal.fire(response.data.message);

      if (response.data.message === "가입 가능한 전화번호입니다.") {
        phoneChecked = true;
      } else {
        phoneChecked = false;
      }
      checkAllFields();
    })
    .catch((error) => {
      console.error("중복 확인 오류:", error);
      Swal.fire("서버 오류가 발생했습니다.");
    });
}

// 회원가입 함수
const join = async () => {
  const email = document.getElementById("email").value;
  const username = document.querySelector("input[name='name']").value;
  const password = document.getElementById("pass").value;
  const passwordCheckText = document.getElementById("alret").innerText;
  const gender = document.querySelector("input[name='gender']:checked").value;

  const areaCode = document.querySelector("input[name='areaCode']").value;
  const middleNumber = document.querySelector(
    "input[name='middleNumber']"
  ).value;
  const lastNumber = document.querySelector("input[name='lastNumber']").value;
  const phone = `${areaCode}-${middleNumber}-${lastNumber}`;

  const birthYear = document.getElementById("birth-year").value;
  const birthMonth = document.getElementById("birth-month").value;
  const birthDay = document.getElementById("birth-day").value;
  const birthDate = `${birthYear}.${birthMonth}.${birthDay}`;

  if (passwordCheckText !== "동일한 비밀번호입니다.") {
    Swal.fire({
      icon: "error",
      title: "비밀번호 불일치",
      text: "비밀번호가 일치하지 않습니다. 다시 확인해 주세요.",
    });
    return;
  }
  try {
    const response = await axios.post("/user/addUser", {
      email,
      username,
      password,
      gender,
      phone,
      birthDate,
    });

    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "회원가입 성공하였습니다!",
        text: "로그인 후 이용하여 주세요.",
      }).then((res) => {
        window.location.href = "/postit/login";
      });
    }
  } catch (error) {
    alert("회원가입 실패");
    console.error("Error:", error);
  }
};

// 출생 연도
const year = document.querySelector("#birth-year");
isYearOptionExisted = false;
year.addEventListener("focus", function () {
  if (!isYearOptionExisted) {
    isYearOptionExisted = true;
    for (var i = 1940; i <= 2022; i++) {
      // option element 생성
      const YearOption = document.createElement("option");
      YearOption.setAttribute("value", i);
      YearOption.innerText = i;
      // year의 자식 요소로 추가
      this.appendChild(YearOption);
    }
  }
});

// 출생 달
const month = document.querySelector("#birth-month");

monthOption = false;
month.addEventListener("focus", function () {
  if (!monthOption) {
    monthOption = true;
    for (var i = 1; i <= 12; i++) {
      const monthOption = document.createElement("option");
      monthOption.setAttribute("value", i);
      monthOption.innerText = i;

      this.appendChild(monthOption);
    }
  }
});

// 출생 일
const day = document.querySelector("#birth-day");

dayOption = false;
day.addEventListener("focus", function () {
  if (!dayOption) {
    dayOption = true;
    for (var i = 1; i <= 31; i++) {
      const dayOption = document.createElement("option");
      dayOption.setAttribute("value", i);
      dayOption.innerText = i;

      this.appendChild(dayOption);
    }
  }
});

// 전화번호
function handleOnInput(el, maxlength) {
  if (el.value.length > maxlength) {
    el.value = el.value.substr(0, maxlength);
  }
}

// 비밀번호 유효성 검사
document.getElementById("pass").addEventListener("input", function () {
  const pass = document.getElementById("pass").value;
  const alertDiv = document.querySelector(".alret");

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

  if (!passwordRegex.test(pass)) {
    alertDiv.innerHTML =
      "<div class='red'>비밀번호는 8자 이상, 대소문자 하나씩 포함, 특수문자 하나 이상 포함해야 합니다.</div>";
  } else {
    alertDiv.innerHTML = "";
  }
});
