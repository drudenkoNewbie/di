import { Container } from "./main";

export function injectClasses(container: Container, classMap: { [key: string]: new () => any }) {
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                for (const key in classMap) {
                    if (classMap.hasOwnProperty(key)) {
                        // @ts-ignore
                        this[key] = <Provider>container.resolve(classMap[key].name);
                    }
                }
            }
        };
    };
}

export function injectable (container: Container) {
    return function<T extends { new (...args: any[]): {} }>(constructor: T) {
        container.register(constructor);
        return constructor;
    };
}
