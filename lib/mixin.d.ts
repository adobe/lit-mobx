import { UpdatingElement } from 'lit-element';
declare type UpdatingElementConstructor = new (...args: any[]) => UpdatingElement;
export interface ObserveRenderMixin {
    readonly isObserving: boolean;
}
declare type ReturnConstructor = new (...args: any[]) => UpdatingElement & ObserveRenderMixin;
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
export declare function MobxReactionUpdate<T extends UpdatingElementConstructor>(constructor: T): T & ReturnConstructor;
export {};
//# sourceMappingURL=mixin.d.ts.map