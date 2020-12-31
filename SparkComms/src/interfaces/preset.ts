export interface Preset {
    meta: Meta;
    type: string;
    sigpath: SignalPath[];
    bpm: number;
}

export interface Meta {
    description: string;
    version: string;
    name: string;
    icon: string;
    id: string;
}

export interface FxParam {
    value: any;
    index: number;
}

export interface SignalPath {
    active: boolean;
    params: FxParam[];
    type: string;
    dspId: string;
}