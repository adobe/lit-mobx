import { UpdatingElement, Constructor } from 'lit-element';
interface ClassDescriptor {
    kind: 'class';
    elements: ClassElement[];
    finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
}
interface ClassElement {
    kind: 'field' | 'method';
    key: PropertyKey;
    placement: 'static' | 'prototype' | 'own';
    initializer?: Function;
    extras?: ClassElement[];
    finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
    descriptor?: PropertyDescriptor;
}
export declare const mobxReactive: () => (classOrDescriptor: ClassDescriptor | Constructor<UpdatingElement>) => any;
export {};
//# sourceMappingURL=decorator.d.ts.map