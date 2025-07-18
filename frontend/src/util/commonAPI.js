import apiClient from "./api-client";
import Swal from "sweetalert2";

export async function fetchApis(url, data, type, authReq = false) {
  if (!localStorage.getItem("token") && authReq) {
    console.log("token not found", router);
    await new Promise(function (resolve, reject) {
      setTimeout(resolve, 3000);
    });
    router.push("/");
    return { hasError: true, status: "warning", message: "Session expired. Please login to continue", data: null };
  }
  if (authReq) {
    data.tocken = localStorage.getItem("token");
  }
  let response = await apiClient[type](url, data);
  // console.log("response in common function", response.data);
  let result = response.data;
  if (result.hasError) {
    return {
      status: "error",
      hasError: result.hasError,
      message: result.message,
      data: null,
    };
  }
  return {
    status: "success",
    hasError: result.hasError,
    message: result.message,
    data: result.data,
  };
}

export async function commonAlertForSave(message = "") {
  let response = false;
  await Swal.fire({
    title: "Are you sure?",
    text: `Do you want ${message} this`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Yes, ${message} it!`,
  }).then((result) => {
    response = result.isConfirmed;
  });
  // console.log("response in common swal", response);
  return response;
}
