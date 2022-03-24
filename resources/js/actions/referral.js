export const SET_REFERRAL = "SET_REFERRAL";

export function setReferral(ref) {
    return {
        type: SET_REFERRAL,
        referral: ref,
    };
}
