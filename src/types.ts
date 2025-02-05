declare module '@yandex/ymaps3-types/import' {
    interface Import {
        (pkg: '@yandex/ymaps3-context-menu'): Promise<typeof import('./index')>;
    }
}

export {};
