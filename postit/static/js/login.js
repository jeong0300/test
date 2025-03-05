const loginCheck = () => {
  const id = document.getElementById("id").value;
  const pass = document.getElementById("pass").value;
  const data = { id, pass };
  // 라우터 연결
  axios({
    method: "post",
    url: `/user/loginUser`,
    data: data,
  })
    .then((res) => {
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        axios
          .get("/")
          .then((response) => {
            if (response.status === 200) {
              window.location.href = "/";
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "페이지 로드 오류",
              icon: "error",
            });
          });
      } else {
        Swal.fire({
          title: res.data,
          icon: "error",
        });
      }
    })
    .catch((e) => {
      Swal.fire({
        title: "서버 오류 발생",
        icon: "error",
      });
    });
};

// 페이지 이동
function moveUrl(url) {
  window.location.href = `/postit/${url}`;
}
