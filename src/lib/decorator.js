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
import { MobxReactionUpdate } from './mixin.js';
const legacyMobxDecorator = (clazz) => {
    // Cast as any because TS doesn't recognize the return type as being a
    // subtype of the decorated class when clazz is typed as
    // `Constructor<UpdatingElement>` for some reason.
    // `Constructor<UpdatingElement>` is helpful to make sure the decorator is
    // applied to elements however.
    // tslint:disable-next-line:no-any
    return MobxReactionUpdate(clazz);
};
const standardMobxDecorator = (descriptor) => {
    const { kind, elements } = descriptor;
    return {
        kind,
        elements,
        // This callback is called once the class is otherwise fully defined
        finisher(clazz) {
            return MobxReactionUpdate(clazz);
        },
    };
};
export const mobxReactive = () => (classOrDescriptor) => typeof classOrDescriptor === 'function'
    ? legacyMobxDecorator(classOrDescriptor)
    : standardMobxDecorator(classOrDescriptor);
//# sourceMappingURL=decorator.js.map