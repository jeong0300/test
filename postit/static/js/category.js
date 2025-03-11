// 게시글 보기
const viewPost = (postId) => {
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

async function heart(event) {
  const iconImg = event.target;
  const icon = iconImg.parentElement;
  const att = icon.getAttribute("data-fav");
  const productId = iconImg
    .closest(".postCard")
    .querySelector("img")
    .getAttribute("data-id");
  const userId = await getUserId();

  const isLiked = att === "0";

  iconImg.src = isLiked
    ? "../static/images/favoriteFillIcon.png"
    : "../static/images/favoriteIcon.png";
  icon.setAttribute("data-fav", isLiked ? "1" : "0");

  try {
    await Promise.all([
      // 유저 테이블 요청
      axios.post("user/like", {
        id: userId,
        liked: isLiked,
      }),
      // 게시글 테이블 요청
      axios.post("post/like", {
        id: productId,
        userId: userId,
        liked: isLiked,
      }),
    ]);

    const likeCountElement = icon.nextElementSibling;
    let likeCount = parseInt(likeCountElement.textContent.split(" ")[0]);
    likeCountElement.textContent = `${
      isLiked ? likeCount + 1 : likeCount - 1
    } 좋아요`;
  } catch (error) {
    console.error("좋아요 처리 중 오류 발생:", error);
  }
}

// 좋아요 유지
async function getUserLikes() {
  const userId = await getUserId();
  const response = await axios.get(`/user/likes?userId=${userId}`);
  return response.data.likedPosts;
}

async function setLikeStatus() {
  const likedPosts = await getUserLikes();
  document.querySelectorAll(".favoriteIcon").forEach((icon) => {
    const postId = icon.getAttribute("data-post-id");
    if (likedPosts.includes(postId)) {
      icon.setAttribute("data-fav", "1");
      icon.querySelector("img").src = "../static/images/favoriteFillIcon.png";
    }
  });
}

document.addEventListener("DOMContentLoaded", setLikeStatus);
