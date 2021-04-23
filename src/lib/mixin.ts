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

import { ReactiveElement, PropertyValues } from 'lit';
import { Reaction } from 'mobx';

const reaction = Symbol('LitMobxRenderReaction');
const cachedRequestUpdate = Symbol('LitMobxRequestUpdate');

type ReactiveElementConstructor = new (...args: any[]) => ReactiveElement;

/**
 * A class mixin which can be applied to lit-element's
 * [ReactiveElement](https://lit.dev/docs/api/ReactiveElement/)
 * derived classes. This mixin adds a mobx reaction which tracks the update method of ReactiveElement.
 *
 * Any observables used in the render template of the element will be tracked by a reaction
 * and cause an update of the element upon change.
 *
 * @param constructor the constructor to extend from to add the mobx reaction, must be derived from ReactiveElement.
 */
export function MobxReactionUpdate<T extends ReactiveElementConstructor>(
    constructor: T
): T {
    return class MobxReactingElement extends constructor {
        // NOTE: using a symbol here to avoid potential name collisions in derived classes
        private [reaction]: Reaction | undefined;

        private [cachedRequestUpdate] = () => {
            this.requestUpdate();
        };

        public connectedCallback(): void {
            super.connectedCallback();
            const name =
                this.constructor.name /* c8 ignore next */ || this.nodeName;
            this[reaction] = new Reaction(
                `${name}.update()`,
                this[cachedRequestUpdate]
            );
            if (this.hasUpdated) this.requestUpdate();
        }

        public disconnectedCallback(): void {
            super.disconnectedCallback();
            if (this[reaction]) {
                this[reaction]!.dispose();
                this[reaction] = undefined;
            }
        }

        protected update(changedProperties: PropertyValues): void {
            if (this[reaction]) {
                this[reaction]!.track(
                    super.update.bind(this, changedProperties)
                );
                /* c8 ignore next 4 */
            } else {
                // this should never happen, but just in case
                super.update(changedProperties);
            }
        }
    };
}
