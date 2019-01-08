interface EventList {
    eventId: Number;
    teamLeader: String;
}

export interface ParticipantData {
    id: String;
    name: String;
    email: String;
    phno: Number;
    gender: String;
    college: String;
    rollno: String;
    source: String;
    year: Number;
    password: String;
    events: EventList[];
    payment: {
        day1: Boolean;
        day2: Boolean;
        day3: Boolean;
        day4: Boolean;
    };
}