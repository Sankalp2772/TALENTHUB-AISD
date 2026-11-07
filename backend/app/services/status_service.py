from fastapi import HTTPException, status

# Fixed Application Status Pipeline Flow:
# APPLIED -> SHORTLISTED -> INTERVIEW_SCHEDULED -> INTERVIEWED -> OFFERED -> ACCEPTED
# Also allow REJECTED at any stage before ACCEPTED.

ALLOWED_TRANSITIONS = {
    "APPLIED": ["SHORTLISTED", "REJECTED"],
    "SHORTLISTED": ["INTERVIEW_SCHEDULED", "REJECTED"],
    "INTERVIEW_SCHEDULED": ["INTERVIEWED", "REJECTED"],
    "INTERVIEWED": ["OFFERED", "REJECTED"],
    "OFFERED": ["ACCEPTED", "REJECTED"],
    "ACCEPTED": [],
    "REJECTED": []
}

def validate_status_transition(current_status: str, new_status: str) -> bool:
    if current_status == new_status:
        return True
    
    allowed_next_states = ALLOWED_TRANSITIONS.get(current_status, [])
    if new_status not in allowed_next_states:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition from {current_status} to {new_status}. Allowed next steps: {allowed_next_states}"
        )
    return True
