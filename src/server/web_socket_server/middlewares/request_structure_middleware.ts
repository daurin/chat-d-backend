import WebSocket from 'ws';
import Joi, { string } from 'joi';
import { json } from 'express';

export default (data: WebSocket.Data, client: WebSocket, events: Array<string>): boolean => {
    if ((typeof data) != typeof '') {
        client.send(JSON.stringify({
            'error': 'Bad Request',
            'success': false
        }));
        return false;
    }
    let dataParsed: any;
    try {
        dataParsed = JSON.parse(data.toString());
    }
    catch (err) {
        client.send(JSON.stringify({
            'error': 'Json invalid',
            'success': false
        }));
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
        client.send(JSON.stringify(jsonResponse));
        return false;
    }
    return true;
}