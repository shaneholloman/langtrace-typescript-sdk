/*
 * Copyright (c) 2024 Scale3 Labs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 * @param obj record<string, any>
 * @param path dot separated string path
 * @returns value at the path in the object
 */
export function getValueFromPath (obj: Record<string, any>, path: string): any {
  if (path === undefined) {
    return undefined
  }
  return path.split('.').reduce((o, p) => (o !== undefined ? o[p] : undefined), obj)
}
/**
 *
 * @param obj record<string, any>
 * @param path dot separated string path
 * @param value value to set at the path in the object
 * @returns void
 */
export function setValueFromPath (obj: any, path: string, value: any): void {
  if (path === undefined) {
    return undefined
  }
  const keys = path.split('.')
  const lastKey = keys.pop()
  const deepObj = keys.reduce((o, p) => (o[p] = o[p] ?? {}), obj)
  if (lastKey !== undefined) {
    deepObj[lastKey] = value
  }
}
/**
 * This function is used to convert an object to a string. It filters out functions and keys starting with '_' as they are considered private.
 * @param obj any
 * @returns string
 */
export function stringify (obj: any): string {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value !== 'function' && !key.startsWith('_')) {
      return value
    }
    return undefined
  }, 2)
}
