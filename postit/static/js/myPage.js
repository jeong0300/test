function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// 카카오 앱 키
axios
  .get("/get-kakao-api-key")
  .then((response) => {
    const kakaoApiKey = response.data.kakaoApiKey;

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&libraries=services`;
    document.head.appendChild(script);
  })
  .catch((error) => {
    console.error("카카오 API 키 로드 오류:", error);
  });

function sample6_execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      var addr = "";
      var extraAddr = "";

      if (data.userSelectedType === "R") {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === "R") {
        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        if (data.buildingName !== "" && data.apartment === "Y") {
          extraAddr +=
            extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
        }
        if (extraAddr !== "") {
          extraAddr = " (" + extraAddr + ")";
        }
        document.getElementById("sample6_extraAddress").value = extraAddr;
      } else {
        document.getElementById("sample6_extraAddress").value = "";
      }

      document.getElementById("sample6_postcode").value = data.zonecode;
      document.getElementById("address").value = addr;
      document.getElementById("detailAddress").focus();
    },
  }).open();
}

// 네이버, 카카오의 경우 비밀번호 변경 막기
document.addEventListener("DOMContentLoaded", async function () {
  const pass = document.getElementById("pass");
  const passCheck = document.getElementById("passCheck");

  if (token) {
    try {
      const response = await axios(`/user/getUser`, {
        method: "GET",
        withCredentials: true,
      });

      const user = response.data;

      if (!user.password || user.password === "" || user.provider === "naver") {
        pass.disabled = true;
        passCheck.disabled = true;
      } else {
        pass.disabled = false;
        passCheck.disabled = false;
      }
    } catch (error) {
      console.error(error);
    }
  }
});

// 페이지 로드 시 이미지 처리
window.onload = async function () {
  const preview = document.getElementById("preview");
  const label = document.querySelector(".image-upload span");
  const imageUpload = document.querySelector(".image-upload");
  const address_main = document.getElementById("address");
  const address_detail = document.getElementById("detailAddress");

  try {
    const response = await axios.get("/user/profile", {
      withCredentials: true,
    });
    const imageUrl = response.data.imageUrl;
    const mainAddr = response.data.address_main;
    const detailAddr = response.data.address_detail;

    address_main.value = mainAddr;
    address_detail.value = detailAddr;

    if (imageUrl && imageUrl.trim() !== "") {
      preview.src = `${imageUrl}`;
      preview.style.display = "block";
      label.style.display = "none";
      imageUpload.style.border = "2px solid transparent";
    } else {
      preview.src = "/static/images/profile.png";
      preview.style.display = "block";
      label.style.display = "none";
      imageUpload.style.border = "2px solid transparent";
    }
  } catch (error) {
    console.error("프로필 정보 로드 오류", error);
    preview.src = "/static/images/profile.png";
  }
};

// 파일 선택 후 미리보기
async function previewImage(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("preview");
  const label = document.querySelector(".image-upload span");
  const imageUpload = document.querySelector(".image-upload");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);

    preview.style.display = "block";
    label.style.display = "none";
    imageUpload.style.border = "none";
  } else {
    preview.style.display = "none";
    label.style.display = "none";
    imageUpload.style.border = "none";

    const defaultImageUrl =
      preview.dataset.imageUrl || "/static/images/profile.png";
    preview.src = defaultImageUrl;
    preview.style.display = "block";
  }
}

// 이미지 삭제
let imageDeleted = false;

const deleteProfile = () => {
  const preview = document.getElementById("preview");
  const imageInput = document.getElementById("imageInput");

  preview.src = "/static/images/profile.png";
  preview.dataset.imageUrl = "/static/images/profile.png";

  imageDeleted = true;

  // 파일 input 값 초기화
  imageInput.value = "";
  imageInput.type = "text";
  imageInput.type = "file";
};

const changeBtn = document.querySelector(".changeBtn");
// 비밀번호 일치
const pwCheck = () => {
  const password = document.getElementById("pass").value;
  const passwordCheck = document.getElementById("passCheck").value;
  const check = document.getElementById("alret");

  if (password === passwordCheck) {
    check.innerHTML = "<div class='green'>동일한 비밀번호입니다.</div>";
  } else {
    check.innerHTML = "<div class='red'>비밀번호가 다릅니다.</div>";
  }
  pwCheckCondition();
};

// 비밀번호 유효성 검사
document.getElementById("pass").addEventListener("input", function () {
  changeBtn.disabled = true;
  pwCheckCondition();

  const pass = document.getElementById("pass").value;
  const alertDiv = document.querySelector(".check");

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

  if (!passwordRegex.test(pass)) {
    alertDiv.innerHTML =
      "<div class='red'>비밀번호는 8자 이상, 대소문자 하나씩 포함, 특수문자 하나 이상 포함해야 합니다.</div>";
  } else {
    alertDiv.innerHTML = "";
  }
  pwCheckCondition();
});

// 버튼 활성화, 비활성화
function pwCheckCondition() {
  const check = document.querySelector(".check").textContent.trim();
  const alert = document.getElementById("alret").textContent.trim();

  console.log(alert);
  if (check === "" && alert === "동일한 비밀번호입니다.") {
    console.log("dd");
    changeBtn.disabled = false;
  } else {
    changeBtn.disabled = true;
  }
}

// 정보 수정 함수
async function changeInfo() {
  const password = document.getElementById("pass").value;
  const address_main = document.getElementById("address").value;
  const address_detail = document.getElementById("detailAddress").value;
  const imageInput = document.getElementById("imageInput");
  const preview = document.getElementById("preview");

  const formData = new FormData();

  if (imageDeleted) {
    formData.append("imageDeleted", true);
  } else if (imageInput.files.length > 0) {
    formData.append("image", imageInput.files[0]);
  } else if (
    preview.dataset.imageUrl &&
    preview.dataset.imageUrl !== "/static/images/profile.png"
  ) {
    formData.append("imageUrl", preview.dataset.imageUrl);
  }

  if (password.trim()) {
    formData.append("password", password);
  }
  if (address_main.trim()) {
    formData.append("address_main", address_main);
  }
  if (address_detail.trim()) {
    formData.append("address_detail", address_detail);
  }

  try {
    const response = await axios.put(`/user/info`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "수정되었습니다!",
      }).then(() => {
        window.location.href = "/";
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "수정 실패",
      text: "오류가 발생했습니다.",
    });
    console.error("Error:", error);
  }
}

// 탈퇴 요청
const deleteUser = async () => {
  const token = getCookie("token");
  // 탈퇴 확인
  const result = await Swal.fire({
    title: "탈퇴하시겠습니까?",
    text: "탈퇴 후 복구가 불가능합니다.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.delete("/user/deleteUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: "탈퇴가 완료되었습니다.",
        text: "메인으로 이동됩니다.",
        icon: "success",
        confirmButtonText: "확인",
      }).then(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
    } catch (error) {
      console.error("탈퇴 오류", error);
      Swal.fire({
        title: "탈퇴 실패",
        text: "문제가 발생했습니다. 다시 시도해 주세요.",
        icon: "error",
      });
    }
  } else {
    Swal.fire({
      title: "탈퇴가 취소되었습니다.",
      icon: "info",
    });
  }
};
