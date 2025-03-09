// 네이버 버튼 커스텀
document.addEventListener("DOMContentLoaded", function () {
  const targetNode = document.getElementById("naver_id_login");

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      const img = document.querySelector("#naver_id_login a img");
      if (img) {
        img.src = "/static/images/naver_login.png";
        img.style.width = "150px";
        observer.disconnect();
      }
    });
  });

  const config = { childList: true, subtree: true };

  observer.observe(targetNode, config);
});

// 로그인
const loginCheck = () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("pass").value;

  if (!email || !pass) {
    Swal.fire({
      text: "아이디와 비밀번호를 모두 입력하세요.",
      icon: "error",
    });
    return;
  }

  const data = { email, pass };

  axios
    .post("/user/loginUser", data)
    .then((res) => {
      if (res.status === 200 && res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/";
      } else {
        Swal.fire({
          text: res.data.message || "잘못된 로그인 정보입니다.",
          icon: "error",
        });
      }
    })
    .catch((error) => {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : "서버 오류가 발생했습니다.";
      Swal.fire({
        title: "로그인 실패",
        text: message,
        icon: "error",
      });
    });
};

// 페이지 이동
function moveUrl(url) {
  window.location.href = `/postit/${url}`;
}

// 네이버 로그인
function initializeNaverLogin() {
  axios
    .get("/user/naver")
    .then((response) => {
      const config = response.data;

      var naver_id_login = new window.naver_id_login(
        config.clientId,
        config.callbackUrl
      );
      var state = naver_id_login.getUniqState();
      naver_id_login.setButton("white", 2, 40);
      naver_id_login.setDomain(config.serviceUrl);
      naver_id_login.setState(state);
      naver_id_login.setPopup();
      naver_id_login.init_naver_id_login();
    })
    .catch((error) => {
      console.error("Error fetching Naver config:", error);
    });
}

// 카카오 로그인
axios
  .get("/user/kakao-key")
  .then((response) => {
    Kakao.init(response.data.key);
  })
  .catch((error) => {
    console.error("카카오 API 키 로드 실패:", error);
  });

function loginWithKakao() {
  axios
    .get("/user/kakao")
    .then((res) => {
      const { clientId, redirectUri } = res.data;

      if (!clientId || !redirectUri) {
        throw new Error("clientId 또는 redirectUri가 응답에 없습니다.");
      }

      const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code`;

      window.location.href = kakaoLoginUrl;
    })
    .catch((err) => {
      console.error("카카오 Redirect URI 불러오기 실패:", err);
      alert("카카오 로그인을 진행할 수 없습니다. 다시 시도해주세요.");
    });
}

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (token) {
    localStorage.setItem("token", token);

    window.location.href = "/";
  }
};
