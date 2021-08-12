declare module 'CommonUI' {
    export interface IJqMap {
        map: IObj | null;
        put<T>(key:string | number, value: T): void;
        get<T>(key:string | number): T;
        containsKey(key:string | number): boolean;
        clear(): void;
        remove(key:string | number): void;
        keys(): (string | number)[];
        values(): any[];
        size(): number;
    }
    export type SwiperParam = string | HTMLElement;
    export type slideSortParam = 'slick' | 'swiper';

    export interface Iiscrolls {
        cash: IJqMap | null;
        num: number;
        init(target: string, option: IObj): void;
        resize(): void;
    }

    export interface ILottie {
        elem: HTMLElement | null;
        loopFlag: boolean;
        autoplayFlag: boolean;
        pathString: string;
    }

    export interface ILayerRocket {
        cashGenerator: null | Generator;
        eventChkFlag: boolean;
        open(layer: string, callback?: (layer: string) => void): ()=>Generator;
        close(layer: string, callback?: (layer: string) => void): ()=>Generator;
    }


    /*
    export interface ILayer {
        scrollTop: number;
        calculate(layer: string): void;
        openClick(
            target: string,
            dimmed: string,
            parent: string,
            callback?: (show: () => void, layer: string, targetDom: JQuery) => void
        ): void;
        open(layer: string, dimmed: string, parent: string, callback?: (layer: string) => void): void;
        closeClick(
            target: string,
            dimmed: string,
            parent: string,
            callback?: (hide: () => void, layer: string, targetDom: JQuery) => void
        ): void;
        close(layer: string, dimmed: string, parent: string, callback?: (layer: string) => void): void;
    }
    export interface IEvent {
        toggle(target: string, parent: string | null, callback?: (logic: () => void, layer: JQuery) => void): void;
        goTop(target: JQuery): void;
        topScrollCh(target: JQuery, parent: JQuery): void;
        taps(tab_nav: string, callback?: (swap: () => void) => void): void;
        calander(
            target: string,
            option: IObj,
            callback?: JQuery.TypeEventHandler<HTMLElement, unknown, any, any, 'change'>
        ): void;
        customSelect(parent: string): void;
        changeSelect(target: string): void;
        fixedTop(): void;
    }
    
    export interface IAsync {
        generaterRun(gen: () => Generator): void;
        wait(ms: number, value?: any): Promise<any>;
        promise(callback: PromiseCallback): Promise<any>;
    }
    export interface IFn {
        filter: <T>(f: (a: T) => boolean, iter: Iterable<T>) => Generator<T, void, unknown>;
        map: <T>(f: (a: T) => T, iter: Iterable<T>) => Generator<T, void, unknown>;
        take: <T>(length: number, iter: Iterable<T>) => T[];
        reduce: <T, U>(f: (acc: U, a: T) => U, acc: U, iter: Iterable<T>) => U;
    }
    namespace CommonUI {
        const $: any;
        const Resize: any;
        const Map: any;
        const Slide: any;
        const Layer: ILayer;
        const Event: IEvent;
        const Iscrolls: Iiscrolls;
        const Async: IAsync;
        const Fn: IFn;
    }

    export default CommonUI;
    */
}

