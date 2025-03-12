document.addEventListener("DOMContentLoaded", function () {
  const postActions = document.querySelector(".post-actions");
  const currentUserId = postActions.dataset.currentUserId;
  const postId = postActions.dataset.postId;

  if (currentUserId === postId) {
    postActions.style.display = "block";
  } else {
    postActions.style.display = "none";
  }
});

function moveToModify(postId) {
  window.location.href = `/modify/${postId}`;
}

async function deletePost(id) {
  const result = await Swal.fire({
    title: "삭제하시겠습니까?",
    text: "게시글 삭제 후 복구가 불가능합니다.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.delete(`/post/delete/${id}`);

      Swal.fire({
        title: "게시글 삭제 완료되었습니다.",
        text: "메인으로 이동됩니다.",
        icon: "success",
        confirmButtonText: "확인",
      }).then(() => {
        window.location.href = "/";
      });
    } catch (error) {
      console.error("삭제 오류", error);
      Swal.fire({
        title: "삭제 실패",
        text: "문제가 발생했습니다. 다시 시도해 주세요.",
        icon: "error",
      });
    }
  } else {
    Swal.fire({
      title: "게시글 삭제가 취소되었습니다.",
      icon: "info",
    });
  }
}
