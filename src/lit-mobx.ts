/*
Copyright 2018 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { MobxReactionUpdate } from './lib/mixin.js';
import { LitElement } from 'lit';

export * from './lib/mixin.js';

/**
 * A LitElement derived class which uses the MobxReactionUpdate mixin to create a mobx
 * reactive implementation of LitElement.
 *
 * Any observables used in the render template of the element will be tracked by a reaction
 * and cause an update of the element upon change.
 */
export class MobxLitElement extends MobxReactionUpdate(LitElement) {}
