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
import { Reaction } from 'mobx';
const reactionSymbol = Symbol('LitMobxRenderReaction');

// NOTE: This implementation is based heavily on the work of Alexander Weiss in his
// [mobx-lit-element](https://github.com/alexanderweiss/mobx-lit-element)

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
export function MobxReactionUpdate(constructor) {
    return class MobxReactingElement extends constructor {
        get isObserving() {
            return this[reactionSymbol] !== undefined;
        }
        connectedCallback() {
            super.connectedCallback();
            this[reactionSymbol] = new Reaction(
                `${this.constructor.name || this.nodeName}.update()`,
                () => this.requestUpdate()
            );
            if (this.hasUpdated) this.requestUpdate();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            if (this[reactionSymbol]) {
                this[reactionSymbol].dispose();
            }
        }
        update(changedProperties) {
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
//# sourceMappingURL=mixin.js.map
