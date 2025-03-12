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

// 게시물 바로가기
const moveToPost = (postId) => {
  if (token) {
    axios
      .get(`/post/${postId}`, {
        withCredentials: true,
      })
      .then((response) => {
        window.location.href = `/post/${postId}`;
      })
      .catch((error) => {
        console.error("Error fetching post details:", error);
      });
  } else {
    window.location.href = "/postit/login";
  }
};

// async function heart(event) {
//   const iconImg = event.target;
//   const icon = iconImg.parentElement;
//   const att = icon.getAttribute("data-fav");
//   const productId = iconImg
//     .closest(".postCard")
//     .querySelector("img")
//     .getAttribute("data-id");
//   const userId = await getUserId();

//   const isLiked = att === "0";

//   iconImg.src = isLiked
//     ? "../static/images/favoriteFillIcon.png"
//     : "../static/images/favoriteIcon.png";
//   icon.setAttribute("data-fav", isLiked ? "1" : "0");

//   try {
//     await Promise.all([
//       // 유저 테이블 요청
//       axios.post("user/like", {
//         id: userId,
//         liked: isLiked,
//       }),
//       // 게시글 테이블 요청
//       axios.post("post/like", {
//         id: productId,
//         userId: userId,
//         liked: isLiked,
//       }),
//     ]);

//     const likeCountElement = icon.nextElementSibling;
//     let likeCount = parseInt(likeCountElement.textContent.split(" ")[0]);
//     likeCountElement.textContent = `${
//       isLiked ? likeCount + 1 : likeCount - 1
//     } 좋아요`;
//   } catch (error) {
//     console.error("좋아요 처리 중 오류 발생:", error);
//   }
// }

// // 좋아요 유지
// async function getUserLikes() {
//   const userId = await getUserId();
//   const response = await axios.get(`/user/likes?userId=${userId}`);
//   return response.data.likedPosts;
// }

// async function setLikeStatus() {
//   const likedPosts = await getUserLikes();
//   document.querySelectorAll(".favoriteIcon").forEach((icon) => {
//     const postId = icon.getAttribute("data-post-id");
//     if (likedPosts.includes(postId)) {
//       icon.setAttribute("data-fav", "1");
//       icon.querySelector("img").src = "../static/images/favoriteFillIcon.png";
//     }
//   });
// }

// document.addEventListener("DOMContentLoaded", setLikeStatus);

// 좋아요 토글
async function heart(event) {
  const iconImg = event.target;
  const icon = iconImg.parentElement;
  const postId = icon.getAttribute("data-id");

  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    // 서버에 좋아요 요청 (토글 기능)
    const response = await axios.post(
      `/like/${postId}`,
      {},
      {
        withCredentials: true,
      }
    );

    // 서버 응답에서 좋아요 상태 가져오기
    const isLiked = response.data.liked;

    // UI 업데이트
    iconImg.src = isLiked
      ? "../static/images/favoriteFillIcon.png"
      : "../static/images/favoriteIcon.png";
    icon.setAttribute("data-fav", isLiked ? "1" : "0");

    // 좋아요 개수 업데이트
    const likeCountElement = icon
      .closest(".post-info")
      .querySelector(".like-count");

    if (!likeCountElement) {
      console.warn("좋아요 개수를 표시할 요소가 없습니다!");
      return;
    }

    let likeCount = parseInt(likeCountElement.textContent.split(" ")[0]);
    likeCountElement.textContent = `${
      isLiked ? likeCount + 1 : likeCount - 1
    } `;
  } catch (error) {
    console.error("좋아요 처리 중 오류 발생:", error);
  }
}

// 좋아요한 상태 유지
async function setLikeStatus() {
  try {
    const response = await axios.get("/like/likedPosts", {
      withCredentials: true,
    });

    const likedPosts = response.data.likedPostIds || [];

    document.querySelectorAll(".favoriteIcon").forEach((icon) => {
      const postId = icon.getAttribute("data-id");

      if (likedPosts.includes(Number(postId))) {
        icon.setAttribute("data-fav", "1");
        icon.querySelector("img").src = "../static/images/favoriteFillIcon.png";
      } else {
        icon.setAttribute("data-fav", "0");
        icon.querySelector("img").src = "../static/images/favoriteIcon.png";
      }
    });
  } catch (err) {
    console.error("좋아요 상태 불러오기 실패:", err);
  }
}

// 좋아요 상태
window.onload = function () {
  setLikeStatus();
};

document.addEventListener("DOMContentLoaded", function () {
  const posts = document.querySelectorAll(".allPostContainer");

  const observerOptions = {
    root: null,
    threshold: 0.8,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  posts.forEach((post) => {
    observer.observe(post);
  });
});
