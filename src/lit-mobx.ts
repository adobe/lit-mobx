import { LitElement, PropertyValues } from 'lit-element';
import { autorun } from 'mobx';

type DisposerFunc = () => void;

const updateDisposerSymbol = Symbol('autorunUpdateDisposer');

type LitElementConstructor = new (...args: any[]) => LitElement;

export interface ObserveRenderMixin {
    readonly isObserving: boolean;
}

type ReturnConstructor = new (...args: any[]) => LitElement & ObserveRenderMixin;

export function ObserveRender<T extends LitElementConstructor>(constructor: T): T & ReturnConstructor {
    return class ObservingRender extends constructor {
        // NOTE: using a symbol here to avoid potential name collisions in derived classes
        private [updateDisposerSymbol]?: DisposerFunc;

        public get isObserving(): boolean {
            return this[updateDisposerSymbol] !== undefined;
        }

        public connectedCallback(): void {
            super.connectedCallback();
            // we need to request update on the whole element again when re-connecting to reapply changed properties
            // this is due to there potentially being changes to observed properties when disconnected, but since we
            // don't want to do unnecessary autorun work when disconnected we should just update the component when
            // we reconnect
            this.requestUpdate();
        }

        public disconnectedCallback(): void {
            super.disconnectedCallback();
            const disposer = this[updateDisposerSymbol];
            if (disposer) {
                disposer();
                this[updateDisposerSymbol] = undefined;
            }
        }

        protected update(changedProperties: PropertyValues): void {
            // register the autorun once when we're updated after being connected
            if (!this[updateDisposerSymbol]) {
                this[updateDisposerSymbol] = autorun(
                    () => {
                        // by calling normal update implementation our autorun will
                        // register itself on all the properties accessed during render
                        super.update(changedProperties);
                    },
                    {
                        name: this.nodeName, // we assign the name so we can easily trace
                    }
                );
            } else {
                super.update(changedProperties);
            }
        }
    };
}

export class ObservingElement extends ObserveRender(LitElement) { };