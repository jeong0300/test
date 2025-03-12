// 에디터
const editor = new toastui.Editor({
  el: document.querySelector("#detailEditor"),
  height: "300px",
  initialEditType: "wysiwyg",
  previewStyle: "vertical",
  initialValue: postContent, // 이 값을 에디터의 초기 값으로 사용

  hooks: {
    addImageBlobHook(blob, callback) {
      console.log(blob);
      console.log(callback);
    },
  },
});

const saveButton = document.querySelector(".saveBtn");

// 버튼 활성화, 비활성화
document.addEventListener("DOMContentLoaded", function () {
  const titleInput = document.querySelector("input[name='title']");
  const preview = document.getElementById("preview");

  // 글 내용 검증 함수
  const checkFormValidity = () => {
    const content = editor.getMarkdown();
    const isTitleValid = titleInput.value.trim().length > 0;
    const isContentValid =
      preview &&
      preview.style.display !== "none" &&
      content.trim().length >= 10;

    saveButton.disabled = !(isTitleValid && isContentValid);
  };

  titleInput.addEventListener("input", checkFormValidity);
  editor.on("change", checkFormValidity);

  checkFormValidity();
});

// 사용자 찾기
const getUserId = async (token) => {
  if (!token) return null;
  try {
    const response = await axios.get("/user/getUserId", {
      withCredentials: true,
    });

    if (response.status === 200) {
      return response.data.id;
    } else {
      console.error("사용자 ID 가져오기 실패");
      return null;
    }
  } catch (error) {
    console.error("토큰 검증 실패:", error);
    return null;
  }
};

// 이미지 업로드
async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post("/user/uploadImage", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.imageUrl) {
      const preview = document.getElementById("preview");
      preview.dataset.imageUrl = res.data.imageUrl;

      return res.data.imageUrl;
    } else {
      return "";
    }
  } catch (error) {
    return "";
  }
}

// 파일 선택 후 미리보기 & 업로드 기능
async function previewImage(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("preview");
  const label = document.querySelector(".image-upload span");
  const imageUpload = document.querySelector(".image-upload");

  // 이미지 업로드 후 URL 받아오기
  let uploadedImageUrl = "";
  try {
    uploadedImageUrl = await uploadImage(file);
  } catch (error) {
    return;
  }

  // 이미지 미리보기
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;

      const img = new Image();
      img.onload = function () {
        preview.style.display = "block";
        imageUpload.style.border = "none";
      };
      img.onerror = function () {
        return;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    preview.style.display = "block";
    imageUpload.style.border = "none";
  }

  if (uploadedImageUrl) {
    preview.src = uploadedImageUrl;
  }
}

// 글 저장
const addWrite = async (id) => {
  try {
    const userId = await getUserId(token);

    const response = await axios.put(`/post/delete/${id}`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "글이 정상적으로 삭제되었습니다!",
      }).then(() => {
        window.location.href = "/";
      });
    }
  } catch (error) {
    alert("글 삭제 실패");
    console.error("Error:", error);
  }
};
