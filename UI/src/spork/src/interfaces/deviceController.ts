export interface DeviceController {
    connect(): Promise<boolean>;
    disconnect(): Promise<void>;
    readStateMessage(): Promise<void>;
    sendCommand(type: string, data: any): Promise<void>;
}