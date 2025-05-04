/**
Copyright 2025 JasmineGraph Team
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

const convertToJSON = (jsonString: string) => {
  try {
    const jsonObject = JSON.parse(jsonString);  // Convert string to JSON
    return jsonObject;  // Send the parsed JSON back to the client
  } catch (error) {
    return { error: 'Invalid JSON string' };
  }
}