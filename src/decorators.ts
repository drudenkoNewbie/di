import { Container, Provider } from "./main";

export function injectClasses(classMap: { [key: string]: new () => any }) {
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                for (const key in classMap) {
                    if (classMap.hasOwnProperty(key)) {
                        // @ts-ignore
                        this[key] = <Provider>Container.container.resolve(classMap[key].name);
                    }
                }
            }
        };
    };
}

export function injectable () {
    return function<T extends { new (...args: any[]): {} }>(constructor: T) {
        Container.container.register(constructor);
        return constructor;
    };
}

export function inject(provider: new (...args: any[]) => Provider) {
    return function _inject(target: any, propertyDescriptor: ClassFieldDecoratorContext) {
        propertyDescriptor.addInitializer(function(this: any) {
            this[propertyDescriptor.name] = Container.container.resolve(provider.name)
        });
    }
}
