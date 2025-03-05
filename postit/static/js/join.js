// 카카오 앱 키
axios
  .get("/get-kakao-api-key")
  .then((response) => {
    const kakaoApiKey = response.data.kakaoApiKey;

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&libraries=services`;
    document.head.appendChild(script);
  })
  .catch((error) => {
    console.error("카카오 API 키 로드 오류:", error);
  });

function sample6_execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      var addr = ""; // 주소 변수
      var extraAddr = ""; // 참고항목 변수

      //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === "R") {
        // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
      if (data.userSelectedType === "R") {
        // 법정동명이 있을 경우 추가 (법정리는 제외)
        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝남
        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        // 건물명이 있고, 공동주택일 경우
        if (data.buildingName !== "" && data.apartment === "Y") {
          extraAddr +=
            extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
        }
        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열 생성
        if (extraAddr !== "") {
          extraAddr = " (" + extraAddr + ")";
        }
        document.getElementById("sample6_extraAddress").value = extraAddr;
      } else {
        document.getElementById("sample6_extraAddress").value = "";
      }

      document.getElementById("sample6_postcode").value = data.zonecode;
      document.getElementById("sample6_address").value = addr;
      // 커서를 상세주소 필드로 이동
      document.getElementById("sample6_detailAddress").focus();
    },
  }).open();
}

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
    })
    .catch((error) => {
      console.error("중복 확인 오류:", error);
      Swal.fire("서버 오류가 발생했습니다.");
    });
};

// 비밀번호 중복 확인
function passCheck() {
  const pass = document.getElementById("pass").value;
  const passCheck = document.getElementById("passCheck").value;
  const alret = document.getElementById("alret");

  if (pass === "" || passCheck === "") {
    Swal.fire({
      icon: "error",
      text: "비밀번호가 비어있습니다.",
    });
  } else {
    if (pass === passCheck) {
      alret.innerText = "동일한 비밀번호입니다.";
    } else {
      alret.innerText = "비밀번호가 다릅니다.";
    }
  }
}

// 회원가입 함수
const join = async () => {
  const email = document.getElementById("email").value;
  const username = document.querySelector("input[name='name']").value;
  const password = document.getElementById("pass").value;
  const passwordCheck = document.getElementById("passCheck").value;
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
  const birthDate = `${birthYear}${birthMonth}${birthDay}`;

  if (password !== passwordCheck) {
    alert("비밀번호가 일치하지 않습니다.");
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
      alert("회원가입이 완료되었습니다!");
      location.reload();
    }
  } catch (error) {
    alert("회원가입 실패");
    console.error("Error:", error);
  }
};

// 탈퇴 요청
const secessionUser = (id) => {};

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

// 생년월일 기본값일 경우
document.querySelector("form").addEventListener("submit", function (event) {
  let year = document.getElementById("birth-year").value;
  let month = document.getElementById("birth-month").value;
  let day = document.getElementById("birth-day").value;

  if (year === "출생 연도" || month === "월" || day === "일") {
    alert("출생 연도, 월, 일을 선택해주세요.");
    event.preventDefault();
  }
});
