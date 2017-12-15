
import googleAuth from './google-auth';

var GoogleApi;

function setGoogleApi(api) {
    GoogleApi = api;
}

function insertEvent(order, customer) {
    console.log('insert event ', order.description);

    var date = new Date();

    var dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    console.log(dateString);

    var event = {
        'summary': customer.fullName,
        'description': order.description,
        'start': {
            'date': dateString,
            'timeZone': 'Europe/Bratislava'
        },
        'end': {
            'date': dateString,
            'timeZone': 'Europe/Bratislava'
        },
        'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=1'
        ]
    }
    var request = GoogleApi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
    });

    request.execute(function (event) {
        console.log('Event created: ', event);
    });


}

export default { setGoogleApi, insertEvent };