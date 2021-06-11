const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    token: '',
    birthDate: '',
    image: '',
    imageType: ''
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_USER': {
            for (let key in action.data) {
                if (action.data.hasOwnProperty(key)) {
                  state[key] = action.data[key];
                }
            }      
            return  Object.assign({}, state);
        }
    }
}