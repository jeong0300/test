const token = localStorage.getItem("token");
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

// 페이지 로드 시 이미지 처리
window.onload = async function () {
  const preview = document.getElementById("preview");
  const label = document.querySelector(".image-upload span");
  const imageUpload = document.querySelector(".image-upload");
  const address_main = document.getElementById("address");
  const address_detail = document.getElementById("detailAddress");

  try {
    const response = await axios.get("/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

// 이미지 업로드 함수
async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  try {
    const res = await axios.post("/user/uploadImage", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.imageUrl) {
      return res.data.imageUrl;
    } else {
      alert("이미지 업로드 실패");
      return "";
    }
  } catch (error) {
    console.error("이미지 업로드 에러:", error);
    alert("이미지 업로드 중 오류 발생");
    return "";
  }
}

// 파일 선택 후 미리보기 & 업로드 기능
async function previewImage(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("preview");
  const label = document.querySelector(".image-upload span");
  const imageUpload = document.querySelector(".image-upload");

  if (file) {
    try {
      const uploadedImageUrl = await uploadImage(file);
      if (uploadedImageUrl) {
        preview.src = uploadedImageUrl;
        preview.style.display = "block";
        label.style.display = "none";
        imageUpload.style.border = "2px solid transparent";
        preview.dataset.imageUrl = uploadedImageUrl;
      } else {
        alert("이미지 업로드 실패");
      }
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생", error);
      alert("이미지 업로드 실패");
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    preview.style.display = "none";
    label.style.display = "block";
    imageUpload.style.border = "2px dashed #ccc";
  }
}

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
  const check = document.querySelector(".check").innerHTML;
  const alert = document.getElementById("alret").innerHTML;
  if (
    (check === "" && alert === "동일한 비밀번호입니다.") ||
    (check === "" && alert === "")
  ) {
    changeBtn.disabled = false;
  } else {
    changeBtn.disabled = true;
  }
}

// 정보 수정 함수
const changeInfo = async () => {
  const password = document.getElementById("pass").value;
  const address_main = document.getElementById("address").value;
  const address_detail = document.getElementById("detailAddress").value;
  const imageInput = document.getElementById("imageInput");

  const formData = new FormData();

  if (imageInput.files.length > 0) {
    console.log("이미지 추가");
    formData.append("image", imageInput.files[0]);
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
    console.log(formData);

    const response = await axios.put(`/user/info`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
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
};

// 탈퇴 요청
const deleteUser = () => {};
