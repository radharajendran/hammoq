import axios from 'axios';

/**
 * Create an Axios Client with defaults
 */
const client = axios.create({
    baseURL: 'http://localhost:3001/'
});


const onSuccess = (response) => {
    console.log('Request Successful!', response);
    return response.data;
};

const onError = (error) => {
    console.error('Request Failed:', error.config);

    if (error.response) {
        // Request was made but server responded with something
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        console.error('Headers:', error.response.headers);

    } else {
        // Something else happened while setting up the request
        // triggered the error
        console.error('Error Message:', error.message);
    }

    return Promise.reject(error.response || error.message);
};

const request = (options) => {
    return client(options)
        .then(onSuccess)
        .catch(onError);
};

const get = (url) => {
    return request({
        url: `${url}`,
        method: 'GET'
    });
};

const post = (url, data, config) => { 

    const cfg = config || {
        headers: {
            'content-type': 'application/json',
        },
    };

    return request({          
        url: `${url}`,
        method: `POST`,
        data: data || {},
        ...cfg
    });
};

const put = (url, data) => {   
    return request({
        url: `${url}`,
        method: `PUT`,
        data: data || {},
    });
};

const remove = (url, data) => {   
    return request({
        url: `${url}`,
        method: `DELETE`,
        data: data || {},
    });
};

export {
    get, 
    post, 
    put, 
    remove
};
