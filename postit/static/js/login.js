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
