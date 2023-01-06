function setCurrentFeedbackRequestId(current_request_id: string){
    localStorage.setItem("current_feedback_request_id", current_request_id);
}


function getCurrentFeedbackRequestId() {
    return localStorage.getItem("current_feedback_request_id", null);
}

function removeCurrentFeedbackRequestId() {
    localStorage.removeItem("current_feedback_request_id");
}


export {setCurrentFeedbackRequestId, getCurrentFeedbackRequestId, removeCurrentFeedbackRequestId}