import calendar from '../lib/calendar';
import googleAuth from '../lib/google-auth';

//$(document).ready(function(){

    function startSignProcess() {
        googleAuth.handleClientLoad(function(GoogleApi) {
            
        });
        console.log('in start sign process', googleAuth.GoogleApi);
    }

    startSignProcess();
    //Code here
// });




