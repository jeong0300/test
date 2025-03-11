const viewPost = (postId) => {
  if (!token) {
    alert("로그인 후 게시글을 볼 수 있습니다.");
    return;
  }

  axios
    .get(`/post/${postId}`, {
      withCredentials: true,
    })
    .then((response) => {
      window.location.href = `/post/${postId}`;
    })
    .catch((error) => {
      console.error("게시글 조회 실패:", error);
    });
};

async function getUserId() {
  if (!token) {
    alert("로그인 후 유저 정보를 가져올 수 있습니다.");
    return;
  }

  try {
    const response = await axios.get("/user/getUserId", {
      withCredentials: true,
    });
    const userId = response.data.id;

    return userId;
  } catch (error) {
    console.error("유저 ID를 가져오는 데 실패했습니다.", error);
  }
}
