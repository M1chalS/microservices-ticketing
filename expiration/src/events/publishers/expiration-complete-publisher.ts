import {Publisher, Subjects, ExpirationCompleteEvent} from "@m1chals-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}