export abstract class Provider {
    constructor(...args: ProviderConstructor[]) {}
}

type ProviderConstructor = new (...args: any[]) => Provider

export class Container {
    static container: Container = new Container();
    private providers: Map<string, ProviderConstructor> = new Map();
    private instances: Map<string, Provider> = new Map();

    register(provider: ProviderConstructor, token?: string) {
        if (token) {
            Container.container.providers.set(token, provider);
        } else {
            Container.container.providers.set(provider.name, provider);
        }
    }

    resolve<T extends Provider>(token: string): T {
        const provider = Container.container.providers.get(token);
        if (!provider) {
            throw new Error(`No provider found for token ${token}`);
        } else {
            const instance = Container.container.instances.get(token);
            if (!instance) {
                Container.container.instances.set(token, new provider());
                return <T>Container.container!.instances!.get(token);
            }
            return <T>instance;
        }
    }
}
