import IEventServer from "./events_server_interface";

export interface IEventHandler {
    addEventHandler(event: IEventServer): void;
} 