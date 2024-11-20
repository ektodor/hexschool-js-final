import Swal from "sweetalert2";
// loading 效果
export const loading = (title) => {
  Swal.fire({
    title,
    text: "請稍等!!!",
    didOpen: () => {
      Swal.showLoading();
    },
  });
};
