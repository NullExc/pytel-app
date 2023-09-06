import Axios from 'axios';

export default {
    request: function (options, callback) {
        var config = {
            method: options.method,
            url: options.url
        }
        if (options.headers) {
            config.headers = options.headers;
        }
        if (options.data) {
            config.data = options.data;
        }

        Axios(config)
            .then(function (response) {
                callback(null, response);
            })
            .catch(function (error) {
                callback(error, null);
            })
    }
}