/**
Copyright 2024 JasmineGraph Team
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

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
