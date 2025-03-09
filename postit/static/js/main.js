const token = localStorage.getItem("token");

function moveWrite(url) {
  if (token) {
    axios
      .get(`/postit/${url}`)
      .then((res) => {
        window.location.href = `/postit/${url}`;
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    window.location.href = "/postit/login";
  }
}

function moveCategory(url) {
  if (token) {
    axios
      .get(`/postit/category`)
      .then((res) => {
        window.location.href = `/postit/category`;
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    window.location.href = "/postit/login";
  }
}
