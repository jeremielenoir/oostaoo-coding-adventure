import React from "react";
import { render, screen } from "@testing-library/react";

import InterviewHome from "../pages/InterviewHome";

describe('InterviewHome component', () => {
    test('should render without crash', async() => {
        render(<InterviewHome />)
    })
})