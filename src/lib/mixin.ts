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

import { UpdatingElement, PropertyValues } from 'lit-element';
import { Reaction } from 'mobx';

const reactionSymbol = Symbol('LitMobxRenderReaction');

type UpdatingElementConstructor = new (...args: any[]) => UpdatingElement;

export interface ObserveRenderMixin {
    readonly isObserving: boolean;
}

type ReturnConstructor = new (...args: any[]) => UpdatingElement &
    ObserveRenderMixin;

/**
 * A class mixin which can be applied to lit-element's
 * [UpdatingElement](https://lit-element.polymer-project.org/api/classes/_lib_updating_element_.updatingelement.html)
 * derived classes. This mixin adds a mobx reaction which tracks the update method of UpdatingElement.
 *
 * Any observables used in the render template of the element will be tracked by a reaction
 * and cause an update of the element upon change.
 *
 * @param constructor the constructor to extend from to add the mobx reaction, must be derived from UpdatingElement.
 */
export function MobxReactionUpdate<T extends UpdatingElementConstructor>(
    constructor: T
): T & ReturnConstructor {
    return class MobxReactingElement extends constructor {
        // NOTE: using a symbol here to avoid potential name collisions in derived classes
        private [reactionSymbol]: Reaction;

        public get isObserving(): boolean {
            return this[reactionSymbol] !== undefined;
        }

        public connectedCallback(): void {
            super.connectedCallback();
            this[reactionSymbol] = new Reaction(
                `${this.constructor.name || this.nodeName}.update()`,
                () => this.requestUpdate()
            );
            if (this.hasUpdated) this.requestUpdate();
        }

        public disconnectedCallback(): void {
            super.disconnectedCallback();
            if (this[reactionSymbol]) {
                this[reactionSymbol].dispose();
            }
        }

        protected update(changedProperties: PropertyValues): void {
            let result;
            if (this[reactionSymbol]) {
                this[reactionSymbol].track(() => {
                    result = super.update(changedProperties);
                });
            }
            return result;
        }
    };
}
