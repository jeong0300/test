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
    .post("/user/loginUser", data, { withCredentials: true })
    .then((res) => {
      if (res.status === 200) {
        const token = res.data.token;
        document.cookie = `token=${token}; path=/; max-age=${
          24 * 60 * 60
        }; secure; SameSite=Strict`;
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
document
  .getElementById("naverLoginBtn")
  .addEventListener("click", async function () {
    await axios
      .get("/user/naver", { withCredentials: true })
      .then((response) => {
        const { clientId, callbackUrl, state } = response.data;

        const loginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${callbackUrl}&state=${state}`;

        window.location.href = loginUrl;
      })
      .catch((error) => {
        console.error("네이버 로그인 설정 불러오기 실패:", error);
        alert("네이버 로그인 설정을 불러오는 중 문제가 발생했습니다.");
      });
  });

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
    .get("/user/kakao", { withCredentials: true })
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
    document.cookie = `token=${token}; path=/; max-age=${
      24 * 60 * 60
    }; secure; SameSite=Strict`;
    window.location.href = "/";
  }
};
