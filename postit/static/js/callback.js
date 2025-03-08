window.onload = function () {
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const access_token = hashParams.get("access_token");
  const state = hashParams.get("state");

  if (access_token && state) {
    axios
      .get(`/user/callback?access_token=${access_token}&state=${state}`)
      .then((response) => {
        if (response.data.success) {
          window.opener.localStorage.setItem("token", response.data.token);

          setTimeout(() => {
            window.close();
            window.opener.location.href = "/";
          }, 500);
        } else {
          alert("로그인 실패: 서버에서 실패 응답");
        }
      })
      .catch((error) => {
        console.error("Error processing login callback:", error);
        alert("로그인 처리 중 오류가 발생했습니다.");
      });
  } else {
    alert("로그인 정보가 유효하지 않습니다.");
  }
};
