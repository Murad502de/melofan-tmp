import { SET_REFERRAL } from "../actions/referral"

const initialState = {
    referral: null,
};

export function referralReducer(state = initialState, action) {
    if ( action.type === SET_REFERRAL ) {
        return { ...state, referral: action.referral }
    }
    return state
}
