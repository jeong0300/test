function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const token = getCookie("token");

window.addEventListener("scroll", function () {
  let header = document.querySelector(".header");
  if (window.scrollY > 0) {
    header.style.position = "fixed";
    header.style.backgroundColor = "rgb(74, 68, 113)";
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

function moveUrl(url) {
  window.location.href = `/postit/${url}`;
}

// 내가 쓴 글 보기
const goToMyPost = async (url) => {
  try {
    const idResponse = await axios.get("/user/getUserId", {
      withCredentials: true,
    });

    const userId = idResponse.data.id;

    if (url === "myPost") {
      window.location.href = `/post/myPost/${userId}`;
    } else {
      window.location.href = `/postit/${url}`;
    }
  } catch (error) {
    console.error("사용자 ID 가져오기 실패:", error);
  }
};

// 즐겨찾기 페이지로 이동
const goToMyFavorite = async () => {

  try {
    const idResponse = await axios.get("/user/getUserId", {
      withCredentials: true,
    });

    if (!idResponse.data.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 즐겨찾기 페이지로 이동
    window.location.href = "/like/favoritePosts";
  } catch (error) {
    console.error("사용자 ID 가져오기 실패:", error);
    alert("로그인이 필요합니다.");
  }

};

function logout() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "/";
}

// 로그인, 로그아웃
document.addEventListener("DOMContentLoaded", async function () {
  const joinBox = document.querySelector(".joinBox");
  const loginBefore = document.querySelector(".loginBefore");
  const loginAfter = document.querySelector(".loginAfter");

  if (token) {
    loginBefore.style.display = "none";
    loginAfter.style.display = "block";
    try {
      const response = await axios.get("/user/getUser", {
        withCredentials: true,
      });

      // 기존 버튼들 삭제
      joinBox.innerHTML = "";

      // 유저 이름 추가
      const userNameElem = document.createElement("span");
      userNameElem.classList.add("white");
      userNameElem.textContent = `${response.data.username} 님`;

      const logoutDiv = document.createElement("div");
      logoutDiv.classList.add("logout");

      const logoutBtn = document.createElement("a");
      logoutBtn.href = "#";
      logoutBtn.textContent = "로그아웃";

      logoutBtn.addEventListener("click", function () {
        document.cookie = "token=; Max-Age=0; path=/";
        window.location.href = "/";
      });

      logoutDiv.appendChild(logoutBtn);
      joinBox.appendChild(userNameElem);
      joinBox.appendChild(logoutDiv);
    } catch (error) {
      console.error("사용자 정보 가져오기 실패:", error);
    }
  } else {
    loginBefore.style.display = "block";
    loginAfter.style.display = "none";
  }
});

// 카테고리별 게시글로 이동하기
const moveToCategory = (categoryId) => {
  if (token) {
    window.location.href = `/category/${categoryId}`;
  } else {
    window.location.href = "/postit/login";
  }
};
