import React from 'react'
import Room from '../components/Room'
import {render, screen} from '@testing-library/react'

describe('Room', () => {
    test('Should render without crash', async () => {
        const props = {
            match: {
                params: {
                    hash: ''
                }
            }
        }

        const mockMedia = {
            getUserMedia: jest.fn().mockImplementation(() =>
                Promise.resolve(
                    "stream"
                ))
        }
        global.navigator.mediaDevices = mockMedia

        render(<Room {...props} hash="2"/>)

        // find Roodeo logo
        const roodeoLogo = await screen.findByRole("img", {name: /roodeo logo/i})
        expect(roodeoLogo).toBeInTheDocument()

    }) 
})
