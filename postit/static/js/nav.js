window.addEventListener("scroll", function () {
  let header = document.querySelector(".header");
  if (window.scrollY > 0) {
    header.style.position = "fixed";
    header.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
  } else {
    header.style.position = "absolute";
    header.style.backgroundColor = "transparent";
  }
});

function showAlert() {
  Swal.fire({
    icon: "error",
    title: "준비 중..",
    text: "아직 준비되지 않았습니다.",
  });
}

// 페이지 이동
function move(url) {
  axios
    .get(`/postit/${url}`)
    .then((res) => {
      window.location.href = `/postit/${url}`;
    })
    .catch((error) => {
      console.error(error);
    });
}
