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

import { SpanExporter } from '@opentelemetry/sdk-trace-base'
export interface LangtraceInitOptions {
  api_key?: string
  batch?: boolean
  write_to_langtrace_cloud?: boolean
  custom_remote_exporter?: SpanExporter
  api_host?: string
  instrumentations?: {
    openai?: any
    cohere?: any
    anthropic?: any
    groq?: any
    pinecone?: any
    llamaindex?: any
    chromadb?: any
  }
}
export type LangTraceInit = (options?: LangtraceInitOptions) => void
