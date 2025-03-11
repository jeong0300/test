const deletePost = async (postId) => {
  if (confirm("정말 삭제하시겠습니까?")) {
    try {
      await axios.delete(`/post/delete/${postId}`);
      alert("게시글이 삭제되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("게시글 삭제 오류:", error);
      alert("삭제 실패. 다시 시도해주세요.");
    }
  }
};

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
