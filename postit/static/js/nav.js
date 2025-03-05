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

function moveUrl(url) {
  window.location.href = `/postit/${url}`;
}

// 로그인, 로그아웃
document.addEventListener("DOMContentLoaded", async function () {
  const joinBox = document.querySelector(".joinBox");

  const loginBefore = document.querySelector(".loginBefore");
  const loginAfter = document.querySelector(".loginAfter");

  const token = localStorage.getItem("token");

  // 토글 안 아이콘들
  if (token) {
    loginBefore.style.display = "block";
    loginAfter.style.display = "none";
  } else {
    loginBefore.style.display = "none";
    loginAfter.style.display = "block";
  }

  // 네비게이션 로그인, 로그아웃 버튼
  if (token) {
    try {
      // 토큰 검증 따로 만드는 게 좋을 것 같음
      const response = await axios("/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("유저 정보를 불러올 수 없음");
      }

      const { username } = await response.json();

      // 기존 버튼들 삭제
      joinBox.innerHTML = "";

      // 유저 이름 추가
      const userNameElem = document.createElement("span");
      userNameElem.textContent = `${username} 님`;
      userNameElem.style.marginRight = "10px";

      const logoutDiv = document.createElement("div");
      logoutDiv.classList.add("join");
      const logoutBtn = document.createElement("a");
      logoutBtn.href = "#";
      logoutBtn.textContent = "로그아웃";

      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("token");
        location.reload();
      });

      joinBox.appendChild(userNameElem);
      joinBox.appendChild(logoutBtn);
    } catch (error) {
      console.error(error);
    }
  }
});
