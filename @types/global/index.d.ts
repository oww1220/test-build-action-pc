export{}

//전역(global)선언 - 글로벌 객체를 확장
declare global {
    interface Window{
        CommonUI: any;
        $: JQuery;
        THREE: any;
    }
    interface HTMLElement {
        iscrolls?: IScroll;
    }
    interface IObj {
        [key: string | number]: any;
    }

    type PromiseCallback = (resolve: (value: any) => void, reject: (reason?: any) => void) => void;
}

declare module 'three' {
    Geometry();
}





