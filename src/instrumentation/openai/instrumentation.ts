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

import { diag } from '@opentelemetry/api'
import {
  InstrumentationBase,
  InstrumentationNodeModuleDefinition,
  isWrapped
} from '@opentelemetry/instrumentation'
import type { OpenAI } from 'openai'
import { chatCompletionCreate, embeddingsCreate, imagesGenerate } from '@langtrace-instrumentation/openai/patch'
// eslint-disable-next-line no-restricted-imports
import { version, name } from '../../package.json'
class OpenAIInstrumentation extends InstrumentationBase<typeof OpenAI> {
  constructor () {
    super(name, version)
  }

  public manualPatch (openai: typeof OpenAI): void {
    diag.debug('Manually patching openai')
    this._patch(openai)
  }

  init (): Array<InstrumentationNodeModuleDefinition<typeof OpenAI>> {
    const module = new InstrumentationNodeModuleDefinition<typeof OpenAI>(
      'openai',
      ['>=4.26.1 <6.0.0'],
      (moduleExports, moduleVersion) => {
        diag.debug(`Patching OpenAI SDK version ${moduleVersion}`)
        this._patch(moduleExports, moduleVersion as string)
        return moduleExports
      },
      (moduleExports, moduleVersion) => {
        diag.debug(`Unpatching OpenAI SDK version ${moduleVersion}`)
        if (moduleExports !== undefined) {
          this._unpatch(moduleExports)
        }
      }
    )

    return [module]
  }

  private _patch (openai: typeof OpenAI, moduleVersion?: string): void {
    if (isWrapped(openai.Chat.Completions.prototype)) {
      this._unwrap(openai.Chat.Completions.prototype, 'create')
    } else if (isWrapped(openai.Images.prototype)) {
      this._unwrap(openai.Images.prototype, 'generate')
    } else if (isWrapped(openai.Embeddings.prototype)) {
      this._unwrap(openai.Embeddings.prototype, 'create')
    }

    this._wrap(
      openai.Chat.Completions.prototype,
      'create',
      (originalMethod: (...args: any[]) => any) =>
        chatCompletionCreate(originalMethod, this.tracer, this.instrumentationVersion, moduleVersion)
    )

    this._wrap(
      openai.Images.prototype,
      'generate',
      (originalMethod: (...args: any[]) => any) =>
        imagesGenerate(originalMethod, this.tracer, this.instrumentationVersion, moduleVersion)
    )

    this._wrap(
      openai.Embeddings.prototype,
      'create',
      (originalMethod: (...args: any[]) => any) =>
        embeddingsCreate(originalMethod, this.tracer, this.instrumentationVersion, moduleVersion)
    )
  }

  private _unpatch (openai: typeof OpenAI): void {
    this._unwrap(openai.Chat.Completions.prototype, 'create')
    this._unwrap(openai.Images.prototype, 'generate')
    this._unwrap(openai.Embeddings.prototype, 'create')
  }
}

export const openAIInstrumentation = new OpenAIInstrumentation()
