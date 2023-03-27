[![Known Vulnerabilities](https://snyk.io/test/github/adobe/lit-mobx/badge.svg)](https://snyk.io/test/github/adobe/lit-mobx)

# lit-mobx

Mixin and base class that allow easy usage of mobx observables with
[`lit`](https://lit.dev/).

The mixin implementation is based heavily on the work of Alexander Weiss in his
[`mobx-lit-element`](https://github.com/alexanderweiss/mobx-lit-element) implementation. This has been rewritten to
support multiple forms of usage (mixin, or base class) as well as to be based on typescript to get type definitions.

## Installation

As a dependency:

```
npm install --save @adobe/lit-mobx lit mobx
```

## LitElement 2.0 Usage

This library has been updated to the latest version of Lit which we highly recommend you update to. However if you wish to continue using LitMobx with [LitElement 2.0](https://lit-element.polymer-project.org/guide) then install the 1.0 major version:

```
npm install --save @adobe/lit-mobx@^1.0.0
```

We will backport any security patches (though don't expect there to be any) in this major version as necessary.

## Demo

```
npm install
npm run demo
```

## Usage

See the [JavaScript](https://stackblitz.com/edit/lit-mobx-demo?file=index.js) and [TypeScript](https://stackblitz.com/edit/lit-mobx-typescript?file=index.ts) example projects on StackBlitz. See [this example](https://stackblitz.com/edit/lit-mobx-typescript-mobx6?file=index.ts) for a demonstration of usage with Mobx v6 in Typescript without the use of decorators.

```typescript
import { html, TemplateResult } from 'lit';
import { customElement, LitElement } from 'lit/decorators.js';
import { observable, action } from 'mobx';
import { MobxLitElement } from '@adobe/lit-mobx';

// create a mobx observable
class Counter {
    @observable
    public count = 0;

    @action
    public increment() {
        this.count++;
    }
}

// create instance that can be shared across components
const counter = new Counter();

// create a new custom element, and use the base MobxLitElement class
// alternatively you can use the MobxReactionUpdate mixin, e.g. `class MyElement extends MobxReactionUpdate(LitElement)`
@customElement('my-element')
export class MyElement extends MobxLitElement {
    private counter = counter;

    // any observables accessed in the render method will now trigger an update
    public render(): TemplateResult {
        return html`
            Count is ${this.counter.count}
            <br />
            <button @click=${this.incrementCount}>Add</button>
        `;
    }

    private incrementCount() {
        this.counter.increment();
    }
}
```

For further examples see the [demo folder](./demo).

NOTE: observables are only hooked for updating the render function if those observables are directly used within the render function. The implementation of this library is such that we essential wrap the render function in an `autorun` block to hook these observables for re-running render. If you wish to response to an observable property to calculate some other result that then itself is used in the render function, then you need to use the regular MobX methods for observability in a property changed callback or some other lifecycle function to setup that observation and the write to a property in your component that is appropriately decorated to drive Lit's regular update cycle.

## Custom Reaction

In some rare cases applications may need to have multiple different major versions of Mobx within a single app. This can lead to issues where the version of mobx used in various places needs to be specifically imported from aliased versions of mobx, e.g. aliasing `mobx 6.x` to `mobx6`.

To help support these cases lit-mobx provides the custom implementation of the MobxReactionUpdate mixin, `MobxReactionUpdateCustom`, that supports taking the `Reaction` constructor as a second argument. This allows the user to define which version of mobx to pass, and ensures that no side effects are caused by lit-mobx importing `mobx` directly.

Example usage:

```typescript
import { MobxReactionUpdateCustom } from '@adobe/lit-mobx/lib/mixin-custom.js';

// import your specific mobx version
import { Reaction } from 'mobx6';

// and pass it to the mixin to create your own mobx lit element base class
class Mobx6LitElement extends MobxReactionUpdateCustom(LitElement, Reaction) {}
```

### Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
