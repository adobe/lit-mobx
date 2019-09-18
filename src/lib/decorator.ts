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

import { UpdatingElement, Constructor } from 'lit-element';
import { MobxReactionUpdate } from './mixin.js';

// Decorator implementation borrowed shamelessly from lit-element:
// https://github.com/Polymer/lit-element/blob/master/src/lib/decorators.ts#L27

// From the TC39 Decorators proposal
interface ClassDescriptor {
    kind: 'class';
    elements: ClassElement[];
    finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
}

// From the TC39 Decorators proposal
interface ClassElement {
    kind: 'field' | 'method';
    key: PropertyKey;
    placement: 'static' | 'prototype' | 'own';
    initializer?: Function;
    extras?: ClassElement[];
    finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
    descriptor?: PropertyDescriptor;
}

const legacyMobxDecorator = (clazz: Constructor<UpdatingElement>) => {
    // Cast as any because TS doesn't recognize the return type as being a
    // subtype of the decorated class when clazz is typed as
    // `Constructor<UpdatingElement>` for some reason.
    // `Constructor<UpdatingElement>` is helpful to make sure the decorator is
    // applied to elements however.
    // tslint:disable-next-line:no-any
    return MobxReactionUpdate(clazz as any);
};

const standardMobxDecorator = (descriptor: ClassDescriptor) => {
    const { kind, elements } = descriptor;
    return {
        kind,
        elements,
        // This callback is called once the class is otherwise fully defined
        finisher(clazz: Constructor<UpdatingElement>) {
            return MobxReactionUpdate(clazz as any);
        },
    };
};

export const mobxReactive = () => (
    classOrDescriptor: Constructor<UpdatingElement> | ClassDescriptor
) =>
    typeof classOrDescriptor === 'function'
        ? legacyMobxDecorator(classOrDescriptor)
        : standardMobxDecorator(classOrDescriptor);
