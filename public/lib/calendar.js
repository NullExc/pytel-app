
import googleAuth from './google-auth';

var GoogleApi;

function setGoogleApi(api) {
    GoogleApi = api;
}

function listUpcomingEvents() {
    GoogleApi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;

        if (events.length > 0) {
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                console.log(event.summary + ' (' + when + ')');
            }
        } else {
            console.log('No upcoming events found.');
        }
    });
}

export default { setGoogleApi, listUpcomingEvents };