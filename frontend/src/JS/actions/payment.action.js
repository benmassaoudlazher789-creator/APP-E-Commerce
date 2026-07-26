import axios from "axios";
import {
    PAYMENT_LOADING,
    PAYMENT_SUCCESS,
    PAYMENT_FAIL,
    PAYMENT_RESET,
} from "../actionsType/payment.actionType";

// Le paiement est traite cote serveur (/api/payment/process) plutot que simule dans le
// navigateur, pour qu'un client ne puisse pas forger un succes. Aucune cle Stripe n'est
// configuree cote backend non plus : le controller simule une passerelle (meme carte de
// test "toujours refusee"), mais le resultat est authoritatif cote serveur.
export const processPayment = (paymentDetails, amount) => async (dispatch) => {
    dispatch({ type: PAYMENT_LOADING });
    try {
        const { data } = await axios.post("/api/payment/process", {
            method: paymentDetails.method,
            cardNumber: paymentDetails.cardNumber,
            expiry: paymentDetails.expiry,
            cvv: paymentDetails.cvv,
            amount,
        });
        dispatch({ type: PAYMENT_SUCCESS, payload: data.transactionId });
        return { success: true, transactionId: data.transactionId };
    } catch (error) {
        const message = error.response?.data?.msg || "Payment failed. Please try again.";
        dispatch({ type: PAYMENT_FAIL, payload: message });
        return { success: false, error: message };
    }
};

export const resetPayment = () => ({ type: PAYMENT_RESET });
