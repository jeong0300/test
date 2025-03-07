window.addEventListener("scroll", function () {
  let header = document.querySelector(".header");
  if (window.scrollY > 0) {
    header.style.position = "fixed";
    header.style.backgroundColor = "rgba(74, 68, 113, 0.7)";
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

function moveUrl(url) {
  window.location.href = `/postit/${url}`;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

// 로그인, 로그아웃
document.addEventListener("DOMContentLoaded", async function () {
  const joinBox = document.querySelector(".joinBox");

  const loginBefore = document.querySelector(".loginBefore");
  const loginAfter = document.querySelector(".loginAfter");

  const token = localStorage.getItem("token");

  if (token) {
    loginBefore.style.display = "none";
    loginAfter.style.display = "block";

    try {
      const response = await axios(`/user/getUser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 기존 버튼들 삭제
      joinBox.innerHTML = "";

      // 유저 이름 추가
      const userNameElem = document.createElement("span");
      userNameElem.classList.add("white");
      userNameElem.textContent = `${response.data.username} 님`;
      userNameElem.style.marginRight = "10px";

      const logoutDiv = document.createElement("div");
      logoutDiv.classList.add("logout");

      const logoutBtn = document.createElement("a");
      logoutBtn.href = "#";
      logoutBtn.textContent = "로그아웃";

      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("token");
        window.location.href = "/";
      });

      logoutDiv.appendChild(logoutBtn);

      joinBox.appendChild(userNameElem);
      joinBox.appendChild(logoutDiv);
    } catch (error) {
      console.error(error);
    }
  } else {
    loginBefore.style.display = "block";
    loginAfter.style.display = "none";
  }
});
