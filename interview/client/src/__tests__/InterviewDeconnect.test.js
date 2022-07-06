import React from "react";
import InterviewDeconnect from "../pages/InterviewDeconnect";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

describe("InterviewDeconnect component", () => {
    test("Should render without crash", async () => {
        render(
            <BrowserRouter>
                <InterviewDeconnect/>
            </BrowserRouter>
        )

        const youLeftMeeting = screen.getByText(/vous avez quitté la réunion/i)
        expect(youLeftMeeting).toBeInTheDocument()
    })
})