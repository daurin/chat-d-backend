import WebSocket from 'ws';
import Joi, { string } from 'joi';
import { IWebSocketSender } from '../models/web_socket_sender_interface';

// export default (data: WebSocket.Data, sender: IWebSocketSender, events: Array<string>): boolean => {
export default (params: {
    client: WebSocket,
    data: WebSocket.Data,
    events: Array<string>,
    sender: IWebSocketSender,
}): boolean => {
    let {client,data,events,sender}= params;
    if ((typeof data) != typeof '') {
        sender.send({
            'error': 'Bad Request',
            'success': false
        },client);
        return false;
    }
    let dataParsed: any;
    try {
        dataParsed = JSON.parse(data.toString());
    }
    catch (err) {
        sender.send({
            'error': 'Json invalid',
            'success': false
        },client);
        return false;
    }

    const schema = Joi.object({
        id: Joi.string(),
        event: Joi.string().required(),
        data: Joi.any(),
        headers: Joi.object().pattern(Joi.string(), Joi.string())
    });

    const resultValidate: Joi.ValidationResult = schema.validate(dataParsed, {
        abortEarly: false
    });
    let jsonResponse = {
        'error': {
            message: 'Bad request'
        },
        'errors': Array<any>(),
        'success': false
    };
    if (resultValidate?.error != undefined) {
        jsonResponse['errors'] = resultValidate.error.details.map((e) => {
            return {
                path: e.path[0],
                message: e.message
            };
        });
        let eventError: any = jsonResponse['errors'].find((e) => e['path'] == 'event');
    }

    let eventError: any = jsonResponse['errors'].find((e) => e['path'] == 'event');
    if (eventError == undefined) {
        if (!events.includes(dataParsed['event'])) {
            jsonResponse['errors'].push({
                path: 'event',
                message: "Event not found"
            });
        }
    }

    if (jsonResponse['errors'].length > 0) {
        sender.send(jsonResponse,client);
        return false;
    }
    return true;
}