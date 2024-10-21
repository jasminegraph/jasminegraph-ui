import axios from "axios";

export async function getAllUsers() {
  try {
    const result = await axios({
      method: "get",
      url: `/backend/users`,
    }).then((res) => res.data);
    return {
      data: result.data,
    };
  } catch (err) {
    return Promise.reject();
  }
}

export async function getUserByIDs(ids: string[]) {
  try {
    const result = await axios({
      method: "post",
      url: `/backend/users/ids`,
      data: {
        ids,
      },
    }).then((res) => res.data);
    return {
      data: result.data,
    };
  } catch (err) {
    return Promise.reject();
  }
}