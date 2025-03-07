const loginCheck = async () => {
  const username = document.getElementById("username").value;
  const areaCode = document.querySelector("input[name='areaCode']").value;
  const middleNumber = document.querySelector(
    "input[name='middleNumber']"
  ).value;
  const lastNumber = document.querySelector("input[name='lastNumber']").value;
  const phone = `${areaCode}-${middleNumber}-${lastNumber}`;

  const data = { username, phone };

  try {
    const res = await axios.post("/user/findId", data);

    if (res.data.email) {
      Swal.fire({
        title: `해당 아이디: ${res.data.email}`,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "해당 정보로 가입된 아이디가 없습니다.",
        icon: "error",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "서버 오류 발생",
      icon: "error",
    });
    console.error("Error:", error);
  }
};

// 페이지 이동
function moveUrl(url) {
  window.location.href = `/postit/${url}`;
}

// 전화번호
function handleOnInput(el, maxlength) {
  if (el.value.length > maxlength) {
    el.value = el.value.substr(0, maxlength);
  }
}
