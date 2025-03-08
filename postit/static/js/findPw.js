// 버튼 활성화, 비활성화
let passwordsMatch = false;
let passwordsOkay = false;

const enableJoinButton = () => {
  const ClearBtn = document.querySelector(".checkBtn");

  if (passwordsMatch && passwordsOkay) {
    ClearBtn.removeAttribute("disabled");
  } else {
    ClearBtn.setAttribute("disabled", "true");
  }
};

// 비밀번호 확인
function passCheck() {
  const pass = document.getElementById("pass").value;
  const passCheckVal = document.getElementById("passCheck").value;
  const alret = document.getElementById("alretCheck");

  if (pass === "" || passCheckVal === "") {
    Swal.fire({
      icon: "error",
      text: "비밀번호가 비어있습니다.",
    });
  } else {
    if (pass === passCheckVal) {
      alret.innerHTML = "<div class='green'>동일한 비밀번호입니다.</div>";
      passwordsMatch = true;
    } else {
      alret.innerHTML = "<div class='red'>비밀번호가 다릅니다.</div>";
      passwordsMatch = false;
    }
    enableJoinButton();
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
    passwordsOkay = false;
  } else {
    alertDiv.innerHTML = "";
    passwordsOkay = true;
  }
  enableJoinButton();
});

// 비밃번호 변경
const pwChange = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;

  const data = { email, password };

  try {
    const res = await axios.put("/user/changePass", data);

    if (res.data.success) {
      Swal.fire({
        title: `비밀번호가 변경되었습니다.`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "확인",
      }).then((result) => {
        window.location.href = "/postit/login";
      });
    } else {
      Swal.fire({
        title: "비밀번호를 다시 변경하여 주세요",
        icon: "error",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "서버 오류 발생",
      icon: "error",
    });
    console.error("Error:", error);
  }
};

// 비밀번호 찾기
const idCheck = async () => {
  const email = document.getElementById("email").value;

  const data = { email };

  try {
    const res = await axios.post("/user/findPw", data);

    if (res.data.email) {
      Swal.fire({
        title: `새 비밀번호를 저장하시겠습니까`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "확인",
      }).then((result) => {
        if (result.isConfirmed) {
          if (result.isConfirmed) {
            Array.from(document.querySelectorAll(".passInput")).map((el) => {
              el.style.display = "flex";
            });

            const checkBtn = document.querySelector(".check-btn");

            checkBtn.style.display = "flex";

            checkBtn.innerHTML =
              "<div onclick='passCheck()'>비밀번호 확인</div>";

            document.querySelector(".loginBtn").innerHTML =
              '<div class="checkBtn" onclick="pwChange()" disabled>비밀번호 변경</div>';

            const ClearBtn = document.querySelector(".checkBtn");
            enableJoinButton(ClearBtn);
          }
        }
      });
    } else {
      Swal.fire({
        text: "해당 정보로 가입된 아이디가 없습니다.",
        icon: "error",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "서버 오류 발생",
      icon: "error",
    });
    console.error("Error:", error);
  }
};

// 페이지 이동
function moveUrl(url) {
  window.location.href = `/postit/${url}`;
}
